import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface QueryResult {
  data: Record<string, unknown>[];
  sql: string;
}

export async function runQuery(prompt: string): Promise<QueryResult> {
  const response = await axios.get(`${BASE_URL}/api/query`, {
    params: { prompt },
    timeout: 30000,
  });

  // The backend returns List<Map<String, Object>> as JSON array
  const data = response.data;

  // For demo/offline mode, we simulate responses
  // In production, the backend would ideally also return the generated SQL
  return {
    data: Array.isArray(data) ? data : [],
    sql: '', // Backend currently doesn't return the SQL separately
  };
}

// ─── Demo Mode ─────────────────────────────────────────────────────────
// Since the backend may not be running, we provide a realistic demo mode
// that simulates the full pipeline with realistic data and SQL.

interface DemoEntry {
  prompt: string;
  sql: string;
  data: Record<string, unknown>[];
}

const demoDatabase: DemoEntry[] = [
  {
    prompt: 'Show all customers',
    sql: 'SELECT * FROM customers;',
    data: [
      { id: 1, name: 'Alice Johnson', country: 'USA', signup_date: '2024-01-05' },
      { id: 2, name: 'Bob Smith', country: 'UK', signup_date: '2024-01-12' },
      { id: 3, name: 'Carlos Rivera', country: 'Mexico', signup_date: '2024-02-03' },
      { id: 4, name: 'Diana Chen', country: 'USA', signup_date: '2024-03-20' },
      { id: 5, name: 'Eva Müller', country: 'Germany', signup_date: '2024-04-15' },
      { id: 6, name: 'Farid Hassan', country: 'Egypt', signup_date: '2024-05-01' },
      { id: 7, name: 'George Williams', country: 'USA', signup_date: '2024-06-11' },
      { id: 8, name: 'Haruki Tanaka', country: 'Japan', signup_date: '2024-07-22' },
    ],
  },
  {
    prompt: 'Products under $100',
    sql: 'SELECT * FROM products WHERE price < 100;',
    data: [
      { id: 3, name: 'Wireless Mouse', category: 'Accessories', price: 29.99 },
      { id: 4, name: 'USB-C Hub', category: 'Accessories', price: 49.99 },
      { id: 6, name: 'Keyboard Mechanical', category: 'Accessories', price: 89.99 },
      { id: 9, name: 'Mouse Pad XL', category: 'Accessories', price: 19.99 },
      { id: 11, name: 'Webcam HD', category: 'Electronics', price: 59.99 },
    ],
  },
  {
    prompt: 'Total revenue by payment method',
    sql: `SELECT method, SUM(amount) AS total_revenue, COUNT(*) AS transaction_count
FROM payments
GROUP BY method
ORDER BY total_revenue DESC;`,
    data: [
      { method: 'Credit Card', total_revenue: 4523.47, transaction_count: 12 },
      { method: 'PayPal', total_revenue: 2891.23, transaction_count: 8 },
      { method: 'Bank Transfer', total_revenue: 1756.80, transaction_count: 5 },
      { method: 'Apple Pay', total_revenue: 943.50, transaction_count: 3 },
    ],
  },
  {
    prompt: 'Orders placed in 2024',
    sql: `SELECT o.id, c.name AS customer, o.order_date, o.total
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.order_date DESC;`,
    data: [
      { id: 15, customer: 'Diana Chen', order_date: '2024-11-02', total: 1299.99 },
      { id: 14, customer: 'George Williams', order_date: '2024-10-18', total: 249.98 },
      { id: 13, customer: 'Alice Johnson', order_date: '2024-09-30', total: 89.99 },
      { id: 12, customer: 'Bob Smith', order_date: '2024-08-15', total: 549.99 },
      { id: 11, customer: 'Eva Müller', order_date: '2024-07-22', total: 199.99 },
      { id: 10, customer: 'Carlos Rivera', order_date: '2024-06-05', total: 749.00 },
      { id: 9, customer: 'Haruki Tanaka', order_date: '2024-05-11', total: 329.97 },
      { id: 8, customer: 'Alice Johnson', order_date: '2024-04-03', total: 1599.98 },
      { id: 7, customer: 'Farid Hassan', order_date: '2024-03-20', total: 449.99 },
      { id: 6, customer: 'Diana Chen', order_date: '2024-02-14', total: 89.99 },
      { id: 5, customer: 'Bob Smith', order_date: '2024-01-28', total: 199.99 },
    ],
  },
  {
    prompt: 'Customers who ordered more than twice',
    sql: `SELECT c.name, c.country, COUNT(o.id) AS order_count, SUM(o.total) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.country
HAVING COUNT(o.id) > 2
ORDER BY order_count DESC;`,
    data: [
      { name: 'Alice Johnson', country: 'USA', order_count: 5, total_spent: 3249.97 },
      { name: 'Bob Smith', country: 'UK', order_count: 4, total_spent: 2150.00 },
      { name: 'Diana Chen', country: 'USA', order_count: 3, total_spent: 1899.99 },
    ],
  },
  {
    prompt: 'Most expensive product per category',
    sql: `SELECT p.category, p.name, p.price
FROM products p
WHERE p.price = (
  SELECT MAX(p2.price) FROM products p2 WHERE p2.category = p.category
)
ORDER BY p.price DESC;`,
    data: [
      { category: 'Electronics', name: 'Laptop Pro 16"', price: 2499.99 },
      { category: 'Photography', name: 'Camera DSLR Mark IV', price: 1899.99 },
      { category: 'Audio', name: 'Studio Monitors Pair', price: 799.99 },
      { category: 'Accessories', name: 'Keyboard Mechanical', price: 89.99 },
    ],
  },
];

