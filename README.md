# Keenan — personal portfolio

A responsive, multi-page portfolio in warm white and muted gold, built with plain HTML, CSS, and JavaScript. No framework or dependencies are needed.

## Run locally

```sh
npm run dev
```

Open `http://localhost:3000`. Set `PORT` to use a different port.

```sh
npm run check
npm run build
```

The build copies the website into `dist/`, ready for any static host. To serve the built website, run `node scripts/serve.mjs --dist`.

## Pages and features

- Home: design-led website offer from R4,000, primary WhatsApp contact, featured work, and about preview.
- Work: two featured live websites with screenshots, walkthroughs, and live links.
- About: biography, approach, capabilities, and a personal studio composition showing the actual website builds.
- Contact: direct WhatsApp contact, a validated WhatsApp enquiry draft, optional email contact, and expandable FAQs.
- Case studies: individual project views at `project.html?project=barber` and `guest-house`, including scope, challenge, approach, and outcome. Both live projects include a live link, actual desktop and mobile screenshots, a booking or stay-planner interface capture, and a short video walkthrough.
- A custom 404 page, mobile navigation, keyboard focus states, reduced-motion support, and lightweight scroll reveals. The hero uses local desktop and mobile website mockups with subtle scroll-linked transforms, disabled for reduced-motion preferences.

Project artwork and screenshots are local SVG and WebP assets, so the core visual design has no external image dependency. The homepage device previews show the live barber shop build. The MP4 walkthroughs load only when requested and have native playback controls. Google Fonts enhance the sans-serif typography when available; system fallbacks are defined.

## Make it yours

1. Set your name, location, WhatsApp number, and optional email in `site.config.js`. The initial name and location are starter copy. WhatsApp currently uses the supplied South African number, 071 586 8386, in international link format, 27715868386.
2. Replace the biography and page copy in the HTML files. Update page titles and descriptions too.
3. Add project metadata in `script.js` and matching work cards in `index.html` and `work.html`. Register new project slugs in `scripts/check.mjs`. Mohammed’s Barber Shop and Salt & Still are live proof of work: independently built websites for fictional businesses. Salt & Still uses AI-created imagery and a demo stay planner with illustrative rates; it makes no real reservations. Only completed, deployed builds are included; placeholder concepts have been removed.
4. Change the colors and typography using the variables at the top of `styles.css`.

### Contact behavior

WhatsApp is the main contact route. Direct buttons open a chat with a short greeting. Submitting the enquiry form opens a new WhatsApp tab with the visitor’s message, name, service choice, and optional email prefilled. WhatsApp receives the draft through its link; the visitor reviews and sends it themselves. The website does not store enquiries or automatically send messages.

The email is intentionally empty until you provide a real address. Setting `email` displays a secondary email option and a copy button. If WhatsApp is removed from the configuration, the form falls back to opening an email draft when an address is configured, or preparing a local copyable message when neither contact method is configured. No backend or email delivery service is included.

## Verification

`npm run check` checks page metadata, local file references, anchors, project URLs, image alt text and dimensions, form label associations, duplicate IDs, and JavaScript syntax. These checks do not replace visual browser testing.
