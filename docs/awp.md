# Agentic Workflow Protocol (AWP)

This project uses the Agentic Workflow Protocol (AWP) to ensure all work is transparent, traceable, and actionable for both humans and agents.

## What is AWP?
AWP is a living, machine- and human-readable protocol for project management, progress tracking, and automation. It keeps code, docs, and workflow in sync.

## How to Use AWP in This Project
- The main workflow file is `awp.yml` in the project root.
- Each step, sub-step, and procedure is tracked and checked off as work progresses.
- Procedures for `update`, `commit`, `next`, and `check` are defined and followed for every change.
- Commit messages reference the relevant AWP step for traceability.

## Key Sections in awp.yml
- **init:** Onboarding instructions
- **goal, overview, outcome:** Project vision and roadmap
- **steps:** Hierarchical, actionable checklist
- **procedures:** Canonical definitions for update, commit, next, check
- **notes:** Project-wide reminders and policies
- **commitStandard:** Commit message format and rules

## How to Extend or Contribute
- Add new steps or enhancements as the project evolves
- Update documentation and awp.yml together
- Propose improvements to the protocol in this file or via PR

## References
- See `awp_template/` for example AWP files
- See README for onboarding and workflow summary

---

**AWP is a living protocol. Help improve it by contributing feedback, templates, and best practices!**
