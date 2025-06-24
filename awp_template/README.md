# 🚀 Agentic Workflow Protocol (AWP)

**Open Source Standard Candidate**

**Maintained by Community**, Author: [Michael Wybraniec](https://michaelwybraniec.com)

**Mission:** Empower teams and agents to build, track, and document projects with clarity, transparency, and flow.

---

## 📚 Table of Contents
- [🚀 Agentic Workflow Protocol (AWP)](#-agentic-workflow-protocol-awp)
  - [📚 Table of Contents](#-table-of-contents)
  - [🌟 What is AWP?](#-what-is-awp)
  - [🏷️ Key Terms](#️-key-terms)
  - [🔄 AWP Workflow Examples](#-awp-workflow-examples)
  - [🧠 Handling Memory Loss or Returning to Work (Diagram)](#-handling-memory-loss-or-returning-to-work-diagram)
  - [🗂️ AWP File Structure Explained](#️-awp-file-structure-explained)
  - [🛠️ How to Use AWP in Your Project](#️-how-to-use-awp-in-your-project)
  - [📋 Best Practices](#-best-practices)
  - [📝 Example AWP YAML](#-example-awp-yaml)

---

## 🌟 What is AWP?

**Agentic Workflow Protocol (AWP)** is a transparent, agentic, and collaborative project management standard. It is designed for both solo developers and teams (including AI agents), ensuring everyone stays in sync, code and docs are always aligned, and progress is transparent. AWP is both human- and machine-readable, making it ideal for hybrid human/AI workflows.

---

## 🏷️ Key Terms

**VIBE-CODING**
> A state of creative, uninterrupted coding flow, where you (and optionally your agent) are fully immersed in building, iterating, and shipping features. AWP helps you stay in this flow by keeping your roadmap and progress tracking frictionless and always up to date.

**OVER-VIBING**
> This is when you let your agent work for you too much, and then it forgets the context due to network or LLM limitations. It can lead to overlooking the context, and/or losing track of the project's progress, architecture, or complexity.

**AWP**
> AWP is designed to prevent over-vibing by making project strategy, progress, actions, and procedures always visible and reviewable for humans and agents.

---

## 🔄 AWP Workflow Examples

Below is a visual representation of the standard AWP workflow for each step:

```mermaid
flowchart TD
    Start(["Start Step (e.g., 4.2)"])
    Code["Implement Feature/Task"]
    Update["awp:update\nUpdate README.md & awp.yml\nMark step as done"]
    Commit["awp:commit\nCommit with Conventional Commit message"]
    Next["awp:next\nMove to next step"]
    Review["Review Progress\n(If blockers, raise them)"]
    Done(["Step Complete"])

    Start --> Code --> Update --> Commit --> Next --> Review --> Done
    Review -- "If not ready" --> Start
```

---

## 🧠 Handling Memory Loss or Returning to Work (Diagram)

AWP helps you or your agent recover context after a break, LLM reset, or network issue. Here's how:

```mermaid
flowchart TD
    Start(["Start Step (e.g., 4.2)"])
    Code["Implement Feature/Task"]
    Update["awp:update\nUpdate README.md & awp.yml\nMark step as done"]
    Commit["awp:commit\nCommit with Conventional Commit message"]
    Next["awp:next\nMove to next step"]
    Review["Review Progress\n(If blockers, raise them)"]
    Done(["Step Complete"])
    MemoryLoss["Lost Context? (e.g., after break, LLM reset)"]
    Recall["Consult awp.yml\nRestore context, see progress, next actions"]

    Start --> Code --> Update --> Commit --> Next --> Review --> Done
    Review -- "If not ready" --> Start
    Done --> MemoryLoss
    MemoryLoss -- "Yes" --> Recall --> Start
    MemoryLoss -- "No" --> Start
```

---

## 🗂️ AWP File Structure Explained

> **The `awp.yml` file is your project's living roadmap.**

| Section           | Purpose                                                      |
|-------------------|-------------------------------------------------------------|
| **init**          | Onboarding instructions for humans/agents                   |
| **author**        | Main author/maintainer                                      |
| **goal**          | Project's main objective                                    |
| **overview**      | High-level project phases                                   |
| **outcome**       | Intended final result                                       |
| **steps**         | Hierarchical, numerated checklist of all steps              |
| **procedures**    | Core workflow actions (update, commit, next, check, etc.)   |
| **notes**         | Reminders and project-wide policies                         |
| **commitStandard**| Commit message format, rules, and examples                  |
| **version/services** | (Optional) Infra or compose config for dev/test           |

**Section Details:**
- **init**: Step-by-step onboarding for new contributors or agents.
- **goal**: The north star for the project.
- **overview**: A list of the main phases or milestones.
- **outcome**: What success looks like.
- **steps**: A tree of all actionable steps, each with a number, name, description, and done status. Steps can be nested.
- **procedures**: Canonical definitions for `update`, `commit`, `next`, and `check` actions. These ensure everyone (and every agent) follows the same workflow for updating docs, committing, and progressing.
- **notes**: Project-wide reminders, policies, or tips.
- **commitStandard**: The required format for all commit messages, with types, rules, and examples.
- **version/services**: (Optional) Compose or infra config for local dev/test.

---

## 🛠️ How to Use AWP in Your Project

1. **Copy a template** (or start from scratch) and place it in your project root as `awp.yml`.
2. **Edit the header**: Add your name, organization, and contact info.
3. **Define your goal and outcome**: Clearly state what your project aims to achieve and what success looks like.
4. **List your main steps** in the `overview` and break them down in the `steps` section. Use nested steps for complex projects.
5. **Follow the procedures**:
   - **update**: After each step, review and update both `README.md` and `awp.yml` to reflect the current state and next actions. Mark steps as done.
   - **commit**: Commit your changes using the commit standard, referencing the relevant step.
   - **next**: Move to the next actionable step only after update and commit are complete. Check for blockers before proceeding.
   - **check**: Use this to find the next actionable step (first not done) and restore context after a break.
6. **Keep everything in sync**: The goal is to keep documentation, workflow, and codebase always aligned.

---

## 📋 Best Practices

- Always update both `awp.yml` and `README.md` after each step.
- Use the `procedures` section as your canonical workflow for update, commit, next, and check.
- Reference the step number in every commit message.
- Use the `commitStandard` for all commits to enable automation and traceability.
- If you see blockers, critical points, or have suggestions, document and address them before moving on.
- Use the `init` section to onboard new contributors or agents.
- Review the `notes` section for project-wide policies.
- If your project uses local infra (e.g., Docker Compose), document it in the `version/services` section.

---

## 📝 Example AWP YAML

```yaml
# Agentic Workflow Protocol for Project X
init: |
  - Read awp.yml and README.md to understand the workflow.
  - Follow the procedures for update, commit, next, and check.
  - Keep everything in sync.
author: Jane Dev
goal: |
  Build a simple CLI tool in Node.js that prints a greeting.
overview:
  - "1. Setup"
  - "2. Implement CLI logic"
  - "3. Test & Document"
outcome: |
  A working CLI tool that prints a greeting, with tests and documentation.
steps:
  - number: 1
    name: "Setup"
    steps:
      - number: 1.1
        description: "Initialize project with npm init -y"
        done: true
      - number: 1.2
        description: "Add index.js and package.json scripts"
        done: true
  - number: 2
    name: "Implement CLI logic"
    steps:
      - number: 2.1
        description: "Write greeting logic in index.js"
        done: false
procedures:
  - key: update
    number: 1
    name: "update"
    description: |
      Review README.md and awp.yml after each step. Update as needed to reflect the current state and next actions.
  - key: commit
    number: 2
    name: "commit"
    description: |
      Use the commitStandard for all commit messages. Reference the step in every commit.
  - key: next
    number: 3
    name: "next"
    description: |
      After update and commit, proceed to the next main step.
notes:
  - "Reference the step in every commit."
commitStandard:
  format: "type(scope step): subject"
  types: [feat, fix, docs, test, chore]
  rules:
    - Reference the step in every commit.
    - Use imperative mood.
  examples:
    - "feat(cli 2.1): add greeting logic"
    - "docs(readme 3.2): add usage instructions"
```

---

**AWP is a living protocol. Help improve it by contributing feedback, templates, and best practices!**