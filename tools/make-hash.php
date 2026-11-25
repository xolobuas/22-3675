<?php
// Command-line helper:  php tools/make-hash.php
// Prints a password hash to paste into includes/config.php as 'staff_pass_hash'.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }   // never runs from a web browser
fwrite(STDERR, "Type a strong password (12+ characters) and press Enter: ");
$pw = trim((string) fgets(STDIN));
if (strlen($pw) < 12) { fwrite(STDERR, "Too short — use at least 12 characters.\n"); exit(1); }
echo password_hash($pw, PASSWORD_DEFAULT), "\n";
