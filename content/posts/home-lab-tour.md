---
title: "My Home Lab: Jellyfin, Pi-hole, and a Mac Mini"
description: "A tour of my homelab setup — self-hosted media streaming, network-wide ad blocking, and how I manage it all."
date: "2026-02-20"
tags: ["Homelab", "Self-Hosting", "Networking", "Raspberry Pi"]
---

# My Home Lab: Jellyfin, Pi-hole, and a Mac Mini

I've been building out a home lab over the past year. Nothing enterprise-grade — just a setup that makes my daily life better and teaches me infrastructure concepts hands-on. Here's what I'm running.

## The Stack

**Jellyfin** on a Raspberry Pi 5 — my media server. Movies, TV shows, music, all self-hosted. No subscriptions, no ads, no "are you still watching?" prompts. It just works. The Pi 5 handles 1080p transcoding without breaking a sweat.

**Pi-hole** on a Raspberry Pi 2 — network-wide DNS filtering. Every device on my network benefits from ad blocking at the DNS level before requests even reach the browser. The stats dashboard is satisfying to look at — watching thousands of ad domains get blocked per day.

**M4 Mac Mini** — my daily driver and the heavy lifter. Development work, running local services, and anything that needs more compute than the Pis can offer. It also has an RTX 4060 attached for GPU workloads.

## Why Bother?

Part of it is practical — I wanted media streaming without Netflix's ever-rising subscription fees. Part of it is learning — running your own services teaches you about DNS, networking, Docker, certificates, and monitoring in a way that tutorials never can.

When something breaks at 11pm because a container crashed or a DNS config changed, you learn debugging skills that transfer directly to professional work. There's no substitute for operating your own infrastructure.

## What's Next

I'm looking at adding more monitoring (maybe Grafana + Prometheus) and possibly a NAS setup for proper backups. The homelab rabbit hole goes deep, but each addition teaches something new.
