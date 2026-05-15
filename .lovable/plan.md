## Phases 5–7: Backend Integration Plan

This is a large body of work. I'll break it into 3 sequential phases. Each phase ends in a working, testable state. I'll ask for your go-ahead before starting Phase 5.

---

### Phase 5 — Authentication System Integration

**Database (migration 1):**
- `profiles` table: `id` (=auth.users.id), `full_name`, `phone`, `avatar_url`, `address`, `lat`, `lng`, `dietary_prefs[]`, `org_name`, `org_details`, `verified` (bool), `created_at`, `updated_at`
- `user_roles` table with enum `app_role` ('donor','recipient','volunteer','ngo','admin') — separate table per security rules
- `has_role(user_id, role)` security-definer function
- Auto-create profile + default role trigger on `auth.users` insert
- RLS: profiles readable by everyone (public donor info needed), updatable only by owner; user_roles readable by self + admins, only admins can mutate
- Seed: signup grants user-selected role automatically via the trigger reading `raw_user_meta_data.role`

**Auth wiring:**
- Enable Google OAuth (`configure_social_auth`)
- Wire `_authenticated.tsx` route guard
- Auth context hook (`useAuth`) — listens to `onAuthStateChange`, exposes user/profile/roles
- Wire real auth into existing `/auth/login`, `/auth/signup`, `/auth/otp` (currently mock)
  - Email/password + Google OAuth (phone OTP requires Twilio config — I'll use email/password as primary, leave phone UI but note SMS needs separate setup)
- Wire `/profile/setup`, `/profile`, `/profile/edit` to real profile data
- Move `/profile`, `/bookings`, `/post`, `/food/posted`, `/volunteer/*` under `_authenticated/`

---

### Phase 6 — Database Schema & Core APIs

**Migration 2 — core tables:**
- `food_categories` enum: 'veg','non_veg','vegan'
- `food_items`: donor_id, title, description, photo_url, category, cuisine, quantity_servings, prepared_at, expires_at, pickup_address, lat, lng, instructions, status ('available','reserved','picked_up','expired','cancelled'), created_at
- `bookings`: food_item_id, recipient_id, volunteer_id (nullable), pickup_window_start, pickup_window_end, status ('pending','confirmed','ready','picked_up','cancelled'), notes, created_at
- `reviews`: reviewer_id, reviewee_id, booking_id, rating (1-5), comment
- `notifications`: user_id, type, title, body, data (jsonb), read_at, created_at
- Storage bucket `food-photos` (public read), `avatars` (public read)
- RLS: donors manage own food; available food readable by all auth users; bookings visible to donor+recipient+assigned volunteer; reviews readable by all, write only by booking parties

**Server functions** (`src/lib/*.functions.ts`):
- `food.functions.ts`: createFoodItem, updateFoodItem, deleteFoodItem, listMyFoodItems, listNearbyFood (with distance calc), getFoodItem
- `bookings.functions.ts`: createBooking, listMyBookings, updateBookingStatus, cancelBooking
- `reviews.functions.ts`: createReview, listReviewsForUser
- `profile.functions.ts`: updateProfile, uploadAvatar
- All gated by `requireSupabaseAuth`; storage uploads via signed paths

**Wire UI to APIs:**
- `/post` → createFoodItem (with photo upload)
- `/food/posted` → listMyFoodItems
- `/discover` → listNearbyFood (uses browser geolocation)
- `/food/details/$id` → getFoodItem + reviews
- `/booking/confirm` → createBooking
- `/bookings` → listMyBookings
- `/profile/edit` → updateProfile

---

### Phase 7 — Advanced Features & Realtime

**Freshness scoring:**
- Computed in SQL view / function from `prepared_at`, `expires_at`, category
- Returned as `freshness_score` (0-100) and `time_remaining_minutes` from list/get APIs
- Frontend `FreshnessRing` already exists — wire to real values

**Geolocation matching:**
- PostGIS-style distance via Haversine in SQL function `nearby_food(lat, lng, radius_km)`
- Volunteer matching: `pending_volunteer_requests(volunteer_lat, volunteer_lng)` returns bookings near volunteer

**Realtime:**
- Enable realtime on `food_items`, `bookings`, `notifications`
- `useRealtimeNotifications` hook → toast + bell badge
- Booking status updates push to donor/recipient/volunteer in real time
- Discover page subscribes to new food in radius

**Notifications:**
- Trigger function: insert into `notifications` on booking status change, new pickup request, new food nearby (queued)
- Wire `/notifications` page to live data

**Volunteer features:**
- `/volunteer/dashboard` availability toggle → `profiles.volunteer_available`
- `/volunteer/requests` pulls pending bookings needing pickup
- Accept request → assigns volunteer_id

**Impact analytics:**
- `user_impact(user_id)` SQL function: meals donated/received/delivered, people helped
- Wire dashboard stats to real counts

---

### Technical notes
- Keep all server logic in `createServerFn` (NOT edge functions) per stack guide
- Mobile UI is preserved — only data sources change
- Phone/SMS OTP requires Twilio setup; I'll keep the UI but use email/password + Google as functional auth for now (you can add SMS provider later)
- Mapbox integration deferred to Phase 8 — discover page uses list view + distance numbers

---

**Shall I proceed with Phase 5 first?** I'll run the migration for `profiles` + `user_roles` + trigger, get your approval, then wire the auth code.