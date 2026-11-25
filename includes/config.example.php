<?php
// 1) Copy this file to config.php (same folder).   2) Fill in your details.
// NEVER commit or share config.php — it is listed in .gitignore.
return [
    // Where booking requests and messages are emailed
    'notify_email' => 'stay@yourdomain.com',
    // Sender address — must be a real mailbox on YOUR domain, or mail may land in spam
    'from_email'   => 'noreply@yourdomain.com',

    // Staff login for yourdomain.com/#admin
    'staff_user'      => 'manager',
    // Create the hash on your computer:  php tools/make-hash.php   (or see README)
    'staff_pass_hash' => '',
];
