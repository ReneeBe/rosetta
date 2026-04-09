# Rosetta

Paste code in one language, pick a target from 50+ languages, and get a line-by-line translation with explanations of every difference. Not just a translator, but a teacher.

**[Live demo](https://reneebe.github.io/rosetta/)** · Part of [50 Projects in 50 Days](https://reneebe.github.io/50projects)

## How it works

1. Paste your code and select the source and target languages
2. Claude translates the code and returns structured JSON
3. Results show a three-column breakdown: original, translated, and a plain-English explanation of what changed and why
4. Copy the full translated code with one click

## Auth

Two ways to use it:

- **MagicLink**: visit with a [MagicLink token](https://magiclink.reneebe.workers.dev) for 5 free translations, no API key needed
- **API key**: enter your own Claude API key (stored in sessionStorage, cleared on tab close)

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
