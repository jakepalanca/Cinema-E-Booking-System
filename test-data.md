# Test Data

Initializing the backend with `GET /initialize-db` clears existing data and seeds a minimal set of accounts for testing.

- Admin account: email `admin@cinemae.com`, username `sysadmin`, password `admin123`
- Customer account: email `demo.user@cinemae.com`, username `demouser`, password `password123`
- Promo codes loaded: `WELCOME10`, `LOYAL15`, `BLOCKBUSTER20`

The seeded customer is marked as verified and has a saved card with a couple of sample bookings against the first shows returned during seeding. Use `GET /clear-db` to wipe the data before reinitializing.
