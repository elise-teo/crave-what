# Food Picker: Product Spec (v0.8)

> Working name. Items marked **[ASSUMPTION]** are placeholders; confirm or change them before building.

## 1. Problem

When I'm out and hungry, I waste time and energy deciding what to eat or drink nearby. I scroll maps and review apps and still can't choose, then default to the same few places.

**The job of this app:** get me from "I'm hungry" to a confident decision quickly, based on my situation and mood right now.

## 2. Target user and context

- Solo diners and small groups
- **[ASSUMPTION]** Singapore, mainly weekday lunch and after-work meals
- On foot, phone in one hand, low patience
- Wants one good suggestion, not a list of 40

## 3. Core loop

1. Open app → location detected
2. Optionally adjust any of seven quick questions (all optional; defaults or last answers are pre-filled)
3. Tap **"Pick for me"**
4. See one suggestion with just enough info to commit
5. Tap **[Let's go]** to open directions, or **[I'm not feeling it]** to get another suggestion

Success = a returning user can get a pick in 3 taps or fewer by accepting their pre-filled answers.

## 4. The questions

| # | Question | Options | Default |
|---|----------|---------|---------|
| 1 | Who's eating? | Any / Just me / Group (stepper: 2–10+ people) | Any |
| 2 | Eating there or taking away? | Any / Dine in / Takeaway | Any |
| 3 | How far are you willing to walk? | Any (up to 20 min) / 5 / 10 / 15 / 20 min | 10 min |
| 4 | How much do you want to spend? (per person) | **[ASSUMPTION]** Any / Under $8 / $8–15 / $15–30 / $30+ | Any |
| 5 | How hungry are you? *(portion size)* | Any / Just a drink / Just a snack / A proper meal / Starving | Any |
| 6 | What are you feeling? *(kind of food or drink)* | Any / Comfort / Something healthy / Something sweet / Something new | Any |
| 7 | What cuisine do you want? *(changes to "What drink?" when hunger is "Just a drink")* | Food: multi-select chips (e.g. Chinese, Malay, Indian, Western, Japanese, Korean, Thai, Italian, Vegetarian, Desserts) + Any. Drinks: Coffee / Tea / Bubble tea / Juice & smoothies / Beer / Cocktails & wine + Any | Any |

**Why this order:** it moves from situation to preference, broad to specific. Questions 1–4 are practical constraints (who, where, how far, how much) that the user usually knows without thinking. Questions 5–6 are about appetite and mood. Cuisine comes last because it's the most specific choice, and it's the easiest to leave as "Any" once the earlier answers have narrowed things down.

**No question is mandatory.** Every field starts on its default (first use) or the user's last answer (return visits), and the current value is always visible so users know what a skipped field means. Every question has **Any** as its first option, and "Any" means the field doesn't filter or weight results. For walking distance, "Any" uses the maximum radius (20 min) because the places search always needs one; the default stays at 10 min so first results are close by. Tapping "Pick for me" with nothing changed must still return a good, nearby, open place.

**Open places only (default ON):** a small toggle below the questions, "Only show places open now", switched on by default. When on, a place must be open when the user arrives (current time + walking time) and not closing within 30 minutes of arrival. When off, closed places can be picked, and the result screen shows when they next open (e.g. "Opens 5:30 PM"). The toggle always resets to ON on each app open, because suggesting a closed place is the worst possible result for a hungry user.

**Each question covers one dimension only:** hunger is portion size, feeling is the kind of food or drink, and budget covers splurging. Every combination should make sense (e.g. Starving + Something healthy, Just a snack + Comfort, Just a drink + Something sweet → bubble tea).

**How users reach cafés, bars, and dessert shops:**
- **Cafés:** "Just a drink" or "Just a snack", or the Coffee / Tea drink chips
- **Bars:** "Just a drink" + Beer or Cocktails & wine chips (with the open-only default, bars mostly appear in the evening)
- **Dessert shops:** "Something sweet", or the Desserts cuisine chip
- With everything on "Any", all place types are eligible, weighted toward proper food places at mealtimes

## 5. MVP scope

