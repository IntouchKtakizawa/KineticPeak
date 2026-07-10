# KineticPeak

Elevating Your Performance, One Set at a Time.

A gamified weightlifting tracker: log sets with a searchable exercise library, get an
auto-triggered rest timer, watch live Volume Load / Work Capacity while you train, get a
confetti celebration on new PRs, see an anatomical "Physique Map" of recent muscle
stimulation, and climb a Bronze → Platinum league based on your own volume, frequency, and
relative strength. Onboarding ends with a single-checkbox pledge — "The Athlete's Code" —
instead of a wall of legal text.

## Try it live

**Web build:** https://intouchktakizawa.github.io/KineticPeak/ — a browser preview of the
Expo app (rest-timer notifications and haptics are no-ops on web; for the full experience,
run it in Expo Go on a phone, see below).

The group/leaderboard backend isn't deployed by default — without it, the League tab's group
section just shows "not connected" and everything else (logging, PRs, physique map, personal
league tier) works fully. To enable it:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/IntouchKtakizawa/KineticPeak)

Then set `EXPO_PUBLIC_API_URL` to your Render URL (in `app/.env` for local runs, or as a repo
Actions variable so the deployed web build picks it up too — Settings → Secrets and
variables → Actions → Variables tab → add `EXPO_PUBLIC_API_URL` → re-run the pages workflow).

This is a standalone project — no code is shared with the Midpoint app.

## Structure

- `app/` — Expo (React Native) mobile app. This is the product; everything (workout logs,
  PRs, physique map, personal league tier) lives on-device, so it's fully usable offline
  with no backend at all.
- `server/` — a small Express + SQLite API used **only** for the optional "Group" feature:
  create a group, get an invite code, others join, and everyone sees a shared leaderboard of
  league points/tier. Raw workout logs never leave the device — only a `{points, tier}`
  snapshot is synced.

## Running it

### 1. Mobile app

```
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i`/`a` for a simulator. `npx expo start --web` also
works for a quick look in a browser (rest-timer notifications and haptics are no-ops there).

### 2. Group backend (optional)

Only needed if you want to test the group/leaderboard feature. Without it running (and
without `EXPO_PUBLIC_API_URL` set in `app/.env`), the League tab shows a "not connected"
state and everything else keeps working single-player.

```
cd server
npm install
npm run dev
```

Runs at `http://localhost:4100`. Data is stored in `server/data.sqlite3` (gitignored).

## Notes

- The physique map and league tier are computed on the fly from your logged sets — nothing
  extra is stored for them, so there's no separate log to keep in sync.
- Relative Intensity feedback in the set logger falls back to a bodyweight-ratio estimate
  until you've logged enough sets for a real e1RM per exercise.
- `render.yaml` mirrors the Midpoint deploy pattern (Render free tier), but note its SQLite
  file resets on redeploy since Render's free tier disk is ephemeral — fine for a low-stakes
  leaderboard cache, not a durable store.
