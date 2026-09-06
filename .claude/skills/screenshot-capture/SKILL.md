---
name: screenshot-capture
description: Use when documentation needs a terminal or browser image showing expected output, when a draft is marked as needing a visual, and when existing images look inconsistent with each other.
---

# Screenshot Capture

Once a project ships more than a handful of images, inconsistent ones read as
sloppy — and worse, a screenshot that does not match what the reader sees on
their screen makes them think they did it wrong.

**Never mock output.** Run the real command, capture the real result.

## Standards

Fix these once, then never decide them again. The values below are a working
starting point — change them to suit your project, but write the decision down
so every image after it matches.

| Aspect | Rule |
|---|---|
| Terminal background | One fixed colour across every image (e.g. graphite `#2f2f2f`, text `#f3f3f3`) |
| Terminal font | One fixed font and size (e.g. JetBrains Mono 14px) |
| Terminal cropping | Tight to the relevant output. No usernames, no home paths |
| Browser viewport | Fixed widths, never "whatever the window was" (e.g. 1280px desktop, 390px mobile) |
| Browser chrome | Excluded, unless the chrome is the thing being taught |
| Filename | One convention, applied everywhere, sorting in reading order |
| Format | WebP or AVIF, served through your framework's image component |
| Alt text | What the reader should see. Never "screenshot of terminal" |

## Recipe

1. Run the real command or load the real page.
2. Capture browser shots through the Playwright MCP so they are reproducible
   by the next person; capture terminal shots with the fixed profile above.
3. Crop to the relevant region.
4. Name it to the convention and save it to the project's image directory.
5. Write alt text describing the content, then check both themes if the image
   is of your own UI.

## Alt text

```
❌ "Screenshot of the terminal"
❌ "Terminal output"
✅ "Terminal showing pwd printing a path that ends in my-first-app"
```

The alt text carries the whole point for a screen-reader user, and it is also
what a reader sees when the image fails to load on a slow connection.

## Before it ships

- Personal data out of frame — username, home directory, machine name, tokens
- Output matches what the surrounding text says it will be, character for
  character
- Optimised, and sized for the box it renders into
- Renders correctly in light and dark if it shows your own interface
