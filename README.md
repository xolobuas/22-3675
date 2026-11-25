# Mashuuru Manor — Hotel Website

Countryside hotel website for Mashuuru Manor, Kajiado County, Kenya: rooms and packages, a live booking form that
checks availability, a food menu with room-service orders, a front-desk message form, and a staff panel.

> **GitHub shows the code only.** The site needs PHP, so it must run on ordinary web hosting
> (see [docs/DOMAIN_AND_HOSTING.md](docs/DOMAIN_AND_HOSTING.md)). GitHub Pages cannot run bookings.

## How it works

| Part | Technology |
|---|---|
| Site (what guests see) | Plain HTML, CSS and JavaScript — no frameworks |
| Backend | One PHP 8 file, `api/index.php` |
| Storage | One JSON file, `data/state.json` (rooms, prices, bookings, requests) — no database needed |
| Email | PHP `mail()` — every booking/message is also emailed to the hotel |
| Staff panel | `https://yourdomain/#admin`, password checked on the server |

The server checks room availability and calculates the price itself, so two guests cannot book the same last room.

## Folder structure

```
├── index.html                 page markup
├── assets/
│   ├── css/style.css          colours, fonts, layout
│   ├── js/app.js              site + staff panel logic
│   └── images/                hotel photos (same file names to swap them)
├── api/index.php              bookings, messages, staff login, shared data
├── includes/config.example.php   copy to config.php and fill in (private)
├── data/state.example.json    starter rooms/packages; state.json is created from it on first use
├── tools/make-hash.php        command-line helper to create the staff password hash
├── docs/                      hosting, security and maintenance guides
└── .htaccess                  HTTPS, security headers, blocks private folders
```

## Put it online (about 20 minutes)

1. Get a domain and hosting — [docs/DOMAIN_AND_HOSTING.md](docs/DOMAIN_AND_HOSTING.md).
2. Upload everything in this folder to `public_html` (File Manager → upload the ZIP → *Extract*). Turn on *Show hidden files* so `.htaccess` is visible.
3. Rename `includes/config.example.php` to `includes/config.php` and set your two email addresses
   (create the mailbox `noreply@yourdomain` in the hosting panel).
4. Create the staff password hash on any computer with PHP: `php tools/make-hash.php`, then paste the result into
   `staff_pass_hash` in `config.php`. No PHP on your computer? Ask your host's support, or use any bcrypt tool that
   produces a `$2y$` hash.
5. Install the free SSL certificate in the hosting panel. **Do this before step 6** — `.htaccess` forces HTTPS.
6. Make sure `data/` is writable (folder 755; use 775 if bookings don't save). Upload `.htaccess` last.
7. Replace the placeholder phone number `254700000000` in `index.html` (3 places) and the email `stay@mashuurumanor.com`.
8. Test: send a booking, check your email, log in at `https://yourdomain/#admin`, then delete the test booking.

**Updating later:** re-upload changed files only. Never overwrite `data/state.json` — it holds your live bookings.

## Testing on your own computer

```
php -S localhost:8000
```
then open `http://localhost:8000`. Create `includes/config.php` first. The HTTPS rules in `.htaccess` only apply on Apache, so they do not get in the way.

## Docs

- [Domain & hosting](docs/DOMAIN_AND_HOSTING.md)
- [Security](docs/SECURITY.md)
- [Maintenance](docs/MAINTENANCE.md)
