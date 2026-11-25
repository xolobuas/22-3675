<?php
// Staff page: log in to see and manage booking requests.
require __DIR__ . '/../includes/db.php';
start_secure_session();
header('X-Robots-Tag: noindex');

$config = app_config();
$loginError = '';

// Log out
if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: index.php');
    exit;
}

// Log in (with a small delay + attempt limit against password guessing)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'])) {
    $_SESSION['fails'] = $_SESSION['fails'] ?? 0;
    if ($_SESSION['fails'] >= 5) {
        $loginError = 'Too many attempts. Close the browser and try again later.';
    } elseif (check_csrf($_POST['csrf'] ?? null)
        && hash_equals($config['admin_user'], (string) $_POST['username'])
        && $config['admin_password_hash'] !== ''
        && password_verify((string) $_POST['password'], $config['admin_password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        $_SESSION['fails'] = 0;
        header('Location: index.php');
        exit;
    } else {
        $_SESSION['fails']++;
        sleep(1);
        $loginError = 'Wrong username or password.';
    }
}

// Change a booking status
if (!empty($_SESSION['admin']) && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status'])) {
    if (check_csrf($_POST['csrf'] ?? null) && in_array($_POST['status'], ['new', 'confirmed', 'cancelled'], true)) {
        db()->prepare('UPDATE booking_requests SET status = ? WHERE id = ?')
            ->execute([$_POST['status'], (int) $_POST['id']]);
    }
    header('Location: index.php');
    exit;
}

$token = csrf_token();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bookings — Mashuuru Manor</title>
<style>
  body { font-family: system-ui, sans-serif; background: #f8f4ea; color: #24352a; margin: 0; }
  header { background: #1c3021; color: #f1ebdc; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
  header a { color: #e3b45f; }
  main { max-width: 1200px; margin: 24px auto; padding: 0 16px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; }
  th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2dac7; font-size: 14px; vertical-align: top; }
  th { background: #2f5236; color: #f1ebdc; }
  .login { max-width: 360px; margin: 80px auto; background: #fff; padding: 32px; border-radius: 16px; }
  input, select, button { width: 100%; padding: 10px; margin-top: 8px; border: 1px solid #e2dac7; border-radius: 8px; font: inherit; }
  button { background: #1c3021; color: #f1ebdc; cursor: pointer; border: 0; }
  .err { color: #b3261e; }
  td form { display: flex; gap: 6px; } td form select, td form button { margin: 0; width: auto; padding: 6px; }
</style>
</head>
<body>
<?php if (empty($_SESSION['admin'])): ?>
  <form method="post" class="login">
    <h2>Staff login</h2>
    <?php if ($loginError): ?><p class="err"><?= e($loginError) ?></p><?php endif; ?>
    <input type="hidden" name="csrf" value="<?= e($token) ?>">
    <input name="username" placeholder="Username" required autocomplete="username">
    <input name="password" type="password" placeholder="Password" required autocomplete="current-password">
    <button type="submit">Log in</button>
  </form>
<?php else:
  $rows = db()->query('SELECT * FROM booking_requests ORDER BY created_at DESC LIMIT 500')->fetchAll(); ?>
  <header><strong>Mashuuru Manor — Booking requests</strong><a href="?logout=1">Log out</a></header>
  <main>
    <table>
      <tr><th>Received</th><th>Guest</th><th>Room</th><th>Dates</th><th>Guests</th><th>Message</th><th>Status</th></tr>
      <?php foreach ($rows as $r): ?>
      <tr>
        <td><?= e($r['created_at']) ?></td>
        <td><?= e($r['full_name']) ?><br><a href="mailto:<?= e($r['email']) ?>"><?= e($r['email']) ?></a><br><?= e($r['phone']) ?></td>
        <td><?= e($r['room_type']) ?></td>
        <td><?= e($r['check_in']) ?> → <?= e($r['check_out']) ?></td>
        <td><?= (int) $r['guests'] ?></td>
        <td><?= nl2br(e($r['message'])) ?></td>
        <td>
          <form method="post">
            <input type="hidden" name="csrf" value="<?= e($token) ?>">
            <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
            <select name="status">
              <?php foreach (['new', 'confirmed', 'cancelled'] as $s): ?>
                <option <?= $r['status'] === $s ? 'selected' : '' ?>><?= $s ?></option>
              <?php endforeach; ?>
            </select>
            <button>Save</button>
          </form>
        </td>
      </tr>
      <?php endforeach; ?>
      <?php if (!$rows): ?><tr><td colspan="7">No booking requests yet.</td></tr><?php endif; ?>
    </table>
  </main>
<?php endif; ?>
</body>
</html>
