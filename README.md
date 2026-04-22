# Rosetta

Paste code in one language, pick a target from 50+ languages, and get a line-by-line translation with explanations of every difference. Not just a translator, but a teacher.

**[Live demo](https://reneebe.github.io/rosetta/)** · Part of [50 Projects in 50 Days](https://reneebe.github.io/50projects)

## How it works

1. Paste your code and select the source and target languages
2. Claude translates the code and returns structured JSON
3. Results show a three-column breakdown: original, translated, and a plain-English explanation of what changed and why
4. Copy the full translated code with one click

## Auth

No API key needed. The app includes a daily visitor pool for free translations. [MagicLink](https://magiclink.reneebe.workers.dev/resume) tokens provide additional access (20 uses across all projects).

## Stack

- React + TypeScript + Vite
- [MagicLink](https://github.com/ReneeBe/magiclink) SDK for token-gated API access
- Claude Sonnet 4.6 via Anthropic Messages API
- GitHub Pages

## Development

```bash
npm install
npm run dev
```

## License

MIT
