# Maik's Recipes

A static recipe website built with [Next.js](https://nextjs.org) and [Cooklang](https://cooklang.org).

- 💅 Clean recipe view combining features I like from other recipe sites
- ✨ Edit recipes with instant hot reload in dev mode
- 🚀 Fully static output for production
- 🇩🇪 Utility functions and word variants for proper German grammar (extended as needed)
- 😋 Delicious recipes collected from family, friends, and my personal favorites, so I can easily access and share them

## Getting started

1. Install the dependencies with `npm ci`
2. Start the dev server with `npm run dev`
3. Open http://localhost:3000

## Project structure

- The recipes are contained in the `recipes` directory (sorted into folders by category, which can be nested and are automatically converted into nice URLs)
- The `cookManifest.ts` file imports all `.cook` files. It is auto-generated when starting the dev server or building the static site.
- Everything else is a standard Next.js project using the App Router

## Writing recipes

Create a new `.cook` file in the `recipes` directory, nested in category subdirectories as appropriate. The filename will become the recipe name. Regenerate the `cookManifest.ts` by running `npm run generate` or restarting the dev server (required so Next.js can statically track recipe files).

The recipes use [Cooklang syntax](https://cooklang.org/docs/spec/). The following metadata fields are supported (other fields are ignored):

| Key      | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| servings | Number of servings                                               |
| source   | Source of the recipe (will be rendered as a link if it is a URL) |
| note     | Note that will be displayed above the recipe                     |

Tip: Install a syntax highlighting package for your text editor. See [cooklang.org](https://cooklang.org/docs/syntax-highlighting/) for full instructions.
