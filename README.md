# frankchangshow.com

Private coaching site for Frank Chang. Built with Next.js 16, React 19 and Tailwind CSS 4. Fully static.

## Three design directions

The site currently ships three complete brand directions so they can be compared before choosing one:

| Route | Direction | Feel |
| --- | --- | --- |
| `/ivory` | **Ivory** | Editorial, warm. Ivory paper, ink, bronze. Fraunces + Inter. |
| `/forest` | **Forest** | Grounded, dark. Deep green, cream, soft gold. Instrument Serif + Manrope. |
| `/slate` | **Slate** | Modern, cool. Grey canvas, near-black, cobalt. Geist. |

Each direction has the same four pages: `/`, `/coaching`, `/about`, `/apply`. The root `/` is a comparison gallery.

### Choosing one

Once a direction is picked, promote it to the root:

1. Delete `app/page.tsx` (the gallery) and move `app/[variant]/*` up to `app/`.
2. Replace `await params` / `href(variant, …)` with plain paths, and hard-code `data-theme="<chosen>"` in `app/layout.tsx`.
3. Remove the other two blocks from `app/globals.css` and the unused fonts from `app/layout.tsx`.

## Editing the words

All copy lives in `lib/content.ts`. Nothing else needs to change to refine the wording.

## Application form

`components/ApplyForm.tsx` posts JSON (`name`, `email`, `message`) to `NEXT_PUBLIC_FORM_ENDPOINT` when set (Formspree, Basin, a Vercel function, etc.). Without it, the form opens the visitor's mail client with a prefilled message to `site.email` in `lib/content.ts`.

## Local development

```bash
npm install
npm run dev
```

## Deployment

**Vercel (recommended).** Import the repo; no configuration needed. Set `NEXT_PUBLIC_FORM_ENDPOINT` in Project → Settings → Environment Variables if using a form backend.

Suggested Vercel project name: `frankchangshow-home`. Do not use `frankchangshow`; that Vercel project is a v0 stub.

**GitHub Pages.** Add `output: "export"` to `next.config.ts`, run `npm run build`, and publish the `out/` directory. All routes are prerendered, so no server is required.
