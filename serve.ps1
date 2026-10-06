# Local test server for the arcade: serves this folder at http://localhost:8765/
# Run: powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$types = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.json'='application/json'; '.png'='image/png'; '.svg'='image/svg+xml' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add('http://localhost:8765/')
$l.Start()
while ($l.IsListening) {
  $c = $l.GetContext()
  $rel = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
  $p = Join-Path $root $rel
  if (Test-Path $p -PathType Container) { $p = Join-Path $p 'index.html' }
  if (Test-Path $p -PathType Leaf) {
    $b = [IO.File]::ReadAllBytes($p)
    $ext = [IO.Path]::GetExtension($p).ToLower()
    $c.Response.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' })
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
