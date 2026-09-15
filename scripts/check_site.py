"""Check a Hugo production build using only the Python standard library."""

from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.ids = set()
        self.headings = 0
        self.redirect = False
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and attrs.get("http-equiv", "").lower() == "refresh":
            self.redirect = True
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "h1":
            self.headings += 1
        for attr in ("href", "src"):
            if attrs.get(attr):
                self.links.append(attrs[attr])


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public").resolve()
    origin = "https://healer-666.github.io"
    errors = []
    pages = {p: Page(p.read_text(encoding="utf-8")) for p in root.rglob("*.html")}
    required = ["index.html", "about/index.html", "posts/index.html", "links/index.html",
                "tags/index.html", "categories/index.html", "404.html",
                "posts/index.xml", "sitemap.xml", "robots.txt"]
    for name in required:
        if not (root / name).is_file():
            errors.append(f"Missing required output: {name}")
    for path, page in pages.items():
        relative = path.relative_to(root).as_posix()
        # Hugo pagination redirects contain no page content.
        if page.redirect:
            continue
        if page.headings != 1:
            errors.append(f"{relative}: expected one h1, got {page.headings}")
        for link in page.links:
            url = urlsplit(urljoin(f"{origin}/{relative}", link))
            if url.scheme not in ("http", "https") or url.netloc != urlsplit(origin).netloc:
                continue
            target = root / unquote(url.path).lstrip("/")
            if target.is_dir():
                target /= "index.html"
            if not target.is_file():
                errors.append(f"{relative}: broken link {link}")
            elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
                errors.append(f"{relative}: missing anchor {link}")
    for name in ("posts/index.xml", "sitemap.xml"):
        try:
            ET.parse(root / name)
        except (OSError, ET.ParseError) as exc:
            errors.append(f"Invalid XML {name}: {exc}")
    if errors:
        print("\n".join(errors))
        return 1
    print(f"Validated {len(pages)} HTML pages, internal links, assets, RSS and sitemap.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
