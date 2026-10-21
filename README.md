# Faiq Ajmal · personal website

A circuit-board themed personal site: projects, work, leadership, awards and sports, with a gold edge-connector menu, a board-color switcher and a datasheet pop-up for every project.

## Open it on your computer

Double-click `index.html`. It opens in your browser with no installs. (Online it also loads the site's fonts from Google Fonts; offline it uses your computer's fonts.)

## Edit it

Almost everything you'll want to change is in **one file: `assets/js/content.js`**. Open it in any text editor (Notepad, VS Code), change the text between the quotes, save, and refresh the page.

| To change… | Edit this in `content.js` |
|---|---|
| Your name, tagline, intro | `name`, `tagline`, `intro` at the top |
| About text | `about` (one line per paragraph) |
| The "Key specifications" table | `specs` (`["label", "value"]` pairs) |
| Skills | `skills` |
| Projects | `projects` (copy a `{ ... },` block to add one) |
| Work, leadership | `experience`, `leadership` |
| Awards, sports | `awards`, `sports` |
| Email, GitHub, LinkedIn | `contact` (empty ones stay hidden) |
| Menu words and section titles | `sections` |
| Default board color | `boardColor` |

Rules that keep it working:

- Keep the quotes `"..."` and the comma at the end of each line.
- To hide something, delete its whole `{ ... },` block, or leave a field as `""`.
- If the page shows a red "content.js has a mistake" box, check your last edit for a missing quote, comma or bracket. Press F12 → Console to see the line number.

### Add your photo

Save a photo as `me.jpg` in `assets/img/`, then set `photo: "assets/img/me.jpg"` in `content.js`. Until then the camera module shows your initials.

### Change colors or fonts

They're the tokens at the top of `assets/css/style.css`. The five board colors are the `[data-mask]` lines right under them.

## Files

```
index.html              page skeleton (no need to edit)
assets/js/content.js    ALL your text  ← edit this
assets/js/site.js       builds the page from content.js
assets/css/style.css    colors, fonts, layout
assets/img/             your photos
```

## Publishing on GitHub Pages

This folder is a GitHub Pages site. In a repository named `yourusername.github.io` it's published at `https://yourusername.github.io`.

1. On GitHub, open the repository → **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, **Branch** to `main` and folder `/ (root)`, then **Save**.
3. Wait a minute or two and open the link.

Every change pushed to `main` updates the same link. You can also edit straight on GitHub: open `assets/js/content.js`, click the pencil icon, make your change and **Commit changes**. The site updates within a couple of minutes.
