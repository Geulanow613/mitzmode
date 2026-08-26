# Mitz Mode — cloud mitzvah list

Public cloud feed for the Mitz Mode Android and iOS apps.

## File

- **`mitzvotcloud.json`** — mitzvah catalog fetched at runtime by the apps (ETag-aware).

Fetched from:

`https://raw.githubusercontent.com/Geulanow613/mitzmode/main/mitzvotcloud.json`

## Schema

Keep the file stable for all clients:

- `version`
- `mitzvot[]` with `id`, `text`, optional `links`

## License

MIT — see `LICENSE`.
