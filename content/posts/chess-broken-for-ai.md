---
title: "Chess is Broken for AI (And I'm Trying to Fix It)"
description: "Why large language models fundamentally misunderstand chess, how I'm building a coaching tool around that limitation, and why I'm skeptical of the chess AI products popping up everywhere."
date: "2026-04-05"
tags: ["AI", "Chess", "ChessCoachAI", "LLMs", "Side Projects"]
---

# Chess is Broken for AI (And I'm Trying to Fix It)

I play a lot of chess. I'm chasing a Candidate Master title, I play Board 1 for Pitt's third team in the PCL, and I spend more time thinking about the Caro-Kann than I'd like to admit. So when large language models started getting good at everything, I figured it was only a matter of time before they got good at chess too.

They didn't. And I don't think they're close.

## The Fundamental Problem

LLMs don't actually *think* about positions. They don't build search trees. They don't evaluate pawn structures or calculate forced lines. They predict the next token. That works great for writing an email. It does not work for a game where one miscalculated move loses you the entire position.

Ask any major model to play a game of chess and within 10 moves it'll start hallucinating illegal moves. It'll try to move pieces that aren't on the board. It doesn't have an internal board state. It's just pattern-matching against PGN data it was trained on, and once the position goes off-book, it falls apart.

This isn't a small gap that's closing. This is a *structural* limitation. Chess isn't language. The notation might look like text, but the actual game is spatial, combinatorial, and requires deep calculation. No amount of scaling a transformer is going to give it the ability to brute-force evaluate 30 moves deep like Stockfish does.

## So I Built Something Around It

I've been working on a project called ChessCoachAI, and the core idea is simple: don't make the AI play chess. Make it *teach* chess.

Stockfish 18 runs in the browser via WebAssembly. It handles all the actual chess computation. The AI layer sits on top. When you ask the coach "Why is this move bad?", the LLM gets the current position, Stockfish's evaluation, the top engine lines, and your move history. Then it translates that raw analysis into a coaching conversation. It explains *why* the engine likes a move, relates it to real concepts, and adjusts to your rating level.

The LLM never touches the board. It reads Stockfish's output and explains it, like a translator between a supercomputer and a human who just wants to understand why their knight trade was terrible.

## The Limitation I Can't Get Past

Even with all of this, the coaching quality is bottlenecked by how well the LLM understands positional chess. I can feed it perfect engine data. But when it tries to explain *why* a pawn structure is weak, or give you a plan instead of just a move, the gaps show.

It's decent at openings. It can reference theory and database stats. But in complex middlegames where evaluation is close, the coaching gets generic. "Develop your pieces. Control the center. Look for tactics." That's not coaching. That's a chess.com article from 2015.

I want it to say things like "Your knight on c5 is strong, but it becomes a target once White plays b4. Consider rerouting to e6 where it supports a kingside break." That level of positional understanding is still out of reach. Models can identify that Stockfish prefers a move, but they struggle to articulate the *strategic reasoning* in a way that actually teaches you something.

And the pace of improvement is slower than people think. Each new model gets marginally better at chess commentary, but the fundamental issue hasn't changed. I need models to reason about space, time, and material in a way that current architectures just don't support.

## The Market Is Moving Anyway

I keep seeing new chess AI products get announced. AI opening trainers. AI game reviewers. AI coaching bots. Every few weeks there's a new one.

I'm skeptical. Not because they look bad, but because I've spent enough time in this space to know the limits. If they're using raw LLM output for move suggestions, their users are getting hallucinated garbage. If they're using an engine underneath, then what are they offering that Lichess analysis plus a YouTube video doesn't already give you?

The value has to be in the coaching layer, in the AI's ability to turn engine output into personalized instruction. And that's exactly the part current models are weakest at. So when I see these products launching, I'm genuinely curious: did they solve something I haven't? Or are they just wrapping a chat interface around Stockfish and calling it coaching?

For now, I'm still building. The engine layer works. The coaching is the frontier. And I'm going back to studying the Caro-Kann, where at least Stockfish doesn't hallucinate.
