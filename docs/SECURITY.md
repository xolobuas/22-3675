# Security Guide

## What is already built in
| Protection | Where | What it stops |
|---|---|---|
| HTTPS forced | `.htaccess` | Data being read on public Wi-Fi |
| Staff password hashed (`password_hash`) and checked on the server | `api/index.php`, `includes/config.php` | Password readable if files leak |
| Login attempt limit (8 per 15 min per visitor) | `api/index.php` | Password guessing |
| Server-side validation, availability check and price calculation | `api/index.php` | Fake, oversized or underpriced bookings |
| Honeypot field + per-visitor rate limit on bookings and messages | booking form, `api/index.php` | Spam bots, flooding |
| File locking on the data file | `api/index.php` | Two bookings corrupting each other |
| Secure session cookie (HttpOnly, SameSite=Strict, Secure) | `api/index.php` | Session theft, cross-site requests |
| Email header injection blocked | `api/index.php` | Spammers abusing the mail form |
| Output escaping of everything shown in the staff panel | `assets/js/app.js` | Malicious scripts in booking messages (XSS) |
| Strict Content-Security-Policy (no inline scripts), HSTS, X-Frame-Options, nosniff | `.htaccess` | Clickjacking, script injection |
| `includes/`, `data/`, `tools/`, `docs/` blocked from the web | `.htaccess` | Visitors downloading config or booking data |
| Directory listing off | `.htaccess` | Visitors browsing your folders |
| Guest names/contacts never sent to the public site | `api/index.php` | Leaking guest data |

## Your checklist after going live
- [ ] SSL certificate installed and the site opens with `https://`
- [ ] `https://yourdomain/data/state.json` and `/includes/config.php` show **403/404**, not content
- [ ] Staff password at least 12 characters, not used anywhere else
- [ ] `includes/config.php` never shared, emailed or committed to GitHub
- [ ] Hosting and domain accounts protected with **two-factor authentication (2FA)**
- [ ] Automatic daily backups switched on in the hosting panel
- [ ] PHP set to the latest stable version (8.2 or newer)

## If the repository is public on GitHub
`config.php` and `data/state.json` are in `.gitignore` so passwords and guest data are not published. Check with
`git status` before every commit. If one is ever committed by mistake, change the staff password immediately.

## Guest data & privacy
Bookings contain personal data (name, email, phone). Kenya's **Data Protection Act 2019** applies:
collect only what you need, delete old bookings you no longer need (staff panel → Bookings → Delete), and add a short
privacy notice to the website.

## Known limits
- The staff panel is one shared login. For several staff with separate accounts, a database-backed version is needed.
- The JSON file suits a small hotel; if you expect hundreds of bookings a day, move to MySQL.