// Fallback handler for free-form queries
function findBestMatch(prompt: string): DemoEntry | null {
  const lower = prompt.toLowerCase();

  // Direct chip matches
  for (const entry of demoDatabase) {
    if (lower === entry.prompt.toLowerCase()) return entry;
  }

  // Fuzzy keyword matching
  if (lower.includes('customer') && !lower.includes('order')) return demoDatabase[0];
  if (lower.includes('under') || (lower.includes('product') && lower.includes('100'))) return demoDatabase[1];
  if (lower.includes('revenue') || lower.includes('payment method')) return demoDatabase[2];
  if (lower.includes('2024') || lower.includes('this year') || lower.includes('orders placed')) return demoDatabase[3];
  if (lower.includes('more than twice') || lower.includes('frequent') || lower.includes('most orders')) return demoDatabase[4];
  if (lower.includes('expensive') || lower.includes('per category') || lower.includes('most costly')) return demoDatabase[5];
  if (lower.includes('product')) return demoDatabase[1];
  if (lower.includes('order')) return demoDatabase[3];
  if (lower.includes('payment') || lower.includes('pay')) return demoDatabase[2];

  // Count-style queries
  if (lower.includes('how many') || lower.includes('count') || lower.includes('total number')) {
    if (lower.includes('customer')) {
      return {
        prompt,
        sql: 'SELECT COUNT(*) AS total_customers FROM customers;',
        data: [{ total_customers: 8 }],
      };
    }
    if (lower.includes('order')) {
      return {
        prompt,
        sql: 'SELECT COUNT(*) AS total_orders FROM orders;',
        data: [{ total_orders: 23 }],
      };
    }
    if (lower.includes('product')) {
      return {
        prompt,
        sql: 'SELECT COUNT(*) AS total_products FROM products;',
        data: [{ total_products: 14 }],
      };
    }
    return {
      prompt,
      sql: 'SELECT COUNT(*) AS total_orders FROM orders;',
      data: [{ total_orders: 23 }],
    };
  }

  // USA / country filter
  if (lower.includes('usa') || lower.includes('united states')) {
    return {
      prompt,
      sql: "SELECT * FROM customers WHERE country = 'USA';",
      data: [
        { id: 1, name: 'Alice Johnson', country: 'USA', signup_date: '2024-01-05' },
        { id: 4, name: 'Diana Chen', country: 'USA', signup_date: '2024-03-20' },
        { id: 7, name: 'George Williams', country: 'USA', signup_date: '2024-06-11' },
      ],
    };
  }

  // Price > 500
  if (lower.includes('500') || lower.includes('expensive')) {
    return {
      prompt,
      sql: 'SELECT * FROM products WHERE price > 500;',
      data: [
        { id: 1, name: 'Laptop Pro 16"', category: 'Electronics', price: 2499.99 },
        { id: 2, name: 'Camera DSLR Mark IV', category: 'Photography', price: 1899.99 },
        { id: 5, name: 'Smart TV 55"', category: 'Electronics', price: 749.00 },
        { id: 7, name: 'Studio Monitors Pair', category: 'Audio', price: 799.99 },
      ],
    };
  }

  // Top / best
  if (lower.includes('top') || lower.includes('best')) {
    return {
      prompt,
      sql: `SELECT c.name, SUM(o.total) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC
LIMIT 5;`,
      data: [
        { name: 'Alice Johnson', total_spent: 3249.97 },
        { name: 'Bob Smith', total_spent: 2150.00 },
        { name: 'Diana Chen', total_spent: 1899.99 },
        { name: 'Carlos Rivera', total_spent: 1498.00 },
        { name: 'Eva Müller', total_spent: 999.98 },
      ],
    };
  }

  return null;
}

export async function runQueryDemo(prompt: string): Promise<QueryResult> {
  // Simulate network latency (2-4 seconds like a real LLM call)
  const delay = 1500 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const match = findBestMatch(prompt);

  if (match) {
    return { data: match.data, sql: match.sql };
  }

  // Generic fallback — still return a valid response
  return {
    data: demoDatabase[0].data,
    sql: `-- Generated from: "${prompt}"\n` + demoDatabase[0].sql,
  };
}
