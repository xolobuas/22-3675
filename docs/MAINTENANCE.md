# Maintenance Guide

## Daily (2 minutes)
- Open `https://yourdomain/#admin`, check **Bookings** and **Front desk**, and confirm or cancel new requests.

## Weekly (10 minutes)
- Open the site on a phone and a computer and send a test booking (delete it afterwards).
- Check the hotel inbox (and spam) for booking emails.

## Monthly (30 minutes)
- **Backup:** download `data/state.json` (File Manager → right-click → Download). It holds every booking. Keep the last 3 months on Google Drive or a USB drive.
- Check the hosting panel for PHP updates (use 8.2+).
- Review prices, rooms and photos (staff panel → Accommodations; photos in `assets/images/`).

## Every 3 months
- Change the staff password: `php tools/make-hash.php`, paste the new hash into `includes/config.php`.
- Delete old bookings you no longer need (privacy).

## Every year
- Renew the domain and hosting (or confirm auto-renew).
- Refresh photos and descriptions; run a speed test at https://pagespeed.web.dev.

## If something breaks
| Problem | What to check |
|---|---|
| "Server not set up" message | Copy `includes/config.example.php` to `includes/config.php` |
| Booking form says it could not send | Is `data/` writable (775)? Is PHP 8+ selected? |
| Rooms look wrong / empty | Is `data/state.json` valid? Delete it and the starter data is recreated (**this erases bookings** — restore your backup instead) |
| Can't log in | Is `staff_pass_hash` set in `config.php`? Create a new hash |
| Site not secure / redirect loop | SSL installed? Temporarily rename `.htaccess` to `htaccess.txt` |
| Emails not arriving | Check spam; `from_email` must be a real mailbox on your domain |
