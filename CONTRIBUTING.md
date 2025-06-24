# Contributing Guide

Thank you for your interest in contributing to this project!

## Onboarding
- Read `README.md` and `docs/awp.md` for project overview and workflow
- Review `awp.yml` for the current roadmap and actionable steps

## Coding Standards
- Use TypeScript and follow the existing code style
- Run `npm run lint` and `npm run typecheck` before committing
- Write unit and property-based tests for all new logic

## Agentic Workflow Protocol (AWP)
- All work is tracked in `awp.yml` (see `docs/awp.md` for details)
- Reference the relevant AWP step in every commit message
- Use the defined procedures for update, commit, next, and check

## How to Propose Changes
- Fork the repo and create a feature branch
- Make your changes and update/add tests and docs
- Update `awp.yml` if you add or complete a step
- Open a pull request with a clear description and AWP step reference

## Running Tests
- Run all tests: `npm test` or `npx jest`
- Run property-based tests: `npx jest tests/domain/transferFunds.property.test.ts`
- Run e2e test: `npx ts-node scripts/test-audit-logger-e2e.ts`

## Documenting New Features
- Update `README.md` and/or add to `/docs/` as needed
- Reference the relevant AWP step in your documentation

---

For questions or suggestions, open an issue or start a discussion! 