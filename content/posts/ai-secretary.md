---
title: "A 24/7 AI Secretary"
description: "How I built a personal blog powered by Next.js, an AI agent on a Mac Mini that manages my grades and portfolio on autopilot, and another AI that builds skills for the first one."
date: "2026-03-31"
tags: ["AI", "Automation", "Next.js", "Home Lab", "Hermes"]
---

# A 24/7 AI Secretary

You're reading this post right now. That's wild to me, not because it exists, but because of *how* it exists. I'm writing this blog post by talking to an AI agent named Delta, and Delta is the one actually writing the words you're reading. I'm sitting here in Discord, typing like I'm texting a friend, and my AI is turning my stream-of-consciousness into a structured blog post. We'll get into that.

## The Setup

I have a Mac Mini M4 sitting on my desk as part of my home lab (alongside a Jellyfin media server on a Raspberry Pi 5 and a Pi-hole on a Pi 2). On that Mac Mini, I run **Hermes Agent**, an AI agent framework that connects to my Discord server, has terminal access to the machine, a browser, code execution, and a whole library of reusable skills. Think of it like having a really competent coworker who never sleeps and has root access.

Delta is the instance of Hermes that lives in my Discord. It remembers things about me across sessions, manages files on my machine, runs cron jobs, and can spin up subagents for heavier tasks. It's not a chatbot. It's more like a persistent assistant that happens to live in a Discord channel.

## My 24/7 AI Secretary

Right now, Delta runs a handful of automated jobs that keep my life on rails:

**Grade tracking.** Every day at 8 PM, Delta hits the Canvas LMS API, pulls all my grades, calculates letter grades against the syllabus, and posts a summary to Discord. If anything changes, I know immediately. It even knows that Perusall annotations sometimes don't sync back to Canvas submissions, so it doesn't flag those as missing.

**Portfolio monitoring.** Weekdays at 3 PM, Delta checks my stock positions via the Public.com API, calculates gains/losses since purchase, and posts a portfolio update to Discord. I can check my phone and see how I'm doing without opening any apps.

And that's just the automated stuff. On-demand, Delta can read my email (via Gog, a Google Workspace CLI), manage GitHub repos, browse the web, edit files, and a lot more. It's the kind of tool that starts feeling normal alarmingly fast.

## How This Blog Got Made

Which brings us to the thing you're reading right now. I asked Delta to set up a blog on my personal website (benbravo.net, built with Next.js). It created a branch, scaffolded the whole thing with markdown-based posts, a listing page, individual post pages with nice typography, the works. Then I told it to delete the placeholder posts it wrote and start fresh.

So Delta wrote placeholder blog posts about my projects. Then I told Delta to delete them and write real ones. And now Delta is writing *this*, a blog post about the blog, while I'm telling it what to say in Discord messages. It's deeply recursive and I love it.

## The Meta Layer: AI Building Tools for AI

Here's where it gets really interesting. I also use **Factory Droid**, another AI coding agent. Recently, I had Droid build a Hermes skill for itself. Droid created a skill file that teaches Delta how to use `droid exec` (Droid's headless mode) for both quick tasks and long-running background jobs that report results back to Discord.

So the flow is:
- I tell Delta what I need
- Delta uses the skill that Droid wrote
- That skill tells Delta how to invoke Droid
- Droid does the actual work

There's something satisfying about building this kind of toolchain. It's not just "use AI to do things." It's building an infrastructure where AIs can coordinate with each other. Delta knows when to handle something itself and when to hand off to Droid. Droid knows how to report back to Delta. And I just talk to Delta in Discord like it's a group chat.
