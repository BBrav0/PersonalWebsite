---
title: "Building Leagueback: Quantifying Your Real Impact in League of Legends"
description: "How I built a desktop app that moves beyond KDA to classify whether your performance actually mattered in each match — and the data pipeline behind it."
date: "2026-03-31"
tags: ["C#", "Desktop Apps", "Data Analysis", "League of Legends"]
---

# Building Leagueback: Quantifying Your Real Impact in League of Legends

Anyone who plays League of Legends seriously knows the frustration of getting flamed after a loss where you played well — or the empty feeling of a win where you were clearly carried. KDA doesn't tell the full story, and neither does damage dealt or gold earned in isolation.

## The Problem

Traditional stats treat every game the same. But not all games are equal. Some games are **guaranteed wins** — your team was so far ahead that any reasonable play would've sealed it. Others are **guaranteed losses** — no amount of individual effort was going to turn that around. The games that *actually matter* are the ones in between: the **impact games** where your decisions were the difference.

## The Approach

Leagueback analyzes match data and classifies each game into four categories:

- **Impact Win** — You were the reason your team won
- **Impact Loss** — Your performance cost your team the game
- **Guaranteed Win** — Your team wins regardless of your play
- **Guaranteed Loss** — Your team loses regardless of your play

The classification looks at statistical thresholds — when did your damage share, kill participation, and vision score cross the line from "contributing" to "deciding"?

## The Stack

I built the desktop version in **C#/.NET** because it gave me direct access to the League client API and good data visualization tools. The web version (Leagueback-WEBAPP) is **Next.js + TypeScript + Supabase**, which lets me store match histories and show trends over time.

## What I Learned

The biggest challenge wasn't the classification algorithm — it was the data pipeline. Riot's API has strict rate limits, and match data comes back in a format that needs significant cleaning before it's usable. Building a reliable caching layer and handling edge cases (remakes, dodges, incomplete data) taught me more about software reliability than any class project.

If you're a League player who wants to actually understand your impact instead of just staring at your KDA, that's what Leagueback is for.

*Check it out on [GitHub](https://github.com/BBrav0/Leagueback).*
