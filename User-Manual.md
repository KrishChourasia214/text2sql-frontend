<![CDATA[# 🗃️ Text-to-SQL Chat — Natural Language Database Querying

> Ask questions in plain English and get instant SQL results from your database.

**Text-to-SQL Chat** is a full-stack application that converts natural language questions into SQL queries using an LLM (Large Language Model), executes them against a live SQLite database, and displays the results in a clean, modern UI.

---

## 📸 Overview

| Feature | Description |
|---|---|
| **Natural Language Input** | Type questions like _"Show all products under $100"_ |
| **LLM-Powered SQL Generation** | Uses DeepSeek-V3 (via Hugging Face) to translate text → SQL |
| **Live Query Execution** | Runs the generated SQL against a real SQLite database |
| **Dynamic Schema Detection** | Automatically reads your database schema — no hardcoding |
| **Friendly Error Messages** | Invalid queries return helpful hints, not raw stack traces |
| **Query History** | Keeps track of your last 15 queries in local storage |
| **Quick Prompt Chips** | One-click example queries to get started fast |

---

## 🏗️ Architecture

```
┌─────────────────────────┐         ┌──────────────────────────────────┐
│    React Frontend       │  HTTP   │    Spring Boot Backend           │
│    (Vite + TypeScript)  │ ◄─────► │    (Java 21 + Maven)             │
│                         │         │                                  │
│  • Landing Page         │         │  • TextToSqlController           │
│  • Query Page           │         │  • LLMService (Hugging Face)     │
│  • Results Table        │         │  • DatabaseExecutionService      │
│  • SQL Syntax Highlight │         │  • SQLite (database.db)          │
└─────────────────────────┘         └──────────────────────────────────┘
```

### Request Flow

```
User Question ──► Frontend ──► POST /api/v1/sql/generate-and-execute
                                         │
                                         ▼
                               LLMService.generateSqlQuery()
                                  │  Extracts live schema
                                  │  Sends prompt to DeepSeek-V3
                                  │  Returns raw SQL
                                  ▼
                          DatabaseExecutionService.executeQuery()
                                  │  Validates (SELECT only)
                                  │  Executes via JdbcTemplate
                                  │  Returns rows or friendly error
                                  ▼
                              JSON Response ──► Frontend ──► Results Table
```

---

## 📋 Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| **Java JDK** | 21+ | Backend runtime |
| **Maven** | 3.9+ (or use included `mvnw`) | Build tool |
| **Node.js** | 18+ | Frontend runtime |
| **npm** | 9+ | Frontend package manager |
| **Git** | Any | Version control |

> [!NOTE]
> The project includes a Maven Wrapper (`mvnw` / `mvnw.cmd`), so you don't need Maven installed globally.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/text2sql-parent.git
cd text2sql-parent
```

### 2. Set Up the Backend

```bash
cd text-to-sql-javaSpringboot-main
```

#### Configure the LLM API Key

Open `src/main/resources/application.properties` and update the LLM settings:

```properties
# LLM API Configuration
llm.api.base-url=https://router.huggingface.co/v1
llm.api.model=deepseek-ai/DeepSeek-V3.2-Exp
llm.api.key=YOUR_HUGGINGFACE_API_KEY
```

> [!IMPORTANT]
> You need a **Hugging Face API token** with Inference API access. Get one free at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

#### Build & Run

**Windows:**
```cmd
mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
chmod +x mvnw
./mvnw spring-boot:run
```

The backend will start on **`http://localhost:8080`**.

---

### 3. Set Up the Frontend

Open a **new terminal** window:

```bash
cd text2sql-frontend
```

#### Install Dependencies

```bash
npm install
```

#### Configure the API URL

For **local development**, create or edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For **production** (e.g., pointing to a deployed backend):

```env
VITE_API_BASE_URL=https://your-deployed-backend.onrender.com
```

#### Start the Dev Server

```bash
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

---

### 4. Open the App

Navigate to **`http://localhost:5173`** in your browser. You'll see the landing page with an overview of how the app works. Click **"Start Querying"** to go to the query interface.

---

## 💬 Usage Guide

### Asking Questions

Type any natural language question about your data into the input box and press **Enter** or click the **Ask** button.

**Example questions:**

| Question | Generated SQL |
|---|---|
| Show all customers | `SELECT * FROM customers;` |
| Products under $100 | `SELECT * FROM products WHERE price < 100;` |
| Total revenue by payment method | `SELECT method, SUM(amount) FROM payments GROUP BY method;` |
| Orders placed in 2024 | `SELECT * FROM orders WHERE order_date LIKE '2024%';` |
| Customers who ordered more than twice | `SELECT c.name, COUNT(*) FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name HAVING COUNT(*) > 2;` |
| Most expensive product per category | `SELECT category, name, MAX(price) FROM products GROUP BY category;` |

### Quick Prompt Chips

Click any of the pre-built prompt chips below the input box to instantly run a common query without typing.

### Query History

Your recent queries are saved in browser local storage (up to 15). Click the **History** button to view and re-run past queries. Use **Clear History** to reset.

### Understanding Results

- **SQL Panel** — Shows the generated SQL query with syntax highlighting
- **Results Table** — Displays the query results in a sortable table
- **Error Panel** — If something goes wrong, you'll see a friendly error message like:
  - _"The query referenced a column that doesn't exist in this table. Try rephrasing your question."_
  - _"The generated SQL has a syntax error. Try rephrasing your question."_

---

## 🗄️ Database Schema

The app ships with a pre-configured SQLite database (`database.db`) containing the following tables:

```sql
-- Customers
CREATE TABLE customers (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    country     TEXT,
    signup_date DATE
);

-- Products
CREATE TABLE products (
    id       INTEGER PRIMARY KEY,
    name     TEXT NOT NULL,
    category TEXT,
    price    REAL
);

-- Orders
CREATE TABLE orders (
    id          INTEGER PRIMARY KEY,
    customer_id INTEGER,
    order_date  DATE,
    total       REAL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Order Items (junction table)
CREATE TABLE order_items (
    order_id   INTEGER,
    product_id INTEGER,
    quantity   INTEGER,
    unit_price REAL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments
CREATE TABLE payments (
    id           INTEGER PRIMARY KEY,
    order_id     INTEGER,
    payment_date DATE,
    amount       REAL,
    method       TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

> [!TIP]
> The schema is **dynamically extracted** at runtime from `sqlite_master`. If you modify the database, the LLM will automatically see the updated schema — no code changes needed.

### Using Your Own Database

1. Replace `database.db` in the backend root with your own SQLite database file.
2. Restart the Spring Boot server.
3. The app will automatically detect your new tables and columns.

---

## 🔌 API Reference

### `POST /api/v1/sql/generate-and-execute`

Converts a natural language question to SQL, executes it, and returns results.

**Request Body:**
```json
{
  "naturalLanguageQuery": "Show all products under $100"
}
```

**Success Response** (`200 OK`):
```json
{
  "generatedSql": "SELECT * FROM products WHERE price < 100;",
  "queryResult": [
    { "id": 1, "name": "Widget", "category": "Tools", "price": 29.99 },
    { "id": 3, "name": "Gadget", "category": "Electronics", "price": 49.99 }
  ],
  "status": "Successfully generated and executed."
}
```

**Error Response** (`200 OK` with error in status):
```json
{
  "generatedSql": "SELECT * FROM products WHERE country = 'USA';",
  "queryResult": null,
  "status": "Error: The query referenced a column that doesn't exist in this table. Try rephrasing your question."
}
```

---

## 🔒 Safety

The backend enforces **read-only access** to your database:

- ✅ `SELECT` queries are allowed
- ❌ `INSERT`, `UPDATE`, `DELETE`, and `DROP` queries are blocked
- All SQL validation happens server-side in `DatabaseExecutionService`

---

## 🐳 Docker Deployment (Backend)

The backend includes a multi-stage Dockerfile for production deployment.

### Build the Image

```bash
cd text-to-sql-javaSpringboot-main
docker build -t text2sql-backend .
```

### Run the Container

```bash
docker run -p 8080:8080 text2sql-backend
```

> [!NOTE]
> The Docker image uses `eclipse-temurin:21` (JDK for build, JRE for runtime) and bundles the SQLite `database.db` file inside the container.

---

## ☁️ Production Deployment

### Backend — Render

1. Push the `text-to-sql-javaSpringboot-main` directory to a GitHub repo.
2. Create a new **Web Service** on [Render](https://render.com).
3. Set the runtime to **Docker**.
4. Add the environment variable `PORT=8080`.
5. Deploy.

### Frontend — Vercel

1. Push the `text2sql-frontend` directory to a GitHub repo.
2. Import the project in [Vercel](https://vercel.com).
3. Set the environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
4. Deploy.

### CORS Configuration

The backend is pre-configured to allow requests from:
- `http://localhost:5173` (local development)
- `https://text2sql-frontend-nu.vercel.app` (production)

To add more origins, set the `cors.allowed-origins` property in `application.properties`:

```properties
cors.allowed-origins=http://localhost:5173,https://your-custom-domain.com
```

---

## 📁 Project Structure

```
text2sql-parent/
│
├── text-to-sql-javaSpringboot-main/     # ☕ Spring Boot Backend
│   ├── src/main/java/.../
│   │   ├── config/
│   │   │   └── CorsConfig.java          # CORS configuration
│   │   ├── controller/
│   │   │   └── TextToSqlController.java  # REST endpoint
│   │   ├── dto/
│   │   │   ├── SqlResponse.java          # Response DTO
│   │   │   └── TextToSqlRequest.java     # Request DTO
│   │   ├── model/
│   │   │   └── Product.java              # JPA entity
│   │   ├── service/
│   │   │   ├── DatabaseExecutionService.java  # SQL execution + error handling
│   │   │   ├── LLMService.java           # Hugging Face LLM integration
│   │   │   └── OpenAIService.java        # Alternative OpenAI-compatible service
│   │   └── TexttosqlchatApplication.java # Main entry point
│   ├── src/main/resources/
│   │   └── application.properties        # App configuration
│   ├── database.db                       # SQLite database file
│   ├── Dockerfile                        # Docker build config
│   ├── pom.xml                           # Maven dependencies
│   └── mvnw / mvnw.cmd                  # Maven wrapper
│
└── text2sql-frontend/                    # ⚛️ React Frontend
    ├── src/
    │   ├── api/
    │   │   └── query.ts                  # API client (Axios)
    │   ├── components/
    │   │   ├── landing/                  # Landing page components
    │   │   │   ├── Hero.tsx
    │   │   │   ├── HowItWorks.tsx
    │   │   │   ├── SchemaPreview.tsx
    │   │   │   └── ExampleChips.tsx
    │   │   ├── query/                    # Query page components
    │   │   │   ├── QueryInput.tsx
    │   │   │   ├── PromptChips.tsx
    │   │   │   ├── ResultsTable.tsx
    │   │   │   ├── SqlPanel.tsx
    │   │   │   ├── SkeletonLoader.tsx
    │   │   │   ├── QueryHistory.tsx
    │   │   │   └── StatResult.tsx
    │   │   └── shared/
    │   │       └── Header.tsx
    │   ├── hooks/
    │   │   └── useQueryState.ts          # Main query state management
    │   ├── pages/
    │   │   ├── LandingPage.tsx
    │   │   └── QueryPage.tsx
    │   ├── App.tsx                       # Router setup
    │   └── main.tsx                      # Entry point
    ├── .env.local                        # Environment variables
    ├── vite.config.ts                    # Vite configuration
    ├── package.json                      # npm dependencies
    └── index.html                        # HTML entry point
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 21** | Language runtime |
| **Spring Boot 3.5.7** | Web framework |
| **Spring WebFlux (WebClient)** | Non-blocking HTTP client for LLM API |
| **JdbcTemplate** | SQL query execution |
| **SQLite** | Lightweight embedded database |
| **Hibernate + SQLite Dialect** | ORM + community dialect support |
| **Lombok** | Boilerplate reduction (`@Data`, `@Builder`) |
| **Maven** | Build & dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite 7** | Build tool and dev server |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Framer Motion** | Animations and transitions |
| **Axios** | HTTP client |
| **React Router 7** | Client-side routing |
| **React Syntax Highlighter** | SQL code highlighting |
| **Lucide React** | Icon library |

### LLM
| Technology | Purpose |
|---|---|
| **DeepSeek-V3** | Text-to-SQL generation model |
| **Hugging Face Inference API** | Model hosting and API gateway |

---

## ❓ Troubleshooting

| Problem | Solution |
|---|---|
| **Backend won't start** | Ensure Java 21+ is installed: `java --version` |
| **Frontend shows "Failed to reach the backend"** | Check that the backend is running on port 8080 and `VITE_API_BASE_URL` is correct |
| **LLM returns empty response** | Verify your Hugging Face API key is valid and has Inference API access |
| **CORS errors in browser console** | Add your frontend URL to `cors.allowed-origins` in `application.properties` |
| **"Only SELECT queries are allowed"** | The app blocks write operations by design for safety |
| **Wrong results or bad SQL** | Try rephrasing your question — the LLM quality depends on prompt clarity |
| **`database.db` not found** | Ensure the file exists in the backend project root directory |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "Add my feature"`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ☕ Spring Boot + ⚛️ React + 🤖 DeepSeek-V3
</p>
]]>
