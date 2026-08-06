# VitaSense

[![Deploy to GitHub Pages](https://github.com/mohamed-imam/vita-sense/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/mohamed-imam/vita-sense/actions/workflows/deploy-pages.yml)

A modern, responsive healthcare website for **VitaSense**, presenting professional nerve, allergy, and circulation testing with a calm, trustworthy visual identity.

## Overview

The site is designed to help prospective clients quickly understand VitaSense's services, approach, and appointment process. It uses the supplied VitaSense logo and a navy-and-teal visual system based on the brand's “Precision · Trust · Care” positioning.

## Features

- Responsive design for desktop, tablet, and mobile
- Clear service pages for nerve, allergy, and circulation testing
- Care-focused “Why VitaSense” section
- Expandable frequently asked questions
- Mobile navigation
- Accessible form labels, keyboard interactions, and reduced-motion support
- Appointment request experience ready to connect to an email or booking service
- Search and social-sharing metadata
- Custom VitaSense social preview image

## Technology

- React 19
- TypeScript
- Vinext and Vite
- Tailwind CSS entry point with custom responsive CSS
- Static export suitable for GitHub Pages

## Getting started

### Requirements

- Node.js 22.13 or newer
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create the production build |
| `npm run start` | Run the production server |
| `npm run test` | Build and run the rendered HTML test |
| `npm run lint` | Check the codebase with ESLint |

## Project structure

```text
app/
  VitaSenseHome.tsx   Main interactive website component
  globals.css         Brand styles and responsive layouts
  layout.tsx          Site metadata and shared layout
  page.tsx            Statically exported home route
.github/workflows/
  deploy-pages.yml    GitHub Pages build and deployment
public/
  vitasense-logo.jpg  VitaSense logo
  og.png              Social-sharing preview
```

## Appointment form

The form currently provides the complete front-end experience but does not send enquiries to an external service. Before launch, connect it to the business's preferred email, CRM, or booking provider.

## Brand assets

The original supplied logo is retained in the project root for reference. The website-ready copy is stored at `public/vitasense-logo.jpg`.

## Deployment

Every push to `main` runs the GitHub Pages workflow, builds a static site, and deploys the contents of `dist/client`.

To enable the public test site:

1. Make the GitHub repository public.
2. Open **Settings > Pages** in the repository.
3. Set **Source** to **GitHub Actions**.
4. Push `main`, or run the workflow manually from the **Actions** tab.

The test URL will be `https://mohamed-imam.github.io/vita-sense/`.

## License

All VitaSense branding, copy, and visual assets are proprietary. All rights reserved.
