---
name: screenshot-capture
description: Use when a lesson needs a terminal or browser image showing expected output, when the /capture command runs, when a draft is marked as needing a visual, and when existing lesson images look inconsistent with each other.
---

# Screenshot Capture

Roughly 200 images ship across this course. Inconsistent ones read as sloppy;
worse, a screenshot that does not match what the student sees makes them think
they did it wrong.

**Never mock output.** Run the real command, capture the real result.

## Standards

| Aspect | Rule |
|---|---|
| Terminal background | Graphite `#2f2f2f`, text `#f3f3f3` |
| Terminal font | JetBrains Mono 14px, identical across the whole course |
| Terminal cropping | Tight to the relevant output. No usernames, no home paths |
| Browser viewport | 1280px desktop, 390px mobile — fixed, never "whatever the window was" |
| Browser chrome | Excluded, unless the chrome is the thing being taught |
| Filename | `L{level}-M{module}-{order}-{slug}.png` in `public/img/lessons/` |
| Format | WebP, served through `next/image` |
| Alt text | What the student should see. Never "screenshot of terminal" |

## Recipe

1. Run the real command or load the real page.
2. Capture browser shots through the Playwright MCP so they are reproducible
   by the next person; capture terminal shots with the fixed profile above.
3. Crop to the relevant region.
4. Name it to the convention and save under `public/img/lessons/`.
5. Write alt text describing the content, then check both themes if the image
   is of our own UI.

## Alt text

```
❌ "Screenshot of the terminal"
❌ "Terminal output"
✅ "Terminal showing pwd printing a path that ends in my-first-app"
```

The alt text carries the whole lesson for a screen-reader user, and it is also
what a student reads when the image fails to load on a slow connection.

## Before it ships

- Personal data out of frame — username, home directory, machine name, tokens
- Output matches what the lesson text says it will be, character for character
- Optimised to WebP
- Renders correctly in light and dark if it shows our own interface
