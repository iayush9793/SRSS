# Modern Next.js 14 Website

A modern, full-featured website built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

## Features

- ✨ **Modern Design**: Clean, elegant interface with smooth animations
- 🎨 **Dark/Light Mode**: Theme toggle with next-themes
- 🎭 **Framer Motion**: Smooth animations and transitions throughout
- 📱 **Responsive**: Fully responsive design for all devices
- 🎯 **TypeScript**: Full type safety
- 🧩 **shadcn/ui**: Accessible, customizable UI components
- ⚡ **Performance**: Optimized with Next.js 14 and modern best practices

## Pages

- **Home**: Hero section, features, pricing, testimonials
- **About**: Mission, values, team showcase
- **Services**: Animated service cards with detailed information
- **Contact**: Contact form with validation

## Components

- **Navbar**: Sticky navbar with scroll-based hide/show
- **Footer**: Social links, newsletter signup, and site links
- **Scroll Progress**: Animated progress bar at the top
- **Back to Top**: Floating button that appears on scroll
- **Animated Counter**: Number animations for statistics
- **Loading Screen**: Brand logo loading animation

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **Framer Motion** - Animation library
- **next-themes** - Theme management
- **react-hook-form** - Form handling
- **zod** - Schema validation

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── services/       # Services page
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── navbar.tsx      # Navigation bar
│   ├── footer.tsx      # Footer component
│   └── ...             # Other components
└── lib/
    ├── animations.ts   # Animation variants
    └── utils.ts        # Utility functions
```

## Customization

- Update colors in `app/globals.css`
- Modify animations in `lib/animations.ts`
- Customize components in `components/ui/`
- Update content in page files

## License

MIT
