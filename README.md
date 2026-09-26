# VitaSense

[![Deploy to GitHub Pages](https://github.com/mohamed-imam/vita-sense/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/mohamed-imam/vita-sense/actions/workflows/deploy-pages.yml)

A responsive website for **VitaSense**, presenting nerve and allergy testing with a calm visual identity.

## Overview

The site is designed to help prospective clients quickly understand VitaSense's services, approach, and appointment process. It uses the supplied VitaSense logo and a navy-and-teal visual system based on the brand's “Precision · Trust · Care” positioning.

## Features

- Responsive design for desktop, tablet, and mobile
- Clear descriptions of available tests
- Care-focused “Why VitaSense” section
- Expandable frequently asked questions
- Mobile navigation
- Accessible form labels, keyboard interactions, and reduced-motion support
- Appointment requests delivered through the VitaSense Google Apps Script
- Search and social-sharing metadata
- Custom VitaSense social preview image

## Technology

- React 19
- TypeScript
- Vinext and Vite
- Tailwind CSS entry point with custom responsive CSS
- Static export suitable for Cloudflare Pages and GitHub Pages

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
| `npm run typecheck` | Check TypeScript types |

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
  vitasense-logo.png  Transparent full Vitasense logo
  vitasense-mark.png  Compact Vitasense mark for browser icons
  og.png              Social-sharing preview
```

## Appointment form

The appointment form posts to a Google Apps Script web app owned by the VitaSense Google Workspace account. The script delivers each request to `info@vita-sense.com` and sends a confirmation response to the visitor without navigating away from the website.

The form uses a hidden honeypot field for basic spam filtering. The Apps Script deployment must remain available to “Anyone” and execute as the Workspace account that is authorized to send from `info@vita-sense.com`.

## Brand assets

The supplied logo is retained at `public/vitasense-logo.jpg`. Website-ready transparent versions are stored at `public/vitasense-logo.png` and `public/vitasense-mark.png`.

## Deployment

The intended production host is Cloudflare Pages at `vita-sense.com`. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for the Pages settings, form checks, and Squarespace DNS cutover. The existing GitHub Pages workflow remains available as a preview deployment from `main`.

## License

All VitaSense branding, copy, and visual assets are proprietary. All rights reserved.
