# Test Data

Initializing the backend with `GET /initialize-db` clears existing data and seeds a minimal set of accounts for testing.

- Admin account: email `admin@cinemae.com`, username `sysadmin`, password `admin123`
- Customer account: email `demo.user@cinemae.com`, username `demouser`, password `password123`, phone `555-123-4567`
- Promo codes loaded: `WELCOME10`, `LOYAL15`, `BLOCKBUSTER20`
- Showtimes seeded across Downtown Cinema (Auditorium 1/2) and Uptown Screens (Premiere/Indie Hall) for today, tomorrow, the weekend, and next week; responses include cinema/theater info so locations appear in the Showtimes page.

The seeded customer is marked as verified and has 3 saved payment methods:
1. Visa ending in 1111 (uses main address: 123 Main St, Anytown, CA)
2. Mastercard ending in 0004 (billing: 456 Peachtree St, Atlanta, GA)
3. Amex ending in 0009 (billing: 789 Broadway Ave, New York, NY)

Sample bookings are created against the first shows returned during seeding. Use `GET /clear-db` to wipe the data before reinitializing.
