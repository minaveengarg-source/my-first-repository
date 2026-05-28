
raw
Readme · MD
# ⚛️ React Projects Collection
 
A collection of **19 beginner-to-intermediate React projects** built with functional components and React Hooks. Each project is a single self-contained `.jsx` file — no routing library or external CSS required.
 
---
 
## 🗂️ Projects Overview
 
| # | Project | Concepts Covered |
|---|---------|-----------------|
| 1 | [Counter App](#1-counter-app) | `useState`, event handlers |
| 2 | [Todo App](#2-todo-app) | `useState`, `useEffect`, localStorage |
| 3 | [Advanced Todo](#3-advanced-todo) | filters, edit/delete, validation |
| 4 | [Simple Form](#4-simple-form) | controlled inputs, form validation, localStorage |
| 5 | [Contact Form with Validation](#5-contact-form-with-validation) | regex validation, password strength meter |
| 6 | [User Profile Card](#6-user-profile-card) | reusable components, props, toggle state |
| 7 | [Theme Toggle](#7-theme-toggle) | dark/light mode, localStorage, dynamic styles |
| 8 | [Blog App](#8-blog-app) | state-based routing, search & filter |
| 9 | [Admin Dashboard](#9-admin-dashboard) | layout, sidebar navigation, stat cards, table |
| 10 | [Cart App](#10-cart-app) | add/remove/update cart, localStorage, quantity |
| 11 | [Expense Tracker](#11-expense-tracker) | CRUD, category badges, totals |
| 12 | [Shopping List Manager](#12-shopping-list-manager) | category filters, buy/uncheck items |
| 13 | [Quiz App](#13-quiz-app) | timer, score tracking, answer feedback |
| 14 | [Weather App](#14-weather-app) | `useEffect`, REST API (OpenWeatherMap) |
| 15 | [GitHub User Finder](#15-github-user-finder) | GitHub REST API, async/await, error states |
| 16 | [Movie Search App](#16-movie-search-app) | Anthropic AI API, async search, card UI |
| 17 | [News App](#17-news-app) | Anthropic AI API, category filters, pagination |
| 18 | [Random User Generator](#18-random-user-generator) | Anthropic AI API, card generation |
| 19 | [Random User Generator (styled)](#18-random-user-generator) | Google Fonts, dark theme, DM Sans |
| 20 | [Chat App](#20-chat-app) | `useState`, `useEffect`, `useRef`, auto-scroll |
---
 
## 🚀 Getting Started
 
### Prerequisites
- Node.js ≥ 16
- A React project (Vite recommended)
### Setup
 
```bash
# Create a new Vite + React project
npm create vite@latest my-app -- --template react
cd my-app
npm install
 
# Copy any .jsx file into src/
cp BlogApp.jsx src/App.jsx
 
npm run dev
```
 
Each file exports a default component — just replace `src/App.jsx` with the file you want to run.
 
---
 
## 📁 Project Details
 
### 1. Counter App
**File:** `counter-app (1).jsx`
 
A simple counter with increment, decrement, reset, and step-by-5 controls. Prevents negative values.
 
**Concepts:** `useState`, conditional logic, event handlers.
 
---
 
### 2. Todo App
**File:** `TodoApp.jsx`
 
Add, complete, and delete tasks with All / Active / Completed filters. Data persists via `localStorage`.
 
**Concepts:** `useState`, `useEffect`, localStorage, array methods.
 
---
 
### 3. Advanced Todo
**File:** `AdvancedTodo.jsx`
 
Full-featured todo with inline editing, validation, filter tabs, and task counts.
 
**Concepts:** `useState`, edit mode, input validation, filters.
 
---
 
### 4. Simple Form
**File:** `SimpleForm.jsx`
 
A two-field form (name + email) with real-time validation, submit loading state, and localStorage persistence.
 
**Concepts:** Controlled inputs, `useEffect`, form validation.
 
---
 
### 5. Contact Form with Validation
**File:** `ContactFormWithValidation.jsx`
 
Registration form with name, email, and password fields. Includes a live password strength meter (Weak → Strong).
 
**Concepts:** Regex validation, derived state, visual feedback.
 
---
 
### 6. User Profile Card
**File:** `User Profile Card.jsx`
 
A reusable `UserCard` component showing a profile image, online/offline status badge, and a follow/unfollow toggle button.
 
**Concepts:** Props, `useState`, reusable components.
 
---
 
### 7. Theme Toggle
**File:** `ThemeToggle.jsx`
 
Light/dark mode toggle with localStorage persistence. Tracks how many times the theme has been switched.
 
**Concepts:** `useState`, `useEffect`, localStorage, dynamic inline styles.
 
---
 
### 8. Blog App
**File:** `BlogApp.jsx`
 
Multi-page blog with a home feed, post detail view, and a create post form. Search and category filter on the home page. New posts appear instantly.
 
**Concepts:** State-based routing (no react-router-dom), search/filter, lifting state.
 
---
 
### 9. Admin Dashboard
**File:** `AdminDashboard.jsx`
 
Admin panel with a sidebar, top navbar with live search, stat cards (users, reports, analytics), and a user table with status badges. Search filters the table in real time.
 
**Concepts:** Component composition, inline SVG icons, interactive sidebar, table rendering.
 
---
 
### 10. Cart App
**File:** `CartApp.jsx`
 
E-commerce cart — add products, adjust quantity with +/−, remove items, and see a running total in INR (₹). Cart persists in `localStorage`.
 
**Concepts:** `useState`, `useEffect`, localStorage, array `map`/`filter`/`reduce`.
 
---
 
### 11. Expense Tracker
**File:** `ExpenseTracker.jsx`
 
Track daily expenses by category (Food, Transport, Shopping, Health, Entertainment, Bills, Other). Colour-coded badges, total summary, and delete support.
 
**Concepts:** CRUD operations, category colour maps, derived totals.
 
---
 
### 12. Shopping List Manager
**File:** `ShoppingListManager.jsx`
 
Grocery list with category grouping, quantity selector, bought/unbought toggle, and category filter.
 
**Concepts:** `useState`, category-based filtering, toggle patterns.
 
---
 
### 13. Quiz App
**File:** `QuizApp.jsx`
 
React knowledge quiz with a countdown timer, instant answer feedback (correct/wrong highlight), score summary at the end, and a restart option.
 
**Concepts:** `useState`, `useEffect`, `useCallback`, timer with `setInterval`.
 
---
 
### 14. Weather App
**File:** `WeatherApp.jsx`
 
Search weather by city using the OpenWeatherMap API. Displays temperature, humidity, wind speed/direction, and a weather icon.
 
> ⚠️ Requires a free API key from [openweathermap.org](https://openweathermap.org/api).  
> Replace `"YOUR_API_KEY_HERE"` in the file with your key.
 
**Concepts:** `useEffect`, REST API, async/await, error handling.
 
---
 
### 15. GitHub User Finder
**File:** `GitHubUserFinder.jsx`
 
Search any GitHub username and view their avatar, bio, follower/following counts, and public repositories with language colour indicators.
 
**Concepts:** GitHub REST API, `useState`, async/await, conditional rendering.
 
---
 
### 16. Movie Search App
**File:** `MovieSearchApp.jsx`
 
AI-powered movie search using the Anthropic API. Returns 8 relevant movies with title, year, genre, rating, cast, plot, and awards.
 
> ⚠️ Requires an [Anthropic API key](https://console.anthropic.com/).
 
**Concepts:** Anthropic API, async/await, JSON parsing, card UI.
 
---
 
### 17. News App
**File:** `NewsApp.jsx`
 
AI-generated news feed with category tabs (Technology, Business, Science, Health, Sports, Entertainment) and pagination.
 
> ⚠️ Requires an [Anthropic API key](https://console.anthropic.com/).
 
**Concepts:** Anthropic API, category filters, `useCallback`, pagination.
 
---
 
### 18. Random User Generator
**File:** `RandomUserGenerator.jsx`
 
Generates random user profiles (name, age, job, location, bio, skills) via the Anthropic API with a dark-themed card UI.
 
> ⚠️ Requires an [Anthropic API key](https://console.anthropic.com/).
 
**Concepts:** Anthropic API, Google Fonts (`DM Sans`), dark theme, card layout.
 
---

### 20. Chat App
**File:** `ChatApp.jsx`

A real-time chat UI where you can switch between users (You, Rahul, Priya, Aman)
and send messages. Each user gets a unique colour-coded avatar and bubble.
Messages auto-scroll to the bottom on arrival. Send button disables when input
is empty. Press **Enter** to send.

**Concepts:** `useState`, `useEffect`, `useRef`, auto-scroll, conditional styling,
inline SVG icons.
## 🛠️ Tech Stack
 
- **React** (functional components + Hooks)
- **Vite** (recommended bundler)
- **Inline styles / CSS-in-JS** (no external CSS framework)
- **OpenWeatherMap API** — WeatherApp only
- **GitHub REST API** — GitHubUserFinder only
- **Anthropic Claude API** — MovieSearchApp, NewsApp, RandomUserGenerator
---
 
## 📚 React Concepts Index
 
| Concept | Projects |
|---------|---------|
| `useRef` | ChatApp |
| `useState` | All projects |
| `useEffect` | TodoApp, SimpleForm, ThemeToggle, WeatherApp, QuizApp, NewsApp |
| `useCallback` | QuizApp, MovieSearchApp, NewsApp |
| localStorage | TodoApp, SimpleForm, ThemeToggle, CartApp |
| REST API calls | WeatherApp, GitHubUserFinder |
| AI API (Anthropic) | MovieSearchApp, NewsApp, RandomUserGenerator |
| Props & reusable components | UserProfileCard, AdminDashboard, BlogApp, CartApp |
| Form validation | SimpleForm, ContactFormWithValidation |
| State-based routing | BlogApp |
| Filters & search | BlogApp, AdminDashboard, AdvancedTodo, ShoppingListManager |
 
---
 
## 📄 License
 
MIT — free to use, modify, and share.
