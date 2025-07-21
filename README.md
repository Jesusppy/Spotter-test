## ⚡️ Technical Test for Spotter Job Application

**Note:** As part of this technical test, you must use your own RapidAPI key to run the app. Please enter your API key in `src/api/skyScrapper.ts` as indicated below.

# Spotter Flight Search App

Modern flight search application built with React, TypeScript, and Vite. Compare flights from hundreds of websites, view prices on a calendar, and enjoy a beautiful, responsive UI powered by Material UI.

## Features

- Search for flights between airports with autocomplete
- View prices for each day in a calendar (Google Flights style)
- Responsive design and modern UI
- Filter and sort results by price, stops, duration, and airline
- Detailed flight modal with airline logo, leg info, and checkout suggestion
- Powered by RapidAPI Sky Scrapper endpoints

## Project Structure

```
spotter-test/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── skyScrapper.ts
│   ├── components/
│   │   ├── FlightCard/
│   │   │   └── FlightCard.tsx
│   │   ├── FlightDetailModal/
│   │   │   └── FlightDetailModal.tsx
│   │   ├── FlightList/
│   │   │   └── FlightList.tsx
│   │   ├── FlightSearchForm/
│   │   │   └── FlightSearchForm.tsx
│   │   └── Navbar/
│   │       └── Navbar.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useFlightSearch.ts
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── styles/
│   │   └── theme.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── formatters.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
3. **Open [http://localhost:5173](http://localhost:5173) in your browser**

## API Setup

This app uses RapidAPI Sky Scrapper endpoints. You will need your own RapidAPI key. Configure your API key in the appropriate place in `src/api/skyScrapper.ts`.

## License

MIT
