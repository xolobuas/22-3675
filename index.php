<?php
// Mashuuru Manor — shared state, bookings (with availability check), messages, staff login
declare(strict_types=1);
date_default_timezone_set('Africa/Nairobi');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict', 'secure' => !empty($_SERVER['HTTPS'])]);
session_start();

function out(array $a, int $code = 200): never { http_response_code($code); echo json_encode($a, JSON_UNESCAPED_UNICODE); exit; }
$dataDir = __DIR__ . '/../data';
$stateFile = $dataDir . '/state.json';
$cfgFile = __DIR__ . '/../includes/config.php';
if (!is_file($cfgFile)) out(['ok' => false, 'error' => 'Server not set up: copy includes/config.example.php to includes/config.php'], 500);
$cfg = require $cfgFile;
// First run: create the live data file from the starter data (never overwritten afterwards)
if (!is_file($stateFile) && is_file($dataDir . '/state.example.json')) @copy($dataDir . '/state.example.json', $stateFile);

function clean($v, int $max = 500): string {
  $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', trim((string)$v));
  return mb_substr($v, 0, $max);
}
function hdr(string $v): string { return str_replace(["\r", "\n"], ' ', $v); }
function rid(string $p): string { return $p . round(microtime(true) * 1000) . bin2hex(random_bytes(2)); }
function isDate($s): bool { return is_string($s) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) && strtotime($s) !== false; }
function addDays(string $d, int $n): string { return date('Y-m-d', strtotime("$d +$n day")); }
function nightsBetween(string $a, string $b): int { return (int)round((strtotime($b) - strtotime($a)) / 86400); }

