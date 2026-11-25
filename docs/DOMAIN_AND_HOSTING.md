# Domain & Hosting Guide

## 1. Choose a domain name
Good options (check availability):
- `mashuurumanor.com` — international guests
- `mashuurumanor.co.ke` — strong local trust in Kenya
- Buy both if you can and point one to the other.

Where to buy:
| Registrar | Good for | Approx. price / year |
|---|---|---|
| Truehost / HostPinnacle / Safaricom (.co.ke) | Kenyan domains, M-Pesa payment | KES 1,000–1,500 |
| Namecheap | .com, free privacy protection | US$10–15 |
| Hostinger | Domain + hosting together | Often free for year 1 with hosting |

Tips: turn on **auto-renew**, turn on **domain privacy**, and use an email you will always have access to.

## 2. Choose hosting
This website needs **PHP 8+** (no database), which every shared host includes.

| Host | Plan | Approx. price | Notes |
|---|---|---|---|
| Hostinger | Premium / Business | US$3–5 / month | Easy hPanel, free SSL, free email |
| Namecheap | Stellar | US$3–5 / month | cPanel, free SSL |
| Truehost / HostPinnacle | Standard | KES 2,500–6,000 / year | Local support, M-Pesa |

Choose a plan with: free SSL, daily backups, at least 1 email account, and a data centre close to your guests (Europe or Africa for Kenya).

## 3. Connect the domain to the hosting
- If domain and hosting are from the **same company**, it connects automatically.
- If they are **different**, set the domain's **nameservers** to the ones your host gives you (e.g. `ns1.dns-parking.com`, `ns2.dns-parking.com` for Hostinger). It takes 1–24 hours.

## 4. Free SSL (the padlock / HTTPS)
In the hosting panel open **SSL** → install the free **Let's Encrypt** certificate for the domain and `www`. It renews automatically.

## 5. Professional email
Create `stay@yourdomain.com` and `reservations@yourdomain.com` in the hosting panel → **Emails**. Use them on the website and in `includes/config.php`.

## 6. Get found on Google
- Create a free **Google Business Profile** with photos, location pin and the website link.
- Add the site to **Google Search Console** and submit `https://yourdomain.com/`.
- List the hotel on Booking.com / TripAdvisor and link back to the website.

## Yearly cost estimate
| Item | Cost |
|---|---|
| Domain | US$10–15 (or KES 1,000–1,500) |
| Hosting | US$36–60 |
| SSL | Free |
| **Total** | **≈ US$50–75 per year** |