**In:**
- Current location (with permission handling)
- "Only show places open now" toggle, ON by default
- The seven questions above, with last answers remembered in the browser
- Single-result pick with **[Let's go]** and **[I'm not feeling it]**
- Avoid repeating recent picks (last 5, stored in the browser)
- **[Let's go]** opens Google Maps / Apple Maps walking directions

**Out (for now):**
- User accounts and login
- Group voting (group size is an input only; one person decides)
- Reviews, ratings written by users, photos uploaded by users
- Favourites and history screens
- Curated hawker stall database (planned for v2)

## 6. Screens

1. **Questions**: the seven questions, either as one scrollable screen of compact controls or a short step-by-step flow (see Open decisions). "Only show places open now" toggle (ON by default). Big **"Pick for me"** button always reachable.
2. **Result**: place name, type and cuisine (e.g. "Café · Coffee" or "Hawker · Malay"), walking time, price level, open status ("Open until 10 PM", or "Opens 5:30 PM" when the open-only toggle is off), dine-in/takeaway availability, and a one-line reason it matches ("Comfort · under $8 · 6 min walk"). Buttons: **[I'm not feeling it]** (secondary) and **[Let's go]** (primary).
3. **Permission / empty states**: location denied, no results matching answers (suggest which answer to loosen, e.g. "Try walking 15 min"), no network.

## 7. Data source

- **[ASSUMPTION]** Google Places API for MVP
- Use place fields where available: location, cuisine/place type, price level, opening hours, dine-in, takeout, good for groups
- Known gaps:
  - Hawker centres appear as one place, not individual stalls. Accept this for MVP.
  - "Hunger" and "feeling" aren't fields in any places API. They're mapped from cuisine and place type through a config file (see §8), which will be rough at first and tuned through testing.
- Watch API costs: cache results per location for a short period; don't refetch on every "I'm not feeling it"

## 8. Picking logic

1. Fetch nearby food and drink places within the walking radius: restaurants, hawker centres, cafés, bars, bakeries, and dessert shops
2. Hard filters (remove non-matches):
   - Open on arrival (when the open-only toggle is ON): open at current time + walking time, and not closing within 30 minutes of arrival. Exclude places with no opening-hours data.
   - Dine in / Takeaway: remove places that don't support the chosen option, where data exists (no filter for "Any")
   - Cuisine / drink: keep only places matching the selected chips (unless "Any")
   - "Just a drink": keep only cafés, bars, and drink shops
   - Budget: match price level to the chosen range
3. Soft preferences (adjust weighting, don't remove):
   - **Group size:** for groups, favour places marked good for groups; for groups of 5+, dine in, favour restaurants and hawker centres over small stalls
   - **Hunger (portion size):** "Just a snack" favours bakeries, cafés, snack stalls, and dessert shops; "A proper meal" and "Starving" favour full-meal places ("Starving" leans toward generous portions) and exclude drink-only places
   - **Feeling (kind of food):** map each option to cuisine/place-type tags in a single editable config file (e.g. Comfort → noodles, rice dishes, local fare, hot chocolate; Something healthy → salads, grain bowls, soups, juice bars; Something sweet → dessert shops, bakeries, bubble tea, cafés with cakes). "Something new" favours cuisines and places not picked recently.
   - **Time of day (when hunger is "Any"):** favour full-meal places around lunch and dinner, cafés and dessert shops mid-afternoon, bars late evening
   - Slightly favour closer and higher-rated places
4. Remove places picked in the last 5 picks
5. Weighted random choice
6. **[I'm not feeling it]** draws another place from the same cached result set, never repeating within the session

## 9. Tech stack

- **Mobile web app: Next.js + TypeScript, deployed on Vercel**
- Designed mobile-first; must work well in iPhone Safari and Android Chrome
- Browser Geolocation API for location (requires HTTPS, which Vercel provides)
- Browser localStorage for recent picks and last-used answers, wrapped in try/catch with safe fallbacks
- **Google Places calls go through a Next.js API route** (runs as a Vercel serverless function), so the API key stays on the server and never reaches the browser
- API key stored as a Vercel environment variable (and in `.env.local` for local dev, which must be git-ignored). Also restrict the key in Google Cloud Console.
- Cache Places results in the API route for a short period to control costs
- Installable to the home screen (web app manifest + app icon); offline support not needed for MVP
- Code in a GitHub repo connected to Vercel
- A native app (e.g. Expo) is out of scope for now; keep picking logic and config free of web-only code where practical so it can be reused later

## 10. Testing on mobile

- **Vercel preview links (main method):** every push to GitHub creates a unique HTTPS preview link. Open it on a phone or share with testers.
- **Desktop browser:** Chrome DevTools device toolbar for layout checks; Sensors panel to fake a Singapore location
- **Local dev on phone:** location needs HTTPS, so use a tunnel (e.g. ngrok or Cloudflare Tunnel) when testing location from a local build
- **Real-device debugging:** Safari Web Inspector (iPhone + Mac) or Chrome remote debugging (Android)
- Test "Add to Home Screen" on both iPhone and Android before sharing widely

## 11. Design principles

- Seven questions is a lot for a hungry person: pre-fill last answers, make every question skippable, and never block the "Pick for me" button
- Large tap targets, usable one-handed
- Fast: show a skeleton/loading state, never a blank screen
- Accessible: sufficient contrast, screen-reader labels, supports larger text sizes
- Friendly, confident tone ("Try this:" not "Results (23)")

## 12. Build milestones

1. Scaffold Next.js + TypeScript project, push to GitHub, connect to Vercel, and confirm a preview link opens on my phone
2. Questions screen UI with local state (no data yet)
3. Result screen with hardcoded dummy data, [Let's go] and [I'm not feeling it]
4. Location permission + current coordinates, including the denied state
5. API route for Google Places (key from environment variable) + a simple client service that calls it
6. Hard filters (open on arrival, dine-in/takeaway, cuisine, budget, distance)
7. Soft preferences via the mood/hunger/group config file + weighted pick
8. Remember last answers and recent picks in localStorage
9. [Let's go] → maps walking directions (Google Maps link; Apple Maps option on iPhone)
10. Empty, error, and permission states
11. Home screen install: manifest, icon, app name
12. Polish: loading states, accessibility pass

## 13. Instructions for Claude Code

- Build one milestone at a time; after each, push to GitHub and give me the steps to check the Vercel preview link on my phone
- Explain what you changed and why in plain language. I'm a UX designer, not a developer
- Ask before adding new dependencies
- Design mobile-first; check layouts at phone widths before anything else
- Keep all Places API calls in the API route and a single client service file so the data source can be swapped later
- Keep all mood, hunger, and group mappings in one config file so I can tune them without touching logic
- Never hardcode or commit API keys; never expose them to the browser

## 14. Open decisions

- Questions layout: one compact screen vs step-by-step flow
- Final wording and options for "What are you feeling?"
- Budget ranges (per person)
- Data source: Google Places vs Foursquare vs curated hawker data
- Whether [I'm not feeling it] should optionally ask why (too far, wrong cuisine, too pricey) to adjust the next pick
- App name (leading option: Crave What) and visual direction
- Whether and when to build a native app for the App Store and Google Play
- Vercel plan: the free Hobby plan is for non-commercial use; move to a paid plan if the app ever makes money
