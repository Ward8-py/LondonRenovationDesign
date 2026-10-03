<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, string $message, bool $success = false): void {
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST'); respond(405, 'Please submit the enquiry form.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) respond(413, 'Your enquiry is too long. Please shorten it.');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originHost = parse_url($origin, PHP_URL_HOST);
$requestHost = explode(':', $_SERVER['HTTP_HOST'] ?? '')[0];
if ($origin !== '' && $originHost !== $requestHost) respond(403, 'Please send your enquiry from our website.');
$raw = file_get_contents('php://input', false, null, 0, 16385);
if (strlen($raw) > 16384) respond(413, 'Your enquiry is too long. Please shorten it.');
$data = json_decode($raw, true);
if (!is_array($data)) respond(400, 'Please check your enquiry and try again.');
$fields = ['name' => 100, 'email' => 254, 'phone' => 30, 'postcode' => 12, 'service' => 60, 'message' => 3000, 'website' => 200];
foreach ($fields as $field => $max) {
    if (isset($data[$field]) && !is_string($data[$field])) respond(422, 'Please check your contact details.');
    $data[$field] = trim($data[$field] ?? '');
    if (strlen($data[$field]) > $max) respond(422, 'Please shorten your enquiry or contact us directly.');
}
if ($data['website'] !== '') respond(422, 'Please call or email us directly.');
if ($data['name'] === '' || $data['postcode'] === '' || strlen($data['message']) < 10) respond(422, 'Please add your name, postcode and a short description of your project.');
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $data['email'])) respond(422, 'Please enter a valid email address.');
$services = ['Renovation', 'Fire & flood restoration', 'Kitchens & bathrooms', 'Extensions & loft conversions', 'Something else'];
if (!in_array($data['service'], $services, true)) respond(422, 'Please choose one of the listed services.');

// Enable only after the PHP host has a working, authenticated outgoing-mail service.
// Preview never pretends a message was delivered and never stores personal enquiry data.
if (getenv('LRD_MAIL_ENABLED') !== '1') respond(503, 'We couldn’t send your enquiry online. Please use the email link below or call 0333 988 0198.');

// Rate limit outside the public web root; store only timestamps, not enquiry contents.
$key = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$ratePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'lrd-enquiry-' . $key . '.json';
$handle = fopen($ratePath, 'c+');
if (!$handle || !flock($handle, LOCK_EX)) respond(503, 'Please email or call us while online enquiries are unavailable.');
$attempts = json_decode(stream_get_contents($handle), true) ?: [];
$attempts = array_values(array_filter($attempts, fn($time) => $time > time() - 3600));
if (count($attempts) >= 5) { flock($handle, LOCK_UN); fclose($handle); respond(429, 'You’ve sent several enquiries. Please call or email us directly.'); }
$attempts[] = time(); ftruncate($handle, 0); rewind($handle); fwrite($handle, json_encode($attempts)); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
$body = "Website enquiry\n\n";
foreach (['name', 'email', 'phone', 'postcode', 'service', 'message'] as $field) $body .= ucfirst($field) . ': ' . $data[$field] . "\n\n";
$headers = ['From' => 'website@londonrenovationdesign.co.uk', 'Reply-To' => $data['email'], 'Content-Type' => 'text/plain; charset=UTF-8'];
$sent = mail('info@londonrenovationdesign.co.uk', 'Website enquiry: ' . $data['service'], $body, $headers);
if (!$sent) respond(503, 'We couldn’t send your enquiry. Please use the email link below or call the team.');
respond(200, 'Your enquiry has been accepted for sending.', true);
