# Text-to-SQL Frontend

A React + Vite frontend that lets users ask natural-language questions about a database. The query is sent to a Spring Boot backend which uses an LLM to generate SQL, executes it, and returns the results.

Live Application - https://text2sql-frontend-nu.vercel.app/

## Prerequisites

- **Node.js** ≥ 18 (includes `npm`)
- **Spring Boot backend** running at `http://localhost:8080`

## Installation

1. **Navigate to the frontend directory:**

   ```bash
   cd text2sql-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create the environment file** (if not already present):

   Create a `.env.local` file in the project root:

   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

   > Change the URL if your backend runs on a different host or port.

## Running the App

1. **Start the Spring Boot backend first** — the frontend expects it at the URL configured in `.env.local`.

2. **Start the dev server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**

   ```
   http://localhost:5173
   ```

## Production Build

To create an optimized production bundle:

```bash
npm run build
```

The output will be in the `dist/` directory. Preview it locally with:

```bash
npm run preview
```

## CORS

The backend must allow requests from `http://localhost:5173`. A `CorsConfig.java` is included in the backend project under:

```
src/main/java/com/example/texttosqlchat/config/CorsConfig.java
```

If you change the frontend port, update the `allowedOrigins` in that file accordingly.

## Project Structure

```
text2sql-frontend/
├── .env.local                  # API base URL config
├── index.html                  # Entry HTML
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Router setup (Landing + Query pages)
    ├── index.css               # Global styles
    ├── api/
    │   └── query.ts            # API call to backend (POST /api/v1/sql/generate-and-execute)
    ├── hooks/
    │   └── useQueryState.ts    # State management for query lifecycle
    ├── components/
    │   ├── shared/
    │   │   └── Header.tsx
    │   ├── landing/
    │   │   ├── Hero.tsx
    │   │   ├── HowItWorks.tsx
    │   │   ├── SchemaPreview.tsx
    │   │   └── ExampleChips.tsx
    │   └── query/
    │       ├── QueryInput.tsx      # Textarea + submit button
    │       ├── PromptChips.tsx     # Suggested prompt buttons
    │       ├── SqlPanel.tsx        # Syntax-highlighted SQL display
    │       ├── ResultsTable.tsx    # Dynamic table from query results
    │       ├── StatResult.tsx      # Single-value stat display
    │       ├── SkeletonLoader.tsx  # Loading skeleton
    │       └── QueryHistory.tsx    # Recent query history
    ├── pages/
    │   ├── LandingPage.tsx
    │   └── QueryPage.tsx
    └── utils/
        └── cn.ts               # className merge utility
```

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Framework | React 19 + TypeScript         |
| Bundler   | Vite 7                        |
| Styling   | Tailwind CSS 4                |
| HTTP      | Axios                         |
| Routing   | React Router DOM 7            |
| Animation | Framer Motion                 |
| SQL       | react-syntax-highlighter      |

## Database Schema (for reference)

The backend queries a SQLite database with these tables:

- **customers** — `id`, `name`, `country`, `signup_date`
- **products** — `id`, `name`, `category`, `price`
- **orders** — `id`, `customer_id`, `order_date`, `total`
- **order_items** — `order_id`, `product_id`, `quantity`, `unit_price`
- **payments** — `id`, `order_id`, `payment_date`, `amount`, `method`

### Example questions you can ask:

- "Show all customers"
- "Products under $100"
- "Total revenue by payment method"
- "Orders placed in 2024"
- "Customers who ordered more than twice"
- "Most expensive product per category"

Backend Repository - https://github.com/KrishChourasia214/text2sql-backend
