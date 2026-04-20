---
title: "This Week I Moved My Sites from Vercel to Cloudflare"
description: "A quick update on why I spent this week moving some of my sites from Vercel to Cloudflare."
date: "2026-04-19"
tags: ["web", "cloudflare", "vercel", "deployment", "personal-site", "security"]
---

# This Week I Moved My Sites from Vercel to Cloudflare

This week I finally moved my sites from Vercel to Cloudflare.

The three main ones were `benbravo.net`, `chess.benbravo.net`, and `leagueback.benbravo.net`. I had been meaning to do this for a while, but this was the week where I actually sat down and moved them instead of just thinking about it.

Most of the work was the usual migration stuff. Repointing domains, checking settings, redeploying things, fixing little config issues, and making sure everything still worked after the switch. Not super exciting, but definitely one of those tasks that makes things feel a lot cleaner once it is done.

There were a few reasons I finally made the move.

One was just general preference. Part of it was ethics, but not in some giant dramatic sense. More just that if I already have a choice, I would rather use the platform that feels better to me. That mattered, but it was not the biggest reason.

The bigger reasons were security and overall platform fit.

On the security side, one thing that stuck with me was Vercel's handling of a major security incident. The breach itself was obviously bad, but what bothered me more was how it was handled publicly. Security incidents happen, and no company is immune to that. What matters more is whether a company communicates clearly, takes ownership, and responds in a way that inspires confidence. In Vercel's case, I came away feeling like the response was weak and honestly kind of embarrassing for a company in that position. That definitely made me trust them less.

Cloudflare is not perfect either, but I feel a lot better about using them for this part of my stack. They already sit close to a lot of the core infrastructure of the internet, so using them for domains, hosting, caching, and security features feels more natural. I like having fewer things spread across different platforms, and Cloudflare feels easier to trust on the infrastructure side.

The other major reason was the free tier.

Cloudflare's free tier is just much better for the kind of projects I actually build. It feels usable, not like a stripped-down preview that is waiting for me to hit a limit. Since most of my sites are personal projects, experiments, or side tools, that matters a lot. I want something that gives me room to build without constantly feeling like I am about to run into a wall.

So a decent chunk of this week turned into migration work.

I moved `benbravo.net`, `chess.benbravo.net`, and `leagueback.benbravo.net`, cleaned up old settings, and got everything into a setup I feel better about. It was one of those changes that is mildly annoying while you are doing it, but satisfying afterward because the whole setup feels more coherent.

At this point, Cloudflare is probably just my default going forward. If I make a new site, that is most likely where it is going first.
