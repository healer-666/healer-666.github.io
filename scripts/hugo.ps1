# Convenience wrapper for this Windows workspace; a normal Hugo install also works.
$ErrorActionPreference = 'Stop'
$version = (Get-Content (Join-Path $PSScriptRoot '../.hugo-version') -Raw).Trim()
$portableHugo = Join-Path $PSScriptRoot "../../.tools/hugo-$version/hugo.exe"
if (Test-Path -LiteralPath $portableHugo) {
    & $portableHugo @args
} elseif (Get-Command hugo -ErrorAction SilentlyContinue) {
    & hugo @args
} else {
    throw "Install Hugo $version and add it to PATH. See README.md."
}
exit $LASTEXITCODE
