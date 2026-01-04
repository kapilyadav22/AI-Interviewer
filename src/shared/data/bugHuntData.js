export const BUG_CATEGORIES = {
  FRONTEND: {
    id: "frontend",
    title: "Frontend & React",
    icon: "Layout",
    description:
      "Bugs in React hooks, state management, CSS layouts, and DOM manipulation.",
  },
  BACKEND: {
    id: "backend",
    title: "Backend & Systems",
    icon: "Server",
    description: "Bugs in Node.js, Python, SQL queries, and API design.",
  },
  LOGIC: {
    id: "logic",
    title: "Core Logic & JS",
    icon: "Brain",
    description:
      "Tricky Javascript fundamentals, algorithm edge cases, and type coercion.",
  },
  SECURITY: {
    id: "security",
    title: "Security & Auth",
    icon: "Shield",
    description: "OWASP top 10, auth pitfalls, and data validation bugs.",
  },
};

export const BUG_DATA = {
  frontend: [
    {
      title: "The Silent Loop",
      language: "javascript",
      code: [
        "for (var i = 0; i < 5; i++) {",
        "  setTimeout(() => {",
        "    console.log(i);",
        "  }, 100);",
        "}",
      ],
      explanation:
        "Using 'var' in a loop with async operations causes closure issues because 'var' is function-scoped. Using 'let' fixes this as it is block-scoped.",
      correctLine: 0,
    },
    {
      title: "The Infinite Fetch",
      language: "javascript",
      code: [
        "useEffect(() => {",
        "  fetchData().then(data => setData(data));",
        "});",
      ],
      explanation:
        "The useEffect hook is missing a dependency array, causing it to run on every render and trigger an infinite loop.",
      correctLine: 2,
    },
    {
      title: "The Mutability Mistake",
      language: "javascript",
      code: [
        "const [items, setItems] = useState([1, 2, 3]);",
        "const deleteItem = (idx) => {",
        "  items.splice(idx, 1);",
        "  setItems(items);",
        "};",
      ],
      explanation:
        "React's state should be treated as immutable. `splice` modifies the original array in-place, so React doesn't detect the change.",
      correctLine: 2,
    },
    {
      title: "The Shared Hook State",
      language: "javascript",
      code: [
        "function useCounter() {",
        "  let count = 0;",
        "  return {",
        "    count, ",
        "    inc: () => count++",
        "  };",
        "}",
      ],
      explanation:
        "This custom hook returns a static value 'count' and a function that increments a local variable that wasn't declared as state. It won't trigger re-renders or persist correctly.",
      correctLine: 1,
    },
    {
      title: "Key-less Mapping",
      language: "javascript",
      code: [
        "const List = ({ items }) => (",
        "  <ul>",
        "    {items.map(item => (",
        "      <li>{item.text}</li>",
        "    ))}",
        "  </ul>",
        ");",
      ],
      explanation:
        "React needs 'key' props in lists to efficiently track changes. Missing keys lead to performance issues and UI bugs during re-ordering.",
      correctLine: 3,
    },
    {
      title: "The Closure Trap",
      language: "javascript",
      code: [
        "const Counter = () => {",
        "  const [count, setCount] = useState(0);",
        "  const handleAlert = () => {",
        "    setTimeout(() => alert(count), 3000);",
        "  };",
        "  return <button onClick={handleAlert}>Alert</button>",
        "}",
      ],
      explanation:
        "The alert will show the value of 'count' at the time the button was clicked, not the current value, due to closures in the setTimeout.",
      correctLine: 3,
    },
    {
      title: "The Ghostly State",
      language: "javascript",
      code: [
        "const [user, setUser] = useState({ name: 'Bob' });",
        "useEffect(() => {",
        "  user.name = 'Alice';",
        "  setUser(user);",
        "}, []);",
      ],
      explanation:
        "Directly mutating state objects breaks React's change detection. Use `setUser({ ...user, name: 'Alice' })` instead.",
      correctLine: 2,
    },
    {
      title: "The Prop Drilling Trap",
      language: "javascript",
      code: [
        "const App = () => {",
        "  const [theme, setTheme] = useState('dark');",
        "  return <Header theme={theme} />;",
        "}",
      ],
      explanation:
        "While not a syntax bug, prop drilling deep hierarchies is an anti-pattern. Use Context API or a state manager for global concerns like theme.",
      correctLine: 2,
    },
    {
      title: "The Unstable Key",
      language: "javascript",
      code: [
        "{items.map((item, idx) => (",
        "  <Card key={Math.random()} item={item} />",
        "))}",
      ],
      explanation:
        "Using random values as keys causes the entire component tree to unmount and remount on every render, killing performance and losing local state.",
      correctLine: 1,
    },
    {
      title: "The Missing Dependency",
      language: "javascript",
      code: [
        "const [active, setActive] = useState(false);",
        "const toggle = useCallback(() => {",
        "  setActive(!active);",
        "}, []);",
      ],
      explanation:
        "The `toggle` function has a stale closure because `active` is missing from the dependency array. It will only ever 'toggle' based on the initial value (false).",
      correctLine: 3,
    },
    {
      title: "The Over-Rendering List",
      language: "javascript",
      code: [
        "const List = ({ items }) => {",
        "  const renderItem = (item) => <div key={item.id}>{item.text}</div>;",
        "  return <div>{items.map(renderItem)}</div>;",
        "}",
      ],
      explanation:
        "Defining functions inside the render phase (or component body) causes them to be recreated on every render. Use `useCallback` or move them outside the component.",
      correctLine: 1,
    },
    {
      title: "Implicit Global in Hook",
      language: "javascript",
      code: [
        "useEffect(() => {",
        "  interval = setInterval(() => {",
        "    tick();",
        "  }, 1000);",
        "  return () => clearInterval(interval);",
        "}, []);",
      ],
      explanation:
        "'interval' is not declared with const/let/var, making it an implicit global. This can cause leaks and collisions with other components.",
      correctLine: 1,
    },
    {
      title: "The Expensive Memo",
      language: "javascript",
      code: [
        "const sorted = useMemo(() => {",
        "  return items.sort((a, b) => a.val - b.val);",
        "}, [items]);",
      ],
      explanation:
        "The `useMemo` dependency is 'items', but the function mutates the dependency in-place using `.sort()`. This can lead to unpredictable behavior and unnecessary re-renders.",
      correctLine: 1,
    },
    {
      title: "Broken Cleanup",
      language: "javascript",
      code: [
        "useEffect(() => {",
        "  const sub = api.subscribe();",
        "  return sub.unsubscribe();",
        "}, []);",
      ],
      explanation:
        "The cleanup function must be a function itself. Here, you are calling `unsubscribe()` immediately and returning its result (likely undefined) instead of returning the function.",
      correctLine: 2,
    },
    {
      title: "Synthetic Event Pool",
      language: "javascript",
      code: [
        "const handleClick = (e) => {",
        "  setTimeout(() => {",
        "    console.log(e.target.value);",
        "  }, 1000);",
        "};",
      ],
      explanation:
        "In older React versions (pre-17), events were pooled. accessing `e.target` inside an async function like `setTimeout` results in null because the event object is nullified.",
      correctLine: 2,
    },
  ],
  backend: [
    {
      title: "The Dangerous Delete",
      language: "sql",
      code: ["DELETE FROM users", "WHERE id = 101", "OR 1=1;"],
      explanation:
        "The 'OR 1=1' condition is always true, which makes the WHERE clause match every single row, deleting all users.",
      correctLine: 2,
    },
    {
      title: "The Pythonic Trap",
      language: "python",
      code: [
        "def add_item(item, list=[]):",
        "    list.append(item)",
        "    return list",
      ],
      explanation:
        "In Python, default arguments are evaluated only once. Using a mutable object like a list shares it across all function calls.",
      correctLine: 0,
    },
    {
      title: "The Async Loop",
      language: "javascript",
      code: [
        "async function process(items) {",
        "  items.forEach(async (item) => {",
        "    await save(item);",
        "  });",
        "}",
      ],
      explanation:
        "`forEach` is not promise-aware. It launches all promises simultaneously without waiting. Use `for...of` for sequential processing.",
      correctLine: 1,
    },
    {
      title: "The Uncaught Exception",
      language: "javascript",
      code: [
        "app.get('/user', (req, res) => {",
        "  const user = await db.find(req.query.id);",
        "  res.send(user);",
        "});",
      ],
      explanation:
        "This async route handler is missing a try-catch block and the function isn't marked as async even though it uses await.",
      correctLine: 0,
    },
    {
      title: "The SQL Injection",
      language: "sql",
      code: [
        "const query = `",
        "  SELECT * FROM users ",
        "  WHERE username = '${req.body.user}'",
        "`;",
      ],
      explanation:
        "Directly embedding user input into an SQL string creates a massive SQL injection vulnerability. Always use parameterized queries.",
      correctLine: 2,
    },
    {
      title: "The Race Condition",
      language: "javascript",
      code: [
        "app.post('/balance', async (req, res) => {",
        "  const balance = await getBalance(req.user.id);",
        "  await setBalance(req.user.id, balance + req.body.amount);",
        "  res.send('Success');",
        "});",
      ],
      explanation:
        "Reading and then writing based on that read is a classic race condition. Use atomic database operations (e.g., UPDATE ... SET balance = balance + ?) or transactions.",
      correctLine: 1,
    },
    {
      title: "The Memory Leak",
      language: "javascript",
      code: [
        "const cache = {};",
        "app.get('/data', (req, res) => {",
        "  cache[req.query.id] = largeDataFetch();",
        "  res.send(cache[req.query.id]);",
        "});",
      ],
      explanation:
        "Unbounded caches in memory will eventually cause a Node.js process to crash due to OOM (Out Of Memory). Use an LRU cache or Redis with TTL.",
      correctLine: 2,
    },
    {
      title: "Missing Next Call",
      language: "javascript",
      code: [
        "app.use((req, res, next) => {",
        "  console.log('Logging request...');",
        "  // Doing some logic",
        "});",
      ],
      explanation:
        "Express middleware must call `next()` to pass control to the next handler. Without it, the request will hang forever.",
      correctLine: 3,
    },
    {
      title: "The Synchronous Block",
      language: "javascript",
      code: [
        "app.get('/heavy', (req, res) => {",
        "  const result = fs.readFileSync('gigantic_file.json');",
        "  res.send(result);",
        "});",
      ],
      explanation:
        "Using synchronous FS methods blocks the entire Node.js event loop, preventing the server from handling any other requests until the file is read.",
      correctLine: 1,
    },
    {
      title: "The Unhandled Promise",
      language: "javascript",
      code: [
        "app.get('/save', (req, res) => {",
        "  db.save(req.body);",
        "  res.send('Saved');",
        "});",
      ],
      explanation:
        "The database save operation is likely asynchronous. Not awaiting it or handling potential errors can lead to silent failures or 'unhandledPromiseRejection' warnings.",
      correctLine: 1,
    },
    {
      title: "Invalid Status Code",
      language: "javascript",
      code: [
        "app.post('/user', (req, res) => {",
        "  if (!req.body.name) {",
        "    res.status(false).send('Missing name');",
        "  }",
        "});",
      ],
      explanation:
        "HTTP status codes must be integers (e.g., 400). Passing a boolean to `.status()` is invalid and will likely crash the response handler.",
      correctLine: 2,
    },
    {
      title: "Double Response Header",
      language: "javascript",
      code: [
        "app.get('/user', (req, res) => {",
        "  if (!req.user) res.redirect('/login');",
        "  res.json(req.user);",
        "});",
      ],
      explanation:
        "Missing a `return` after `res.redirect`. The code will continue and attempt to call `res.json`, leading to 'Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client'.",
      correctLine: 1,
    },
    {
      title: "Hardcoded Port",
      language: "javascript",
      code: [
        "const PORT = 3000;",
        "app.listen(PORT, () => {",
        "  console.log(`Server running on ${PORT}`);",
        "});",
      ],
      explanation:
        "Hardcoding the port prevents the app from being easily deployed to environments that provide a port dynamically (e.g., Heroku, AWS). Always use `process.env.PORT || 3000`.",
      correctLine: 0,
    },
  ],
  logic: [
    {
      title: "The Floating Calculation",
      language: "javascript",
      code: [
        "let price = 0.1;",
        "let tax = 0.2;",
        "let total = price + tax;",
        "if (total === 0.3) {",
        "  processOrder();",
        "}",
      ],
      explanation:
        "Floating-point precision issues: 0.1 + 0.2 actually equals 0.30000000000000004.",
      correctLine: 3,
    },
    {
      title: "The Lost This",
      language: "javascript",
      code: [
        "const obj = {",
        "  count: 0,",
        "  inc: () => { this.count++; }",
        "};",
        "obj.inc();",
      ],
      explanation:
        "Arrow functions inherit 'this' from the outer scope, not the object they are in. 'this.count' will be undefined.",
      correctLine: 2,
    },
    {
      title: "The Global Leak",
      language: "javascript",
      code: [
        "function calculate(x) {",
        "  result = x * 2;",
        "  return result;",
        "}",
      ],
      explanation:
        "Assigning to an undeclared variable creates a global variable in non-strict mode.",
      correctLine: 1,
    },
    {
      title: "The Object Comparison",
      language: "javascript",
      code: [
        "const c1 = { r: true };",
        "const c2 = { r: true };",
        "if (c1 == c2) {",
        "  init();",
        "}",
      ],
      explanation:
        "Objects are compared by reference, not by structure or value. c1 == c2 will always be false.",
      correctLine: 2,
    },
    {
      title: "The Coercion Chaos",
      language: "javascript",
      code: [
        "const x = '5';",
        "const y = 3;",
        "const z = x - y + '10';",
        "console.log(z);",
      ],
      explanation:
        "'5' - 3 results in the number 2, then 2 + '10' results in the string '210'. Javascript's implicit coercion can be extremely counter-intuitive.",
      correctLine: 2,
    },
    {
      title: "The Recursion Limit",
      language: "javascript",
      code: [
        "function factorial(n) {",
        "  if (n === 0) return 1;",
        "  return n * factorial(n);",
        "}",
      ],
      explanation:
        "This function lacks a decrementing step for 'n', leading to a Stack Overflow error as it recursively calls itself with the same value forever.",
      correctLine: 2,
    },
    {
      title: "The Sort Surprise",
      language: "javascript",
      code: [
        "const nums = [1, 10, 2, 21];",
        "nums.sort();",
        "console.log(nums);",
      ],
      explanation:
        "Default `sort()` in JS converts elements to strings. [1, 10, 2, 21] becomes [1, 10, 2, 21] (string order). Correct use: `sort((a, b) => a - b)`.",
      correctLine: 1,
    },
    {
      title: "Cyclic Serialization",
      language: "javascript",
      code: [
        "const a = {};",
        "const b = { a };",
        "a.b = b;",
        "JSON.stringify(a);",
      ],
      explanation:
        "JSON.stringify cannot handle circular references and will throw a TypeError: Converting circular structure to JSON.",
      correctLine: 3,
    },
    {
      title: "The Zero Truthiness",
      language: "javascript",
      code: [
        "const count = 0;",
        "if (count) {",
        "  console.log('We have items');",
        "}",
      ],
      explanation:
        "In Javascript, 0 is falsy. If you want to check if a numeric variable is defined or non-null, use `count !== undefined` or `count > 0`.",
      correctLine: 1,
    },
    {
      title: "Array.prototype Mutation",
      language: "javascript",
      code: [
        "const arr = [1, 2, 3];",
        "const reversed = arr.reverse();",
        "console.log(arr);",
      ],
      explanation:
        "`.reverse()` mutates the original array in-place. If you want a reversed copy, use `[...arr].reverse()`.",
      correctLine: 1,
    },
    {
      title: "The Delete Hole",
      language: "javascript",
      code: [
        "const arr = [1, 2, 3];",
        "delete arr[1];",
        "console.log(arr.length);",
      ],
      explanation:
        "`delete` on an array index removes the value but leaves a 'hole' (empty slot), meaning the length remains 3. Use `.splice()` to actually remove elements.",
      correctLine: 1,
    },
    {
      title: "Shallow Freeze",
      language: "javascript",
      code: [
        "const user = Object.freeze({",
        "  profile: { age: 25 }",
        "});",
        "user.profile.age = 30;",
      ],
      explanation:
        "`Object.freeze` is shallow. Nested objects can still be mutated. You need a recursive deep freeze function for total immutability.",
      correctLine: 3,
    },
  ],
  security: [
    {
      title: "Hardcoded Secrets",
      language: "javascript",
      code: [
        "const API_KEY = 'sk-1234567890abcdef';",
        "const client = new Client(API_KEY);",
        "client.connect();",
      ],
      explanation:
        "Hardcoding API keys in source code is a major security risk. Use environment variables.",
      correctLine: 0,
    },
    {
      title: "Weak Password Hashing",
      language: "javascript",
      code: [
        "const crypto = require('crypto');",
        "function hash(pw) {",
        "  return crypto.createHash('md5').update(pw).digest('hex');",
        "}",
      ],
      explanation:
        "MD5 is cryptographically broken and should never be used for hashing passwords. Use bcrypt or Argon2.",
      correctLine: 2,
    },
    {
      title: "The XSS Hole",
      language: "javascript",
      code: [
        "const Comment = ({ text }) => (",
        "  <div dangerouslySetInnerHTML={{ __html: text }} />",
        ");",
      ],
      explanation:
        "Directly rendering HTML from user input without sanitization opens the door to Cross-Site Scripting (XSS) attacks.",
      correctLine: 1,
    },
    {
      title: "Insecure JWT",
      language: "javascript",
      code: [
        "const token = jwt.sign(",
        "  { userId: 123 }, ",
        "  'secret', ",
        "  { algorithm: 'none' }",
        ");",
      ],
      explanation:
        "Setting the JWT algorithm to 'none' allows attackers to bypass signature verification entirely. Never use 'none' in production.",
      correctLine: 3,
    },
    {
      title: "Path Traversal",
      language: "javascript",
      code: [
        "app.get('/files', (req, res) => {",
        "  const path = './public/' + req.query.name;",
        "  res.sendFile(path);",
        "});",
      ],
      explanation:
        "Attackers can use '../' in the query parameter to access sensitive files outside the intended directory (e.g., /etc/passwd).",
      correctLine: 1,
    },
    {
      title: "The Regex DoS",
      language: "javascript",
      code: [
        "const emailRegex = /^([a-zA-Z0-9])(([\\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}[a-z]{2,3}$/;",
        "app.post('/validate', (req, res) => {",
        "  emailRegex.test(req.body.email);",
        "});",
      ],
      explanation:
        "Poorly constructed regex with nested quantifiers can lead to ReDoS (Regular Expression Denial of Service) through catastrophic backtracking.",
      correctLine: 0,
    },
    {
      title: "Sensitive Info Leak",
      language: "javascript",
      code: [
        "app.get('/debug', (req, res) => {",
        "  res.json(process.env);",
        "});",
      ],
      explanation:
        "Exposing the entire environment object can leak sensitive information like DB credentials, API keys, and internal service URLs.",
      correctLine: 1,
    },
    {
      title: "The Insecure Redirect",
      language: "javascript",
      code: [
        "app.get('/logout', (req, res) => {",
        "  const url = req.query.returnTo || '/';",
        "  res.redirect(url);",
        "});",
      ],
      explanation:
        "Allowing arbitrary redirect URLs from query parameters can be used in phishing attacks (Open Redirect vulnerability). Always validate redirect URLs against a whitelist.",
      correctLine: 1,
    },
    {
      title: "Weak Password Hashing",
      language: "javascript",
      code: [
        "const crypto = require('crypto');",
        "const hash = crypto.createHash('md5')",
        "  .update(password).digest('hex');",
      ],
      explanation:
        "MD5 is cryptographically broken and extremely fast to crack. Use modern algorithms like Argon2 or bcrypt for password hashing.",
      correctLine: 1,
    },
    {
      title: "The Evil Eval",
      language: "javascript",
      code: [
        "const code = req.query.callback;",
        "eval(`${code}()`);",
      ],
      explanation:
        "`eval()` executes any string as code. Passing user input directly into `eval` is one of the most severe security vulnerabilities possible (Remote Code Execution).",
      correctLine: 1,
    },
    {
      title: "Insecure Cookie",
      language: "javascript",
      code: [
        "res.cookie('sessionID', id, {",
        "  httpOnly: false,",
        "  secure: false",
        "});",
      ],
      explanation:
        "Setting `httpOnly: false` allows client-side scripts to read the cookie (XSS risk), and `secure: false` allows it to be sent over unencrypted HTTP (MITM risk).",
      correctLine: 1,
    },
  ],
};
