---
title: "Building a Discord Proxy for the Droid CLI"
description: "Why I wanted a Discord wrapper around the interactive Droid CLI, how the bridge works, and why headless agent workflows still need better ways to ask questions."
date: "2026-05-18"
tags: ["AI", "Agents", "Discord", "Droid", "Automation", "Developer Tools"]
---

# Building a Discord Proxy for the Droid CLI

I have been using Factory Droid a lot lately as part of my AI workflow. Droid is really good at software engineering tasks, especially when it is running in its normal CLI environment. It keeps working, asks useful questions, and usually knows when it is actually blocked instead of just giving up early.

The problem is that I do most of my AI orchestration through Discord.

My main assistant, Delta, lives in Discord through Hermes Agent. I can ask Delta to do things, schedule jobs, run scripts, read files, manage projects, and delegate heavier coding tasks to Droid. That works well for a lot of things, but there has been one annoying gap: Droid's headless mode is not the same experience as using the physical CLI.

In the CLI, Droid can stop and ask a good question at the right moment. In Discord, the current workaround is much more fragile. We tell Droid something like: if you need input, end your response with `QUESTION:` so the wrapper can detect it and ask me in Discord.

That works, but it feels like duct tape.

It depends on the model following an exact output format. If Droid asks the question in the wrong place, or adds more text after the marker, or decides to finish with a recommendation instead of pausing, the wrapper treats the job as done. Then I have to re-dispatch the task, paste context back in, and hope it resumes cleanly.

That is exactly the kind of problem that makes agent workflows feel less magical and more brittle.

## Why I wanted this

The thing I wanted was simple:

I wanted Discord to feel more like the actual Droid CLI.

Not a separate headless mode. Not a prompt trick. Not a fake conversation layered on top of a finished job. I wanted a bridge that could run the interactive CLI, stream useful output into Discord, notice when Droid is waiting for input, and relay my Discord message back into the same running session.

Basically:

- Droid runs locally in a real pseudo-terminal
- Discord becomes the remote UI
- Output streams into a channel
- My replies go back into the same CLI session
- The session does not end just because Droid needed a decision

That last part matters a lot. The best AI agents are not the ones that never ask questions. They are the ones that ask the right question at the right time and then keep going once they get the answer.

## The repo

The project is here:

<https://github.com/BBrav0/droid-discord-cli-bridge>

It is an early prototype, but the goal is clear: wrap an interactive Droid CLI session with a Discord bot.

The bot can start a Droid session, stream terminal output back to Discord, and relay input from Discord into the running CLI process. It also includes commands for checking status, forcing the session into a waiting state, clearing a waiting state, and stopping the session.

This is not trying to replace Droid. It is trying to preserve the good parts of the Droid CLI while making it usable from the place where I already coordinate my agents.

## How it works

The core idea is to run Droid inside a PTY, or pseudo-terminal, instead of treating it like a simple one-shot command.

That matters because interactive CLIs behave differently when they are attached to a real terminal. They can print prompts, wait for stdin, show progress, and keep state across turns. A normal headless exec call is more like asking for a final answer. A PTY session is closer to sitting at the terminal yourself.

The bridge has a few main pieces:

- A session manager that starts and tracks one Droid CLI process per Discord channel
- An output pipeline that cleans terminal output, escapes Discord mentions, and chunks messages under Discord's limits
- A wait detector that tries to figure out when the CLI is waiting for human input
- An input relay that sends Discord replies back into the PTY
- A Discord bot layer that handles commands and authorization

The rough flow looks like this:

```text
Discord message
  -> Discord bot
  -> session manager
  -> PTY-backed Droid CLI
  -> output formatter
  -> Discord channel
```

When the session appears to be waiting, a normal Discord message can be relayed back into the CLI. If the detector gets it wrong, there are manual commands like `force-wait`, `clear-wait`, and `send` so the human can recover without restarting everything.

## Why wait detection is hard

This is the tricky part.

There is no universal signal that says "this CLI is now waiting for the human." Some programs print a question mark. Some print a prompt. Some just stop producing output. Some are still working silently. Some print text that looks like a prompt but is actually just a log line.

So the first version uses heuristics:

- Look for prompt-like patterns on the last line of output
- Watch for idle time while the process is still alive
- Let the user manually override the state when the guess is wrong

That is not perfect, but it is practical. The important design decision is not pretending the heuristic is flawless. The important part is making recovery easy when it fails.

For agent workflows, that is usually good enough to turn a brittle "job finished too early" problem into a manageable "the bridge needs a nudge" problem.

## Why not just keep using headless mode?

Headless mode is still useful. For simple tasks, it is probably better.

If I need Droid to run tests, fix a small bug, or write a report, headless execution is clean. Start the job, let it run, get the result.

But for longer tasks, the problem is not execution. The problem is decision points.

A coding agent might discover that two fixes are possible. One preserves compatibility but adds complexity. Another is cleaner but changes behavior. In a real CLI session, Droid can ask. In a brittle headless wrapper, it might finish with a passive recommendation, which means the whole job is effectively paused outside the session.

That is the gap this project is trying to close.

I want the agent to ask, get an answer, and continue in the same working context.

## The bigger pattern

This project is part of a bigger thing I have been building toward: AI agents that can coordinate with each other through normal interfaces.

Delta lives in Discord and acts like my always-on assistant. Droid is better for deep coding tasks. The more I use both, the more obvious it becomes that the interface between agents matters almost as much as the models themselves.

A lot of agent failures are not intelligence failures. They are handoff failures.

The agent knew what to do, but the wrapper ended too early. The agent needed approval, but the approval path was not live. The agent asked a good question, but the system treated that question as a final answer. The agent was still working, but the status message made it look stuck.

Those are infrastructure problems.

This bridge is a small attempt to make that infrastructure better.

## Where it is now

Right now, `droid-discord-cli-bridge` is an early prototype. It has the main pieces:

- PTY-backed session management
- Discord bot commands
- output formatting and chunking
- heuristic wait detection
- manual recovery commands
- environment-based config
- no committed secrets
- tests around the core behavior

It is not a polished product yet. It still needs real-world testing with longer Droid sessions, better progress summaries, and probably smarter detection around when the CLI is actually waiting.

But the direction feels right.

Instead of trying to perfectly reverse-engineer Droid's prompt behavior, this approach wraps the actual CLI experience. Discord becomes a remote terminal surface, and the agent gets to keep the interaction loop that makes it useful in the first place.

That feels much closer to what I actually want: not just AI that can run in the background, but AI that can stay in the loop with me without losing its place.
