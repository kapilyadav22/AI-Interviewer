export const frontendCards = [
  // --- React Core (1-30) ---
  {
    q: "What is the Virtual DOM?",
    a: "A lightweight copy of the actual DOM. React uses it to verify what changes need to be made to the actual DOM, minimizing expensive operations through a process called Reconciliation.",
  },
  {
    q: "What is the process of Reconciliation?",
    a: "The algorithm React uses to diff one tree with another to determine which parts need to be changed in the real DOM.",
  },
  {
    q: "What are React Hooks?",
    a: "Functions that let you 'hook into' React state and lifecycle features from functional components.",
  },
  {
    q: "What is the rules of Hooks?",
    a: "1. Only call Hooks at the top level. 2. Only call Hooks from React function components or custom Hooks.",
  },
  {
    q: "Explain useEffect Hook.",
    a: "It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.",
  },
  {
    q: "What is Purpose of useMemo?",
    a: "To memoize expensive calculations so they are only re-computed when one of the dependencies has changed.",
  },
  {
    q: "What is useCallback used for?",
    a: "To return a memoized version of a callback function that only changes if one of the dependencies has changed.",
  },
  {
    q: "What is useRef?",
    a: "Returns a mutable ref object whose .current property is initialized to the passed argument. Persists for the full lifetime of the component.",
  },
  {
    q: "Context API vs Redux?",
    a: "Context is for prop drilling. Redux is for centralized, complex state with time-travel debugging.",
  },
  {
    q: "What is React Fiber?",
    a: "The new reconciliation engine in React 16 focusing on incremental rendering.",
  },
  {
    q: "What are Portals?",
    a: "Rendering children into a DOM node that exists outside the DOM hierarchy of the parent component.",
  },
  {
    q: "What is React Server Components (RSC)?",
    a: "Components that run only on the server, reducing client-side JS and enabling direct server resource access.",
  },
  {
    q: "Definition of 'Hydration'.",
    a: "Attaching React event listeners to server-rendered HTML to make it interactive.",
  },
  {
    q: "What is a 'Pure Component'?",
    a: "A component that only re-renders if its props or state change (using shallow comparison).",
  },
  {
    q: "What is 'Batching' in React 18?",
    a: "React groups multiple state updates into a single re-render for better performance.",
  },
  {
    q: "Explain 'React Server Actions'.",
    a: "An alpha feature that allows you to perform server-side mutations without needing an API route (forms, buttons).",
  },
  {
    q: "What is the 'useInsertionEffect' Hook?",
    a: "Intended for CSS-in-JS libraries to inject styles before other effects run.",
  },
  {
    q: "What is 'Concurrent Mode'?",
    a: "A set of new features that help React apps stay responsive and gracefully adjust to the user’s device capabilities and network speed.",
  },
  {
    q: "What is useDeferredValue?",
    a: "Allows you to defer updating a part of the UI that is not urgent.",
  },
  {
    q: "What is useTransition?",
    a: "Allows you to mark state updates as non-urgent transitions.",
  },
  {
    q: "What is prop drilling?",
    a: "Passing data through multiple layers of components that don't need it.",
  },
  {
    q: "What is a 'Ref' forward?",
    a: "A technique for automatically passing a ref through a component to one of its children.",
  },
  {
    q: "What is 'Strict Mode'?",
    a: "A tool for highlighting potential problems in an application (double rendering in dev).",
  },
  {
    q: "What are 'Synthetic Events'?",
    a: "Cross-browser wrappers around native browser events.",
  },
  {
    q: "What is 'memoization'?",
    a: "Optimization technique by caching results based on props (React.memo).",
  },
  {
    q: "What is 'Lazy Loading'?",
    a: "Deferring loading of components until they are needed (React.lazy).",
  },
  {
    q: "What is the 'Capture' phase?",
    a: "The phase of event propagation from the root to the target.",
  },
  {
    q: "What is the 'Bubbling' phase?",
    a: "The phase of event propagation from the target to the root.",
  },
  {
    q: "Difference between shallow and deep copy?",
    a: "Shallow copies only top level; Deep copies nested values.",
  },
  { q: "What is JSX?", a: "A syntax extension for JS that looks like HTML." },

  // --- Next.js (31-60) ---
  {
    q: "What is Next.js ISR?",
    a: "Incremental Static Regeneration. Updating static pages after build.",
  },
  {
    q: "What is SSG?",
    a: "Static Site Generation. Generating pages at build time.",
  },
  {
    q: "What is SSR?",
    a: "Server-Side Rendering. Generating pages on every request.",
  },
  {
    q: "What is CSR?",
    a: "Client-Side Rendering. Rendering pages in the browser.",
  },
  {
    q: "Next.js getStaticProps vs getServerSideProps?",
    a: "Build-time data vs Request-time data.",
  },
  {
    q: "What is 'Middleware'?",
    a: "Code that runs before a request completes.",
  },
  {
    q: "What is 'Image' optimization?",
    a: "Next.js component for lazy loading and resizing images.",
  },
  {
    q: "What is 'Routing' in Next.js?",
    a: "File-based routing system (Pages or App router).",
  },
  {
    q: "What is 'Layout' in Next.js?",
    a: "Reusable UI component that wraps multiple pages.",
  },
  {
    q: "What is 'Link' component?",
    a: "Component for client-side navigation with prefetching.",
  },
  {
    q: "What is 'API routes'?",
    a: "Building serverless functions inside Next.js.",
  },
  {
    q: "What is 'Dynamic Routing'?",
    a: "Creating routes with parameters (e.g., [id].js).",
  },
  {
    q: "What is 'Fast Refresh'?",
    a: "Instantly seeing changes in the browser without losing state.",
  },
  {
    q: "What is 'Pre-rendering'?",
    a: "Next.js generating HTML for each page in advance.",
  },
  {
    q: "What is 'Shallow Routing'?",
    a: "Changing URL without re-running data fetching.",
  },
  {
    q: "What is 'Script' component?",
    a: "Optimizing the loading of third-party scripts.",
  },
  {
    q: "What is 'Font' optimization?",
    a: "Self-hosting fonts for performance.",
  },
  { q: "What is 'Environment Variables'?", a: ".env files for configuration." },
  {
    q: "What is 'Custom Document'?",
    a: "Customizing the <html> and <body> tags.",
  },
  {
    q: "What is 'Custom App'?",
    a: "Overriding the default App component for global state/styles.",
  },
  {
    q: "What is 'Internationalized Routing'?",
    a: "Built-in support for multiple locales.",
  },
  {
    q: "What is 'Incremental Static Regeneration'?",
    a: "Updating static content without a full rebuild.",
  },
  {
    q: "What is 'Static Image' imports?",
    a: "Importing images directly into JS for automatic optimization.",
  },
  {
    q: "What is 'Next.js Analytics'?",
    a: "Measuring core web vitals and performance.",
  },
  { q: "What is 'Vercel'?", a: "The platform behind Next.js for deployment." },
  { q: "What is 'TurboPack'?", a: "New high-performance bundler for Next.js." },
  { q: "What is 'App Router'?", a: "Next.js 13+ routing system based on RSC." },
  {
    q: "What is 'Nested Layouts'?",
    a: "Defining layouts for specific sub-sections of an app.",
  },
  {
    q: "What is 'Loading state' in App Router?",
    a: "Showing an automatic loading UI for routes.",
  },
  {
    q: "What is 'Error boundaries' in App Router?",
    a: "Handling unexpected errors gracefully per section.",
  },

  // --- CSS & UI (61-100) ---
  {
    q: "What is Flexbox?",
    a: "One-dimensional layout model for aligning items.",
  },
  {
    q: "What is CSS Grid?",
    a: "Two-dimensional layout model for columns and rows.",
  },
  { q: "Difference between Flexbox and Grid?", a: "1D (Flex) vs 2D (Grid)." },
  {
    q: "What is 'Box Sizing'?",
    a: "Controlling how width/height include padding/border.",
  },
  {
    q: "What is 'Specificity'?",
    a: "Rules that determine which CSS selector wins.",
  },
  {
    q: "What is 'Inheritance' in CSS?",
    a: "Properties passed from parent to children.",
  },
  { q: "What is 'Cascading'?", a: "The order of styles being applied." },
  {
    q: "What is 'Responsive Design'?",
    a: "Design that adapts to screen sizes.",
  },
  {
    q: "What is 'Media Queries'?",
    a: "Conditional CSS based on viewport features.",
  },
  { q: "What is 'Mobile First'?", a: "Designing for mobile before desktop." },
  {
    q: "What is 'Z-index'?",
    a: "Controlling stack order of overlapping elements.",
  },
  {
    q: "What is 'Positioning'?",
    a: "Static, Relative, Absolute, Fixed, Sticky.",
  },
  {
    q: "What is 'Display' property?",
    a: "Block, Inline, Inline-block, None, Flex, Grid.",
  },
  { q: "What is 'Float'?", a: "Moving elements to the left or right." },
  {
    q: "What is 'Flex-grow'?",
    a: "A factor that determines how much an item grows relative to others.",
  },
  {
    q: "What is 'Flex-shrink'?",
    a: "A factor that determines how much an item shrinks relative to others.",
  },
  { q: "What is 'Flex-basis'?", a: "The initial size of a flex item." },
  { q: "What is 'Justify-content'?", a: "Aligning items along the main axis." },
  { q: "What is 'Align-items'?", a: "Aligning items along the cross axis." },
  {
    q: "What is 'CSS Variables'?",
    a: "Custom properties (e.g., --main-color).",
  },
  {
    q: "What is 'SCSS/SASS'?",
    a: "CSS pre-processors with features like variables and nesting.",
  },
  {
    q: "What is 'PostCSS'?",
    a: "Tool for transforming CSS with JS plugins (e.g., Autoprefixer).",
  },
  {
    q: "What is 'CSS Modules'?",
    a: "Scoping CSS locally to components automatically.",
  },
  { q: "What is 'Tailwind CSS'?", a: "Utility-first CSS framework." },
  { q: "What is 'BEM'?", a: "Block Element Modifier naming convention." },
  {
    q: "What is 'Pseudo-classes'?",
    a: "Selecting elements based on state (e.g., :hover).",
  },
  {
    q: "What is 'Pseudo-elements'?",
    a: "Selecting parts of elements (e.g., ::before).",
  },
  { q: "What is 'Transitions'?", a: "Animating property changes over time." },
  {
    q: "What is 'Animations'?",
    a: "More complex, keyframe-based CSS movements.",
  },
  { q: "What is 'Object-fit'?", a: "Fitting an image into its container." },
  { q: "What is 'Aspect-ratio'?", a: "Constraint on width and height ratio." },
  {
    q: "What is 'Pointer-events'?",
    a: "Controlling how an element responds to mouse/touch.",
  },
  {
    q: "What is 'User-select'?",
    a: "Controlling whether text can be selected.",
  },
  { q: "What is 'Box-shadow'?", a: "Adding drop shadows to elements." },
  { q: "What is 'Text-shadow'?", a: "Adding shadows to text." },
  { q: "What is 'Gradient'?", a: "Smooth transitions between colors." },
  { q: "What is 'Opacity'?", a: "Controlling transparency." },
  { q: "What is 'Visibility'?", a: "Hidden but still occupying space." },
  { q: "What is 'Border-radius'?", a: "Rounding corners." },
  { q: "What is 'Calc()' function?", a: "Performing calculations in CSS." },
  {
    q: "What is 'Partial Hydration'?",
    a: "Only hydrating the interactive parts of a page while keeping the rest as static HTML to improve performance.",
  },
  {
    q: "What is 'Island Architecture'?",
    a: "A model where interactive components (islands) are embedded in static HTML to reduce JS payload.",
  },
  {
    q: "Explain 'Cumulative Layout Shift' (CLS).",
    a: "Measures visual stability; how much content moves around during load.",
  },
  {
    q: "What is 'First Input Delay' (FID)?",
    a: "Measures the time from when a user first interacts with your site to the time when the browser is able to respond to that interaction.",
  },
  {
    q: "What is 'Interaction to Next Paint' (INP)?",
    a: "A Core Web Vital that observes the latency of all interactions a user has made with the page.",
  },
  {
    q: "What is 'Time to First Byte' (TTFB)?",
    a: "The time it takes for a browser to receive the first byte of page content from the server.",
  },
  {
    q: "What is 'Paint Holding'?",
    a: "A browser optimization that delays clearing the existing page content until the next page is ready to be painted, preventing flashes of white.",
  },
  {
    q: "What is 'Back/Forward Cache' (bfcache)?",
    a: "A browser optimization that enables instant back and forward navigation.",
  },
  {
    q: "Explain 'Pre-rendering' vs 'SSR'.",
    a: "Pre-rendering is done at build time; SSR is done per request.",
  },
  {
    q: "How does React handle 'Batching'?",
    a: "Groups multiple state updates into a single re-render for efficiency.",
  },
  {
    q: "What is 'React.lazy' with 'Suspense'?",
    a: "Allows for code splitting by loading components only when they are needed.",
  },
  {
    q: "What is 'useId' Hook?",
    a: "Generates unique IDs for accessibility attributes, matching between server and client.",
  },
  {
    q: "What is 'useSyncExternalStore'?",
    a: "A hook for subscribing to an external store in a way that is compatible with concurrent rendering.",
  },
  {
    q: "What is 'useInsertionEffect' used for?",
    a: "Injecting styles before other effects run, specifically for CSS-in-JS.",
  },
  {
    q: "Difference between 'useCallback' and 'useMemo'?",
    a: "useCallback memoizes a function; useMemo memoizes the result of a function.",
  },
  {
    q: "What is a 'Portal'?",
    a: "Rendering a child into a different part of the DOM tree (e.g., modals).",
  },
  {
    q: "What is 'Prop Types'?",
    a: "A library for runtime type checking of React props.",
  },
  {
    q: "What is 'Error Boundary' limit?",
    a: "They only catch errors in the components below them in the tree, not in themselves or event handlers.",
  },
  {
    q: "What is 'Forward Ref'?",
    a: "Passing a ref through a component to a DOM element or child component.",
  },
  {
    q: "What is 'Context API'?",
    a: "A way to share values between components without explicit prop drilling.",
  },
  {
    q: "What is 'Redux Toolkit'?",
    a: "The official, opinionated, batteries-included toolset for efficient Redux development.",
  },
  {
    q: "What is 'Zustand'?",
    a: "A small, fast, and scalable bear-bones state-management solution.",
  },
  {
    q: "What is 'Jotai'?",
    a: "Primitive and flexible state management for React based on an atomic model.",
  },
  {
    q: "Explain 'React Query' (TanStack Query).",
    a: "A library for fetching, caching, and synchronizing asynchronous state in React.",
  },
  {
    q: "What is 'SWR'?",
    a: "Stale-While-Revalidate data fetching library from Vercel.",
  },
  {
    q: "What is 'Axios' vs 'Fetch'?",
    a: "Axios has built-in features like interceptors and better error handling; Fetch is native to most browsers.",
  },
  {
    q: "What is 'Framer Motion'?",
    a: "A production-ready motion library for React.",
  },
  {
    q: "What is 'Radix UI'?",
    a: "An open-source UI component library for building high-quality, accessible design systems and web apps.",
  },
  {
    q: "What is 'Headless UI'?",
    a: "Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.",
  },
  {
    q: "What is 'Radix UI' Primitives?",
    a: "Low-level UI component primitives that focus on accessibility and customizability.",
  },
  {
    q: "Difference between 'PX' and 'REM'?",
    a: "PX is fixed; REM is relative to the root font size.",
  },
  {
    q: "What is 'CSS Grid' vs 'Flexbox'?",
    a: "Grid is 2D (rows/cols); Flexbox is 1D (rows OR cols).",
  },
  {
    q: "What is 'CSS Container Queries'?",
    a: "Styling elements based on their parent container's size.",
  },
  {
    q: "What is 'CSS Variables' (Custom Properties)?",
    a: "Variables declared in CSS, scoped to the selector they are in.",
  },
  {
    q: "What is 'BEM'?",
    a: "Block-Element-Modifier naming convention for CSS.",
  },
  {
    q: "What is 'Shadow DOM'?",
    a: "A way to encapsulate styles and markup in Web Components.",
  },
  {
    q: "What is 'Web Components'?",
    a: "A set of browser APIs allowing you to create new custom, reusable, encapsulated HTML tags.",
  },
  { q: "What is 'Shadow Root'?", a: "The root node of a shadow tree." },
  {
    q: "What is 'Slot' in Web Components?",
    a: "A placeholder inside a web component that you can fill with your own markup.",
  },
  {
    q: "What is 'Lit'?",
    a: "A simple library for building fast, lightweight web components.",
  },
  {
    q: "Explain 'Web Workers'.",
    a: "Running scripts in background threads separate from the main execution thread.",
  },
  {
    q: "What is 'Service Worker'?",
    a: "A type of web worker that acts as a proxy between the app and the network (offline support).",
  },
  {
    q: "What is 'PWA'?",
    a: "Progressive Web App - web apps that use modern APIs to provide app-like experiences.",
  },
  {
    q: "What is 'Manifest.json'?",
    a: "A JSON file that tells the browser about your PWA and how it should behave when installed.",
  },
  {
    q: "What is 'IndexedDB'?",
    a: "A low-level API for client-side storage of significant amounts of structured data.",
  },
  {
    q: "What is 'LocalStorage' size limit?",
    a: "Typically 5MB-10MB per origin.",
  },
  {
    q: "What is 'SessionStorage'?",
    a: "Storage that persists only for the duration of the page session (until tab is closed).",
  },
  {
    q: "What is 'Secure' cookie flag?",
    a: "Ensures the cookie is only sent over HTTPS.",
  },
  {
    q: "What is 'HttpOnly' cookie flag?",
    a: "Prevents client-side scripts from accessing the cookie (prevents XSS leaks).",
  },
  {
    q: "What is 'SameSite' cookie flag?",
    a: "Controls whether cookies are sent with cross-site requests (CSRF protection).",
  },
  {
    q: "What is 'XSS'?",
    a: "Cross-Site Scripting - injecting malicious scripts into another user's browser session.",
  },
  {
    q: "What is 'CSRF'?",
    a: "Cross-Site Request Forgery - tricking an authenticated user into performing an action they didn't intend to.",
  },
  {
    q: "What is 'Content Security Policy' (CSP)?",
    a: "A security layer that helps detect and mitigate certain types of attacks, including XSS and data injection.",
  },
  {
    q: "What is 'Subresource Integrity' (SRI)?",
    a: "Enables browsers to verify that files they fetch are delivered without unexpected manipulation.",
  },
  {
    q: "What is 'HSTS'?",
    a: "HTTP Strict Transport Security - forces browsers to use HTTPS consistently.",
  },
  {
    q: "Explain 'LCP' Optimization.",
    a: "Optimize images, use CDNs, preconnect to origins, and use critical CSS.",
  },
  {
    q: "How to reduce 'First Input Delay'?",
    a: "Break up long tasks, optimize JS execution, and use a web worker.",
  },
  {
    q: "How to improve 'CLS'?",
    a: "Always include size attributes for images/videos, avoid inserting content above existing content, and use transform animations.",
  },
  {
    q: "What is 'Critical Rendering Path'?",
    a: "HTML -> CSS -> Render Tree -> Layout -> Paint.",
  },
  {
    q: "What is 'Tree Shaking'?",
    a: "Removing unused code from the final bundle.",
  },
  {
    q: "What is 'Minification'?",
    a: "Removing unnecessary characters from code to reduce file size.",
  },
  {
    q: "What is 'Uglification'?",
    a: "Making code harder to read and reducing its size (part of minification).",
  },
  {
    q: "What is 'Dead Code Elimination'?",
    a: "The process of removing code that is never executed.",
  },
  {
    q: "What is 'Gzip' vs 'Brotli'?",
    a: "Brotli is generally more efficient than Gzip for compressing web assets.",
  },
  {
    q: "What is 'HTTP/2' multiplexing?",
    a: "Allowing multiple requests and responses to be sent simultaneously over a single TCP connection.",
  },
  {
    q: "What is 'HTTP/3' (QUIC)?",
    a: "Next generation of HTTP that uses UDP instead of TCP for faster connection setup and better performance on lossy networks.",
  },
  {
    q: "What is 'CDN'?",
    a: "Content Delivery Network - a system of distributed servers that deliver web content based on user location.",
  },
  {
    q: "What is 'Cache-Control' header?",
    a: "Directives for caching mechanisms in both browsers and shared caches.",
  },
  {
    q: "What is 'Etag'?",
    a: "An identifier for a specific version of a resource, used for cache validation.",
  },
  {
    q: "What is 'Service Worker' skipWaiting?",
    a: "Allows the new service worker to become active immediately even if there are open tabs.",
  },
  {
    q: "What is 'Double Buffer' rendering?",
    a: "A technique to reduce flickering by drawing to an off-screen buffer before displaying it.",
  },
  {
    q: "What is 'GPU Acceleration'?",
    a: "Using the graphics card to handle tasks like CSS transforms and opacity for better performance.",
  },
  {
    q: "What is 'Will-change' property?",
    a: "Tells the browser which properties are expected to change, allowing it to optimize ahead of time.",
  },
  {
    q: "What is 'Intersection Observer'?",
    a: "Detects when an element enters or leaves the viewport.",
  },
  {
    q: "What is 'Resize Observer'?",
    a: "Detects changes to an element's dimensions.",
  },
  {
    q: "What is 'Mutation Observer'?",
    a: "Detects changes to the DOM tree (attributes, children, etc.).",
  },
  {
    q: "What is 'Custom Elements' registry?",
    a: "The registry where you define and look up custom elements.",
  },
  {
    q: "What is 'Shadow DOM' encapsulation mode?",
    a: "Open (accessible via JS) or Closed (not accessible).",
  },
  {
    q: "What is 'CSS Scoping'?",
    a: "Ensuring styles only apply to a specific part of the DOM.",
  },
  {
    q: "What is 'Scoped CSS' in Vue?",
    a: "A way to automatically scope CSS to a component using data attributes.",
  },
  {
    q: "What is 'CSS in JS' vs 'CSS Modules'?",
    a: "Dynamic/Runtime generation vs Build-time scoping.",
  },
  {
    q: "What is 'Wasm' (WebAssembly)?",
    a: "A binary instruction format for a stack-based virtual machine, allowing code to run at near-native speed in the browser.",
  },
  {
    q: "What is 'AssemblyScript'?",
    a: "A language similar to TypeScript that compiles to WebAssembly.",
  },
  {
    q: "What is 'Rust' for Wasm?",
    a: "A popular systems language frequently used for high-performance web modules via Wasm.",
  },
  {
    q: "What is 'Yarn' PnP?",
    a: "Plug'n'Play - an installation strategy that removes node_modules entirely.",
  },
  {
    q: "What is 'Bun'?",
    a: "A fast all-in-one JavaScript runtime, package manager, and bundler.",
  },
  {
    q: "What is 'Deno'?",
    a: "A secure runtime for JavaScript and TypeScript from the creator of Node.js.",
  },
  {
    q: "What is 'Monorepo'?",
    a: "A software development strategy where code for many projects is stored in the same repository.",
  },
  {
    q: "What is 'TurboRepo'?",
    a: "A high-performance build system for JavaScript and TypeScript monorepos.",
  },
  {
    q: "What is 'Nx'?",
    a: "A smart, fast, and extensible build system with first-class monorepo support.",
  },
  {
    q: "What is 'Lerna'?",
    a: "A tool for managing JavaScript projects with multiple packages.",
  },
  {
    q: "What is 'Semantic Versioning' (SemVer)?",
    a: "MAJOR.MINOR.PATCH versioning strategy.",
  },
  {
    q: "What is 'Changelog'?",
    a: "A file which contains a curated, chronologically ordered list of notable changes for each version of a project.",
  },
  {
    q: "What is 'Conventional Commits'?",
    a: "A specification for adding human and machine readable meaning to commit messages.",
  },
  { q: "What is 'Husky'?", a: "A tool for easily managing Git hooks." },
  {
    q: "What is 'Lint-staged'?",
    a: "Running linters against staged git files.",
  },
  { q: "What is 'Prettier'?", a: "An opinionated code formatter." },
  {
    q: "What is 'ESLint'?",
    a: "A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.",
  },
  {
    q: "What is 'Stylelint'?",
    a: "A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.",
  },
  {
    q: "What is 'Atomic Design'?",
    a: "A methodology for building design systems with five levels: Atoms, Molecules, Organisms, Templates, and Pages.",
  },
  {
    q: "What is 'Design Tokens'?",
    a: "Agnostic variables for a design system's visual atoms (colors, spacing, etc.).",
  },
  {
    q: "What is 'Layout Thrashing'?",
    a: "When repeated read/write cycles to the DOM cause the browser to repeatedly recalculate layout.",
  },
  {
    q: "Explain 'Reflow' vs 'Repaint'.",
    a: "Reflow is calculating geometry; Repaint is drawing pixels.",
  },
  {
    q: "What is 'Contain' CSS property?",
    a: "Allows you to isolate parts of the page for performance optimization.",
  },
  {
    q: "What is 'Content-visibility'?",
    a: "Skips rendering of off-screen content until it's needed.",
  },
  {
    q: "What is 'Display: contents'?",
    a: "Makes the container 'disappear', so its children become direct children of the container's parent.",
  },
  {
    q: "What is 'Aspect-ratio' CSS?",
    a: "Sets a preferred aspect ratio for the box, which will be used in the calculation of auto sizes.",
  },
  {
    q: "What is 'Object-fit'?",
    a: "Controls how an <img> or <video> should be resized to fit its container.",
  },
  {
    q: "What is 'Pointer-events: none'?",
    a: "Makes an element 'invisible' to mouse events.",
  },
  {
    q: "What is 'Overscroll-behavior'?",
    a: "Controls what happens when you reach the edge of a scroll area.",
  },
  {
    q: "What is 'Scroll-margin'?",
    a: "Sets the margin for an element when it is scrolled into view (useful for fixed headers).",
  },
  {
    q: "What is 'Hyphens: auto'?",
    a: "Allows the browser to automatically insert hyphens at line breaks.",
  },
  {
    q: "What is 'User-select: none'?",
    a: "Prevents the user from selecting text.",
  },
  {
    q: "What is 'Variable Fonts'?",
    a: "Font files that can behave like multiple styles (weight, width, etc.) within a single file.",
  },
  {
    q: "Explain 'Aria-label' vs 'Aria-labelledby'.",
    a: "label is a string; labelledby points to another element's ID.",
  },
  {
    q: "What is 'Aria-live'?",
    a: "Tells assistive technology to announce updates to an element (polite vs assertive).",
  },
  {
    q: "What is 'Focus-visible'?",
    a: "Applies styles only when an element is focused via keyboard.",
  },
  {
    q: "What is 'Prefers-reduced-motion'?",
    a: "A media query to detect if the user has requested less animation.",
  },
  {
    q: "What is 'Prefers-color-scheme'?",
    a: "A media query to detect if the user prefers dark or light mode.",
  },
  {
    q: "What is 'Color-contrast()'?",
    a: "A CSS function to pick the color with the best contrast from a list.",
  },
  {
    q: "What is 'Clamp()' in CSS?",
    a: "Clamps a value between an upper and lower bound (min, preferred, max).",
  },
  {
    q: "What is 'Min()' and 'Max()' in CSS?",
    a: "Mathematical functions to pick the smallest or largest value.",
  },
  {
    q: "What is 'Subgrid' in CSS Grid?",
    a: "Allows a grid item to use its parent's grid tracks.",
  },
  {
    q: "What is 'Gap' property?",
    a: "Provides a way to set gutters between rows and columns (works in Flex and Grid).",
  },
  {
    q: "What is 'Place-items'?",
    a: "Shorthand for align-items and justify-items.",
  },
  {
    q: "What is 'Writing-mode'?",
    a: "Controls whether lines of text are laid out horizontally or vertically.",
  },
  {
    q: "What is 'Logical Properties' (margin-block, etc.)?",
    a: "Direction-agnostic spacing properties that adapt to writing modes.",
  },
  {
    q: "What is 'Image-set()'?",
    a: "Allows the browser to choose the best image based on resolution (retina support).",
  },
  {
    q: "What is 'Picture' element used for?",
    a: "Art direction - serving different images for different viewports.",
  },
  {
    q: "What is 'Loading=lazy'?",
    a: "Native browser lazy loading for images and iframes.",
  },
  {
    q: "What is 'Decoding=async'?",
    a: "Tells the browser to decode an image off the main thread.",
  },
  {
    q: "What is 'Fetchpriority' attribute?",
    a: "Hints to the browser the relative priority of a resource (high, low, auto).",
  },
  {
    q: "What is 'Preload' vs 'Prefetch'?",
    a: "Preload is for current page; Prefetch is for future navigation.",
  },
  {
    q: "What is 'Preconnect'?",
    a: "Warms up a connection to a foreign origin (DNS + TCP + TLS).",
  },
  {
    q: "What is 'DNS-prefetch'?",
    a: "Resolves a domain name before a resource is requested.",
  },
  {
    q: "What is 'Resource Timing API'?",
    a: "Provides data about when resources in your app were loaded.",
  },
  {
    q: "What is 'User Timing API'?",
    a: "Measuring custom tasks in your app using marks and measures.",
  },
  {
    q: "What is 'Navigation Timing API'?",
    a: "Provides data about the page's navigation (redirects, domContentLoaded, etc.).",
  },
  {
    q: "What is 'Long Tasks API'?",
    a: "Reports on tasks that block the main thread for 50ms or more.",
  },
  {
    q: "What is 'Layout Instability API'?",
    a: "The underlying API for measuring CLS.",
  },
  {
    q: "Explain 'Hydration Mismatch'.",
    a: "When server-rendered HTML doesn't match the first client-side render.",
  },
  {
    q: "What is 'Dehydration' in React Query?",
    a: "Preparing a query cache to be sent from server to client.",
  },
  {
    q: "What is 'Optimistic UI'?",
    a: "Updating the UI immediately assuming a server request will succeed.",
  },
  {
    q: "What is 'Suspense for Data Fetching'?",
    a: "Allowing components to wait for async data before rendering.",
  },
  {
    q: "What is 'Streaming SSR'?",
    a: "Sending HTML chunks to the browser as they become ready on the server.",
  },
  {
    q: "What is 'Selective Hydration'?",
    a: "React 18 feature that prioritizes hydrating parts of the page the user interacts with first.",
  },
  {
    q: "What is 'Auto-batching' in React 18?",
    a: "Updates inside promises, timeouts, and native events are now batched.",
  },
  {
    q: "What is 'Transition' in React 18?",
    a: "A way to mark a state update as non-urgent (useTransition).",
  },
  {
    q: "What is 'Deferred Value'?",
    a: "A hook that keeps an old value while a new one is being computed (useDeferredValue).",
  },
  {
    q: "What is 'React Server Components' serialization?",
    a: "The process of turning RSC output into a streamable JSON-like format.",
  },
  {
    q: "Can you pass functions to RSC?",
    a: "No, RSC props must be serializable (except for Server Actions).",
  },
  { q: "Where do RSC run?", a: "Only on the server." },
  {
    q: "Where do Client Components run?",
    a: "Primarily on the client, but SSR'd on the server.",
  },
  {
    q: "What is 'use client' directive?",
    a: "Marks the boundary between server and client code.",
  },
  {
    q: "What is 'use server' directive?",
    a: "Marks a function as a Server Action.",
  },
  {
    q: "What is 'Next.js App Router' structure?",
    a: "Uses the `app/` directory and is built on React Server Components.",
  },
  {
    q: "What is 'Next.js Pages Router'?",
    a: "The legacy routing system using the `pages/` directory.",
  },
  {
    q: "What is 'Next.js Middleware' platform?",
    a: "Runs on the Vercel Edge Runtime (subset of Node APIs).",
  },
  {
    q: "What is 'Next.js Image' loading strategy?",
    a: "Eager (above fold) or Lazy (below fold).",
  },
  {
    q: "What is 'Next.js Script' strategy?",
    a: "beforeInteractive, afterInteractive, lazyOnload, worker.",
  },
  {
    q: "What is 'Next.js Font' subsetting?",
    a: "Loading only the characters needed for a specific language.",
  },
  {
    q: "What is 'Next.js Metadata' API?",
    a: "A way to define SEO tags (title, description) in a type-safe way.",
  },
  {
    q: "What is 'Parallel Routes'?",
    a: "Rendering multiple pages in the same layout simultaneously.",
  },
  {
    q: "What is 'Intercepting Routes'?",
    a: "Loading a route within the current layout while keeping the context (e.g., modals).",
  },
  {
    q: "What is 'Static Exports' in Next.js?",
    a: "Generating a purely static site with no server-side logic at runtime.",
  },
  {
    q: "What is 'Incremental Static Regeneration' (ISR)?",
    a: "Updating static content at a specified interval without rebuild.",
  },
  {
    q: "What is 'On-demand Revalidation'?",
    a: "Manually triggering an ISR update via a secret token/API.",
  },
  {
    q: "What is 'STB' (Stale-While-Revalidate) in caching?",
    a: "Serving old data while fetching fresh data in the background.",
  },
  {
    q: "What is 'Vercel Edge Functions'?",
    a: "Serverless functions that run at the edge, closer to users.",
  },
  {
    q: "What is 'Edge Runtime'?",
    a: "A standards-based runtime for web platform APIs, lighter than Node.js.",
  },
  {
    q: "What is 'Cold Start'?",
    a: "The delay when a serverless function is invoked for the first time in a while.",
  },
  {
    q: "What is 'Dynamic Import'?",
    a: "import() syntax for splitting code and loading it asynchronously.",
  },
  {
    q: "What is 'React.memo' second argument?",
    a: "A custom comparison function (areEqual).",
  },
  {
    q: "What is 'React.forwardRef' wrapper?",
    a: "A higher-order component that enables ref forwarding.",
  },
  {
    q: "What is 'HOC' (Higher Order Component)?",
    a: "A function that takes a component and returns a new component.",
  },
  {
    q: "What is 'Render Props'?",
    a: "A pattern where a component's prop is a function that returns JSX.",
  },
  {
    q: "What is 'Compound Components'?",
    a: "A pattern where components work together to manage shared state (e.g., Select and Option).",
  },
  {
    q: "What is 'Controlled' vs 'Uncontrolled' components?",
    a: "State managed by React vs State managed by the DOM.",
  },
  {
    q: "What is 'Lifting State Up'?",
    a: "Moving shared state to the closest common ancestor.",
  },
  {
    q: "What is 'Flux' architecture?",
    a: "Action -> Dispatcher -> Store -> View (one-way data flow).",
  },
  {
    q: "What is 'Redux' middleware?",
    a: "Provides a third-party extension point between dispatching an action and the moment it reaches the reducer.",
  },
  {
    q: "What is 'Thunk'?",
    a: "A function that wraps an expression to delay its evaluation (used for async Redux).",
  },
  {
    q: "What is 'Selector' in Redux?",
    a: "A function that extracts a specific part of the state tree.",
  },
  {
    q: "What is 'Immer'?",
    a: "A library that allows you to work with immutable state in a more convenient, mutable-looking way.",
  },
  {
    q: "What is 'Reselect'?",
    a: "A library for creating memoized selector functions.",
  },
  {
    q: "What is 'X State'?",
    a: "State machines and statecharts for modern web apps.",
  },
  { q: "What is 'Cypress'?", a: "An end-to-end testing framework." },
  {
    q: "What is 'Playwright'?",
    a: "Cross-browser end-to-end testing from Microsoft.",
  },
  {
    q: "What is 'Jest'?",
    a: "A delightful JavaScript Testing Framework with a focus on simplicity.",
  },
  {
    q: "What is 'Vitest'?",
    a: "A Vite-native unit test framework, extremely fast.",
  },
  {
    q: "What is 'React Testing Library'?",
    a: "A library for testing React components by focusing on user interactions.",
  },
  {
    q: "What is 'Snapshot Testing'?",
    a: "Taking a 'picture' of a component's output and comparing it to a saved version.",
  },
  {
    q: "What is 'Mocking' in tests?",
    a: "Replacing a real dependency with a fake version for isolation.",
  },
  {
    q: "What is 'TDD' (Test Driven Development)?",
    a: "Write test -> Fail -> Write code -> Pass -> Refactor.",
  },
  {
    q: "What is 'BDD' (Behavior Driven Development)?",
    a: "Testing based on user behavior (Given, When, Then).",
  },
  {
    q: "What is 'MSW' (Mock Service Worker)?",
    a: "API mocking for browser and Node by intercepting requests at the network level.",
  },
];