/** Exclusive lock; $fn(&$state, &$save) — set $save=true to write back. Returns $fn's result. */
function withState(string $file, callable $fn) {
  $fh = fopen($file, 'c+');
  if (!$fh) out(['ok' => false, 'error' => 'Server storage unavailable. Please call us.'], 500);
  flock($fh, LOCK_EX);
  $st = json_decode(stream_get_contents($fh) ?: '{}', true);
  if (!is_array($st)) $st = [];
  $st += ['rooms' => [], 'packages' => [], 'bookings' => [], 'requests' => []];
  $save = false;
  $res = $fn($st, $save);
  if ($save) {
    ftruncate($fh, 0); rewind($fh);
    fwrite($fh, json_encode($st, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    fflush($fh);
  }
  flock($fh, LOCK_UN); fclose($fh);
  return $res;
}
function readState(string $file): array {
  return withState($file, function (&$st, &$save) { return $st; });
}
function publicState(array $st): array {
  $bk = [];
  foreach ($st['bookings'] as $b) {
    $bk[] = ['id' => $b['id'], 'roomId' => $b['roomId'], 'pkgId' => $b['pkgId'] ?? '', 'ci' => $b['ci'], 'co' => $b['co'], 'status' => $b['status'] ?? 'new'];
  }
  return ['rooms' => $st['rooms'], 'packages' => $st['packages'], 'bookings' => $bk, 'requests' => []];
}
function freeUnits(array $st, array $room, string $ci, string $co): int {
  if (!empty($room['closed'])) return 0;
  $min = (int)$room['units'];
  for ($d = $ci; $d < $co; $d = addDays($d, 1)) {
    if (in_array($d, $room['blocked'] ?? [], true)) return 0;
    $used = 0;
    foreach ($st['bookings'] as $b)
      if (($b['status'] ?? '') !== 'cancelled' && $b['roomId'] === $room['id'] && $b['ci'] <= $d && $d < $b['co']) $used++;
    $min = min($min, (int)$room['units'] - $used);
  }
  return max(0, $min);
}
function throttle(string $key, int $max, int $window, string $dir): bool {
  $f = $dir . '/rl_' . md5($key) . '.json';
  $now = time();
  $hits = is_file($f) ? (json_decode((string)file_get_contents($f), true) ?: []) : [];
  $hits = array_values(array_filter($hits, fn($t) => $t > $now - $window));
  if (count($hits) >= $max) return false;
  $hits[] = $now;
  file_put_contents($f, json_encode($hits), LOCK_EX);
  return true;
}
function notifyMail(array $cfg, string $subject, string $body, string $replyTo = ''): void {
  $h = 'From: Mashuuru Manor Website <' . hdr($cfg['from_email']) . ">\r\n";
  if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $h .= 'Reply-To: ' . hdr($replyTo) . "\r\n";
  $h .= "Content-Type: text/plain; charset=UTF-8\r\n";
  @mail($cfg['notify_email'], '=?UTF-8?B?' . base64_encode(hdr($subject)) . '?=', $body, $h);
}
function isStaff(): bool { return !empty($_SESSION['staff']); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(['ok' => false, 'error' => 'POST only'], 405);
$d = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($d)) out(['ok' => false, 'error' => 'Bad request'], 400);
$action = $d['action'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
if (!is_file($stateFile)) out(['ok' => false, 'error' => 'Site data missing — make the data/ folder writable.'], 500);

switch ($action) {
  case 'login':
    if (!throttle('login' . $ip, 8, 900, $dataDir)) out(['ok' => false, 'error' => 'Too many attempts. Try again in 15 minutes.'], 429);
    if (($cfg['staff_pass_hash'] ?? '') === '') out(['ok' => false, 'error' => 'Staff password not set yet (see README).'], 503);
    if (hash_equals($cfg['staff_user'], (string)($d['u'] ?? '')) && password_verify((string)($d['p'] ?? ''), $cfg['staff_pass_hash'])) {
      session_regenerate_id(true); $_SESSION['staff'] = true; out(['ok' => true]);
    }
    out(['ok' => false, 'error' => 'Wrong username or password.'], 401);

  case 'logout':
    $_SESSION = []; session_destroy(); out(['ok' => true]);

  case 'state':
    out(['ok' => true, 'state' => publicState(readState($stateFile))]);

  case 'adminState':
    if (!isStaff()) out(['ok' => false, 'error' => 'auth'], 401);
    out(['ok' => true, 'state' => readState($stateFile)]);

  case 'adminSave':
    if (!isStaff()) out(['ok' => false, 'error' => 'auth'], 401);
    $in = $d['state'] ?? null; $known = $d['known'] ?? [];
    if (!is_array($in) || !is_array($in['rooms'] ?? null) || !is_array($in['packages'] ?? null) || !is_array($in['bookings'] ?? null)) out(['ok' => false, 'error' => 'Bad data'], 422);
    $kb = array_flip((array)($known['bookings'] ?? [])); $kr = array_flip((array)($known['requests'] ?? []));
    $final = withState($stateFile, function (&$st, &$save) use ($in, $kb, $kr) {
      // keep anything that arrived after the admin last loaded
      $newB = array_values(array_filter($st['bookings'], fn($b) => !isset($kb[$b['id']])));
      $newR = array_values(array_filter($st['requests'], fn($r) => !isset($kr[$r['id']])));
      $st['rooms'] = $in['rooms']; $st['packages'] = $in['packages'];
      $st['bookings'] = array_merge($newB, array_values($in['bookings']));
      $st['requests'] = array_merge($newR, array_values((array)($in['requests'] ?? [])));
      $save = true;
      return $st;
    });
    out(['ok' => true, 'state' => $final]);

  case 'book':
    if (clean($d['website'] ?? '') !== '') out(['ok' => false, 'error' => 'Could not send.']); // honeypot
    if (!throttle('book' . $ip, 10, 3600, $dataDir)) out(['ok' => false, 'error' => 'Too many requests. Please call or WhatsApp us.'], 429);
    $name = clean($d['name'] ?? '', 120); $email = clean($d['email'] ?? '', 120); $phone = clean($d['phone'] ?? '', 40);
    $ci = $d['check_in'] ?? ''; $co = $d['check_out'] ?? ''; $guests = (int)($d['guests'] ?? 0);
    $roomId = clean($d['roomId'] ?? '', 40); $pkgId = clean($d['pkgId'] ?? '', 40);
    $promo = strtoupper(clean($d['promo'] ?? '', 30)); $msg = clean($d['message'] ?? '', 1500);
    if (mb_strlen($name) < 2) out(['ok' => false, 'error' => 'Please enter your full name.'], 422);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) out(['ok' => false, 'error' => 'Please enter a valid email.'], 422);
    if (!isDate($ci) || !isDate($co)) out(['ok' => false, 'error' => 'Please choose your dates.'], 422);
    $res = withState($stateFile, function (&$st, &$save) use ($ci, $co, $roomId, $pkgId, $guests, $promo, $name, $email, $phone, $msg) {
      $room = null; foreach ($st['rooms'] as $r) if ($r['id'] === $roomId) $room = $r;
      if (!$room) return ['error' => 'Please choose a room or package.'];
      $pkg = null;
      if ($pkgId !== '') {
        foreach ($st['packages'] as $p) if ($p['id'] === $pkgId) $pkg = $p;
        if (!$pkg || $pkg['roomId'] !== $roomId) return ['error' => 'That package is not available.'];
        $co = addDays($ci, max(1, (int)$pkg['nights']));
      }
      if ($ci < date('Y-m-d')) return ['error' => 'Check-in cannot be in the past.'];
      if ($co <= $ci) return ['error' => 'Check-out must be after check-in.'];
      if (nightsBetween($ci, $co) > 60) return ['error' => 'For stays over 60 nights please contact us.'];
      if ($guests < 1 || $guests > 12) return ['error' => 'Guests must be between 1 and 12.'];
      if ($guests > (int)$room['guests']) return ['error' => $room['name'] . ' sleeps up to ' . $room['guests'] . ' guests.'];
      if (freeUnits($st, $room, $ci, $co) <= 0) return ['error' => 'Sorry, that stay is fully booked for those dates.'];
      $total = $pkg ? (int)$pkg['price'] : nightsBetween($ci, $co) * (int)$room['price'];
      if ($promo === 'MANOR10') $total = (int)round($total * 0.9);
      $ref = 'MM-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
      array_unshift($st['bookings'], ['id' => rid('b'), 'ref' => $ref, 'name' => $name, 'email' => $email, 'phone' => $phone, 'ci' => $ci, 'co' => $co,
        'guests' => $guests, 'roomId' => $roomId, 'pkgId' => $pkgId, 'msg' => $msg, 'status' => 'new', 'total' => $total, 'created' => (int)(microtime(true) * 1000)]);
      $save = true;
      return ['ok' => true, 'ref' => $ref, 'total' => $total, 'stay' => ($pkg ? $pkg['name'] . ' · ' : '') . $room['name'], 'ci' => $ci, 'co' => $co];
    });
    if (empty($res['ok'])) out(['ok' => false, 'error' => $res['error'] ?? 'Could not book.', 'state' => publicState(readState($stateFile))], 409);
    notifyMail($cfg, "[Mashuuru Manor] Booking request {$res['ref']} — $name",
      "Reference: {$res['ref']}\nName: $name\nEmail: $email\nPhone: $phone\nStay: {$res['stay']}\nCheck-in: {$res['ci']}\nCheck-out: {$res['co']}\nGuests: $guests\nTotal: KES " . number_format($res['total']) . "\nMessage: $msg\n\nManage it at the site's #admin page.", $email);
    out(['ok' => true, 'ref' => $res['ref'], 'total' => $res['total'], 'state' => publicState(readState($stateFile))]);

  case 'request':
    if (clean($d['website'] ?? '') !== '') out(['ok' => true]);
    if (!throttle('req' . $ip, 15, 3600, $dataDir)) out(['ok' => false, 'error' => 'Too many requests'], 429);
    $type = clean($d['type'] ?? '', 80); $name = clean($d['name'] ?? '', 120); $where = clean($d['where'] ?? '', 120); $msg = clean($d['msg'] ?? '', 1500);
    $items = array_map(fn($i) => clean($i, 120), array_slice((array)($d['items'] ?? []), 0, 40));
    $total = (int)($d['total'] ?? 0);
    if ($type === '' || $name === '') out(['ok' => false, 'error' => 'Missing details'], 422);
    $req = ['id' => rid('q'), 'type' => $type, 'name' => $name, 'where' => $where, 'msg' => $msg, 'status' => 'new', 'created' => (int)(microtime(true) * 1000)];
    if ($items) { $req['items'] = $items; $req['total'] = $total; }
    withState($stateFile, function (&$st, &$save) use ($req) { array_unshift($st['requests'], $req); $save = true; });
    notifyMail($cfg, "[Mashuuru Manor] $type — $name", "Type: $type\nFrom: $name\nRoom/phone: $where\n" . ($items ? "Items: " . implode('; ', $items) . "\nTotal: KES " . number_format($total) . "\n" : '') . "Message: $msg\n");
    out(['ok' => true]);
}
out(['ok' => false, 'error' => 'Unknown action'], 400);
