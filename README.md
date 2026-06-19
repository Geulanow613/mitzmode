# MitzMode Web App

A web application for tracking and celebrating Jewish mitzvot (commandments). The app helps users build up daily good deeds and learning while making the experience engaging, beautiful, and rewarding.

🌟 **Try it now**: [https://geulanow613.github.io/mitzmode/](https://geulanow613.github.io/mitzmode/)

## Features

- 📋 Daily checklist for required mitzvot (separate sections for men and women)
- ⭐ Level-up system with **14 tiers** — from *Beginner* all the way to **Mitz Mode!** at 1800+
- 🎬 Milestone reward videos at counts 1, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, and a special **final reward** clip with audio at 1800
- ✨ "Holy light" flash animation that sweeps across the screen every time you Accept a mitzvah (four cycling variants)
- 🏆 Certificate of Achievement dialog (tap the mitzvot counter) — with a neon-gradient ultimate-tier design once you reach Mitz Mode!
- 🔊 Mute / Close controls on reward videos (system volume stays under user control)
- 🙏 Blessings, Birkat Hamazon, Traveler's Prayer, and "What's a Mitzvah?" panels
- 📝 Suggest your own mitzvot via the in-app form
- 📱 Mobile-responsive, low-bandwidth-aware
- ☁️ Shared mitzvah catalog (`mitzvotcloud.json` in this repo) consumed by Android and iOS clients

## How to Use

1. Visit [https://geulanow613.github.io/mitzmode/](https://geulanow613.github.io/mitzmode/)
2. Tap the main button to receive a mitzvah suggestion
3. Hit **Accept** when you complete one — watch the screen light up
4. Open the **Daily Checklist** for the basics of an observant Jewish day
5. Tap your mitzvot counter to see your current level and certificate

## Shared mitzvah catalog

`mitzvotcloud.json` is the **single source of truth** for the cloud-side mitzvah list and is consumed by all three clients:

- **Web** — fetched at runtime alongside the bundled `data/mitzvot.json`
- **Android** — pulled into the app
- **iOS** — pulled into the app

When adding / editing entries, keep this file's schema (`version`, `mitzvot[]` with `id`, `text`, optional `links`) stable so every platform keeps working.

## For Developers

Run locally:

```bash
git clone https://github.com/Geulanow613/mitzmode.git
cd mitzmode
# Any static server works, e.g.:
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

> The reward videos and background video are large; if you fork this repo, make sure Git LFS or your hosting solution can handle the `assets/*.mp4` files.

## Tech notes

- Vanilla JS / HTML / CSS — no build step
- Level + milestone routing lives in `js/config.js` and mirrors the Android `MitzModeViewModel`. The final reward uses a sentinel id (`FINAL_REWARD_VIDEO_ID = 100`) instead of overloading the numeric milestone ids `1..13`.
- Holy-light flash variants are pure CSS animations defined in `css/animations.css`.

## Contributing

Pull requests welcome! Please keep the mitzvah schema stable and avoid committing any API keys, tokens, or other secrets.

## License

MIT — see `LICENSE`.

## Author

Beardy Top Productions — [www.beardy.top](https://www.beardy.top)
