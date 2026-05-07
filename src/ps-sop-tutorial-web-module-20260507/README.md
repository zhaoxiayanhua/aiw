# PS/SOP Tutorial Web Module

This package contains a standalone HTML/CSS tutorial module for the PS and SOP writing guide.

## Files

- `index.html`: the tutorial page.
- `assets/`: image and SVG assets used by the page.

## How to Preview

Open `index.html` directly in a browser. No build step is required.

## Suggested Integration

This module is currently written as a standalone static HTML page with inline CSS. It can be integrated into an existing website in one of these ways:

1. Embed the HTML inside the target page as a content section.
2. Move the CSS into the website stylesheet and keep the same class names.
3. Copy the `assets/` folder into the website's static assets directory, then update image paths if the final assets path changes.

## Recommended Container

For best visual consistency, wrap the module in a centered container:

```css
.ps-sop-tutorial-wrapper {
  width: 100%;
  max-width: 1180px;
  min-width: 760px;
  margin: 0 auto;
}
```

If the website needs this module to appear smaller, reduce `max-width` instead of scaling the whole page with browser zoom. A range around `980px` to `1180px` usually works well.

## Notes

- The layout is responsive, but the comparison cards work best when the container is not narrower than about `760px`.
- Keep the relative path structure between `index.html` and `assets/` unless the image paths are updated.
- The module is static and does not require JavaScript.
