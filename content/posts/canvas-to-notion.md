---
title: "CanvasToNotion: When Your LMS Doesn't Talk to Your Workspace"
description: "Why I automated syncing Canvas assignments to Notion, the pain points of the Canvas API, and how I turned a personal annoyance into a tool other students actually use."
date: "2026-03-15"
tags: ["TypeScript", "APIs", "Automation", "Productivity"]
---

# CanvasToNotion: When Your LMS Doesn't Talk to Your Workspace

Every semester starts the same way: syllabi drop, assignments pile up across 4-5 classes, and within two weeks I'm losing track of what's due when. Canvas shows assignments fine, but I live in Notion — it's where my task system, my planner, and my life live. The disconnect was driving me crazy.

## The Gap

Canvas has an API. Notion has an API. But nobody had built a reliable bridge between them that actually worked well — at least not one that handled the specific quirks of Pitt's Canvas instance (custom grade periods, hidden assignments, grade sync).

## What It Does

CanvasToNotion pulls your Canvas assignments and pushes them into a Notion database. Each assignment gets its own page with:

- Assignment name and due date
- Course name and section
- Submission status
- Grade (once graded)
- Link back to the Canvas submission page

It runs on a schedule so your Notion stays up to date without manual intervention.

## Technical Challenges

The Canvas API is... opinionated. Some assignments are hidden until a certain date, others have different visibility rules per section, and grade data doesn't always sync reliably (looking at you, Perusall integrations). I had to build retry logic and handle a lot of edge cases that the official API docs don't mention.

Notion's API, on the other hand, is well-documented but rate-limited aggressively. Bulk inserting assignments at the start of the semester required careful batching and backoff logic.

## The Result

What started as a "solve it for myself" project turned into something a few classmates started using. It's not a massive user base, but solving a real problem — even for a small group — is more satisfying than building something nobody needs.

*Available on [GitHub](https://github.com/BBrav0/CanvasToNotion).*
