# Contributing

FAInder is a small personal project, but fixes and ideas are welcome.

- **Bugs and ideas**: open an issue. For a bug, say which screen, what you did and what you expected; a screenshot helps.
- **Code**: fork, create a branch, open a pull request against `main`. Keep it to one change per pull request.
- **Before opening a pull request** run `npm run lint`, `npm run typecheck` and `npm test`. If you touched the data script, also run `python -m pytest scripts`. CI runs the same checks.
- **Commit messages** follow the style already in the history: `feat: …`, `fix: …`, `docs: …`, `chore: …`.
- **Where things go**: screens in `app/`, logic that does not need React in `lib/` with a test in `__tests__/`.

Setup instructions are in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

By contributing you agree that your work is released under the [MIT License](LICENSE).
