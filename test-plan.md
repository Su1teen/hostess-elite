# Test Plan — HOSTESS ELITE B2C App

PR: https://github.com/Su1teen/hostess-elite/pull/1
Tested locally against `bun dev` on the desktop browser.

## What changed (user-visible)
- New social pages: Контакты, Чаты, Чат-детальный, Карта.
- New profile page with sign-out.
- Devin Review fixes:
  - `<Outlet />` added to `/restaurant/$id` and `/social` parents so sub-routes render.
  - Voice waveform now uses a deterministic hash-based PRNG (was `Math.random()` causing flicker).
  - Chat list preview shows actual voice duration (was hardcoded `0:00`).
  - `ShareSheet` clipboard error path shows error toast.

## Adversarial assertions

Each test below is designed so a broken implementation would produce a **visibly different** result.

### T1 — Primary E2E booking flow (auth → home → book → pre-order → deposit → bookings)
Steps:
1. Open `/`. Click **«Войти по номеру»**.
   - PASS: navigates to `/auth/phone`.
2. Type `7011112233` → click **«Получить код»**.
   - PASS: input formats to `+7 (701) 111-22-33`, navigates to `/auth/otp`.
3. Type any 6 digits e.g. `123456`.
   - PASS: auto-submits, lands on `/home`. URL is `/home`. Mood section "С кем сегодня?" visible.
   - FAIL if: stays on OTP, shows error, or routes to landing.
4. On `/home`, click mood **«Бизнес»** → **«Свидание»**.
   - PASS: restaurant grid below changes (different cards/headline) when mood changes; "Под настроение" section reflects label.
   - FAIL if: same cards across moods (filter not wired).
5. Click first card in **«Горящие столики»** rail.
   - PASS: navigates to `/restaurant/{id}`, hero image + name + cuisine tag visible, **«-X% сейчас»** burgundy tag present.
6. Click **«Забронировать»** at the bottom of the detail page.
   - PASS: URL becomes `/restaurant/{id}/book` and the booking form (date strip, time grid, table floor plan, comment) renders — **NOT the restaurant detail again**.
   - FAIL if: URL changes but page still shows restaurant detail (this is exactly the Outlet bug Devin Review caught).
7. Pick a date 2 days out, time `20:00`, click table `T6`, set guests to `4`, type comment `«Окно у бара»`. Click **«Перейти к меню»**.
   - PASS: URL becomes `/restaurant/{id}/preorder`. Sticky tabs and category sections render.
8. Add 2 items by clicking `+` next to them. Floating cart shows count `2` and total `>0 ₸`.
   - PASS: cart counter increments. Re-clicking item shows quantity controls.
9. Click **«Депозит»** in floating cart.
   - PASS: URL becomes `/restaurant/{id}/checkout`. Card / Apple Pay / Kaspi options visible. "Депозит" amount > 0.
10. Click **«Оплатить депозит»** (Card method).
    - PASS: simulated 3-D Secure → success state → "Бронь подтверждена".
11. Navigate to `/bookings` via bottom nav.
    - PASS: under **«Предстоящие»** the new booking shows: restaurant name + chosen date/time + "T6" + comment "Окно у бара" + selected items.
    - FAIL if: booking missing, date wrong, comment lost, items missing.

### T2 — Sub-route Outlet fix (regression of Devin Review #1 finding)
Steps:
1. While authed, paste `/social/contacts` directly into URL bar.
   - PASS: Contacts page renders (search input "Поиск по имени или @никнейму…" + friends grid + "Друзья на платформе").
   - FAIL if: shows the `/social` stories index instead.
2. Paste `/social/map`.
   - PASS: SVG map renders with mountains + roads + neighborhood labels (МЕДЕУ, ЦЕНТР, САМАЛ).
   - FAIL if: shows stories grid.
3. Paste `/restaurant/noir/preorder` directly.
   - PASS: pre-order menu renders (sticky tabs + items).
   - FAIL if: shows restaurant detail hero.

### T3 — Voice waveform stability + chat preview duration (regression of Devin Review #2 + #4)
Steps:
1. Go to `/social/chat`, click first thread (Алия).
2. In chat, click **«+»** menu → **«Голос»** to record a voice message.
   - PASS: a new bubble appears with waveform bars and `0:18` (or other non-zero) duration; auto-reply arrives ~2s later.
3. While the auto-reply is being added, observe waveform of the just-sent voice bubble across re-renders.
   - PASS: waveform bars stay visually identical (heights don't change as new messages animate in).
   - FAIL if: bars visibly flicker / change heights when new bubble appears (would mean still using `Math.random()`).
4. Press back arrow to `/social/chat`.
   - PASS: Алия's preview reads `Голос · 0:XX` where `XX` matches the voiceSeconds (e.g. `0:18`), **not** `0:00`.
   - FAIL if: preview reads `Голос · 0:00`.

### T4 — Map deep-link focus
Steps:
1. Paste `/social/map?focus=f1` directly into URL bar.
   - PASS: focus card pre-opens at bottom showing **Алия Нурова** with status + venue + lastSeen.
   - FAIL if: no focus card opens or wrong friend selected.

### T5 — Waitlist UI state
Steps:
1. From a busy restaurant detail, click **«Встать в очередь»**.
   - PASS: routes to `/restaurant/{id}/waitlist`. Set guests to 4, toggle SMS on, click join.
   - PASS: queue ring with position number visible (e.g. "Вы №3"); ETA in минутах shown.
   - FAIL if: routes back to detail, no ring renders, or position is `NaN`.

### T6 — Events ticket purchase → wallet
Steps:
1. From `/events`, click an event card.
2. On `/event/{id}`, pick a tier, set qty to 2, click **«Купить билет»**.
   - PASS: success state shows.
3. Navigate to `/wallet`, scroll to **«Билеты»** section.
   - PASS: purchased ticket card present with event name, qty 2, QR rendered.
   - FAIL if: ticket missing.

### T7 — Wallet card expand / QR
Steps:
1. On `/wallet`, swipe / click a loyalty card in the stack.
   - PASS: card expands and QR pattern renders (deterministic — not all-black or all-white).
   - FAIL if: only blank or no QR.

### T8 — Profile sign-out clears auth
Steps:
1. From `/profile`, click **«Выйти из аккаунта»**.
   - PASS: routes to `/` (landing with "Войти по номеру" button).
2. After sign-out, paste `/home` into URL bar.
   - PASS: the `Authed` gate redirects to `/auth/phone` (or landing) — does **not** show home content.
   - FAIL if: home content renders despite no auth.

## Notes
- Auth is fully simulated (no backend). Any 11-digit phone + any 6-digit OTP is accepted by design.
- All data is seeded in Russian via `src/data/*` and the Zustand store persists to `localStorage`.
- Recording will be one continuous walkthrough covering T1, plus targeted spot-checks for T2/T3/T4/T8.
