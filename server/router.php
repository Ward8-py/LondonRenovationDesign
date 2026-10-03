<?php
// Development router. The public document root is dist, never the project root.
$root = realpath(__DIR__ . '/../dist');
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');
if (preg_match('~(^|/)\.~', $path)) { http_response_code(404); echo 'Page not found.'; return true; }
if ($path === '/') { require $root . '/index.php'; return true; }
$file = realpath($root . $path);
if ($file && str_starts_with($file, $root . DIRECTORY_SEPARATOR) && is_file($file)) return false;
http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo 'Page not found.';
