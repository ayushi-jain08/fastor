# Fastor React Task

Mobile app UI built from the provided Figma design: phone sign-up → 6-digit code → home → item detail.

**Stack:** React 18, Vite, React Router 6, plain CSS. Fonts: Mulish (sign-up screens) and Urbanist (home and item screens).

## Run it

```bash
npm install
npm run dev
```

Open the printed URL. The layout is a 375px phone screen; on desktop it is centred in a column
(use the browser's device toolbar for the closest view to the Figma frames).

Sign in with any 10-digit number. The staging OTP is `123456`.

## Screens and routes

| Route | Screen | Figma frame |
| ----- | ------ | ----------- |
| `/login` | Sign Up to Fastor (`+91` + 10 digits, Get OTP) | 1 |
| `/verify` | 6-digit code (3 – 3 boxes, 30s resend timer, Continue) | 2 |
| `/` | Home: Best Seller, offers carousel, Popular Items | 3 |
| `/item/:id` | Item detail: price, quantity, portion, Add to cart | 4 |

## API (from the Postman collection)

| Step | Endpoint | Where |
| ---- | -------- | ----- |
| 1. Register, get OTP | `POST /v1/pwa/user/register` (`phone`, `dial_code`) | `src/api.js` → `registerPhone` |
| 2. Login with OTP | `POST /v1/pwa/user/login` (`phone`, `dial_code`, `otp`) → `data.token` | `src/api.js` → `loginWithOtp` |
| 3. Fetch restaurants | `GET /v1/m/restaurant?city_id=118` + `Authorization: Bearer <token>` | `src/api.js` → `fetchRestaurants` |

- Bodies are `application/x-www-form-urlencoded`, as in the collection.
- The JWT is stored in `localStorage`. A `401` from the restaurants call logs the user out.
- Dev: Vite proxies `/v1/*` to `https://staging.fastor.ai` (no CORS issues).
  Production builds call the API directly (override with `VITE_API_BASE`).

## How restaurant data is used

The restaurants response feeds the home and item screens:

- **Best Seller**: restaurant photo + price badge (`costForTwo`)
- **Banner**: offer slides using restaurant photos
- **Popular Items**: name, price, area, rating
- **Item detail**: opened by tapping a Best Seller tile or a Popular Items row

`normalizeRestaurants` in `src/api.js` maps the response fields (it tries common names such as
`restaurant_name`, `images`, `avg_rating`, `cuisines`). If the real response uses other names, adjust it there.

## Structure

```
src/
  api.js                  API calls + response normalising
  AuthContext.jsx         token/session
  RestaurantsContext.jsx  restaurant list shared by Home and Item detail
  App.jsx                 routes (guest-only and protected)
  pages/                  Login, Verify, Home, ItemDetail
  components/             OtpInput, Banner, FoodImage, Toast, Icons
  styles.css
```
