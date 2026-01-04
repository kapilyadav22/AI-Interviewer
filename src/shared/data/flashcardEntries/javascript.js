export const javascriptCards = [
  // --- Core JS (1-40) ---
  {
    q: "What is Javascript?",
    a: "High-level, interpreted scripting language.",
  },
  { q: "Variables in JS?", a: "var, let, const." },
  { q: "Difference between var, let, const?", a: "Scope and Hoisting." },
  { q: "What is Hoisting?", a: "Moving declarations to the top." },
  { q: "What is Closure?", a: "Function + Lexical Environment." },
  {
    q: "What is 'this' keyword?",
    a: "Refers to the current execution context.",
  },
  { q: "What is Call/Apply/Bind?", a: "Methods to change function context." },
  { q: "What is Prototype?", a: "Mechanism to share properties." },
  {
    q: "What is Prototypal Inheritance?",
    a: "Object inheriting from other objects.",
  },
  { q: "What is Event Loop?", a: "Coordinates async execution." },
  {
    q: "Call Stack vs Task Queue?",
    a: "Sync code execution vs Async callbacks.",
  },
  { q: "What is a Promise?", a: "Eventually resolved value." },
  { q: "Async/Await?", a: "Nicer syntax for Promises." },
  { q: "Microtask vs Macrotask?", a: "Promises vs Timeout priority." },
  { q: "What is Callback?", a: "Function passed to another function." },
  { q: "Callback Hell?", a: "Deeply nested async functions." },
  { q: "What is IIFE?", a: "Immediately Invoked Function Expression." },
  { q: "Strict Mode?", a: "Caught common bugs/errors." },
  { q: "Equality operators?", a: "== vs === (Strict)." },
  { q: "What is NaN?", a: "Not a Number value." },
  { q: "What is Infinity?", a: "Numeric result of division by zero." },
  {
    q: "What is Undefined vs Null?",
    a: "Not assigned vs Intentionally empty.",
  },
  { q: "What is Type Coercion?", a: "Automatic type conversion." },
  {
    q: "What is Spread/Rest operator?",
    a: "Expanding/Gathering arrays/objects.",
  },
  { q: "Template Literals?", a: "Backtick strings with ${} variables." },
  { q: "Arrow Functions?", a: "Shorter syntax with lexical 'this'." },
  { q: "Destructuring?", a: "Unpacking arrays/objects into variables." },
  { q: "What is Module system?", a: "Export/Import syntax." },
  { q: "JS Engines?", a: "V8 (Chrome), SpiderMonkey (Firefox)." },
  { q: "What is DOM?", a: "Document Object Model tree representation." },
  { q: "What is BOM?", a: "Browser Object Model (window, location)." },
  { q: "What is Event Delegation?", a: "Dynamic listeners using bubbling." },
  { q: "Event Bubbling vs Capturing?", a: "Target to root vs Root to target." },
  { q: "What is SetTimeout vs SetInterval?", a: "Run once vs Run repeatedly." },
  {
    q: "What is LocalStorage vs SessionStorage?",
    a: "Permanent vs Per-tab storage.",
  },
  { q: "What is Cookies?", a: "Small data sent in HTTP headers." },
  { q: "What is Fetch API?", a: "Modern syntax for making network requests." },
  { q: "What is JSON?", a: "JavaScript Object Notation." },
  {
    q: "What is 'Currying'?",
    a: "Transforming a function with multiple arguments into a series of functions with a single argument.",
  },
  {
    q: "What is 'Partial Application'?",
    a: "Fixing a number of arguments to a function, producing another function of smaller arity.",
  },
  {
    q: "What is 'Composition' in JS?",
    a: "Combining simple functions to build more complex ones (pipe, compose).",
  },
  {
    q: "What is 'Point-free style'?",
    a: "Writing functions without explicitly mentioning their arguments.",
  },
  {
    q: "What is 'Higher-Order Function'?",
    a: "A function that takes one or more functions as arguments, or returns a function.",
  },
  {
    q: "What is 'Predicate' function?",
    a: "A function that returns a boolean.",
  },
  {
    q: "What is 'Arity' of a function?",
    a: "The number of arguments the function takes.",
  },
  {
    q: "What is 'Variadic' function?",
    a: "A function that takes an indefinite number of arguments.",
  },
  {
    q: "Explain 'Call Stack' depth.",
    a: "The maximum number of calls that can be on the stack (varies by browser/OS).",
  },
  {
    q: "What is 'Stack Overflow'?",
    a: "Exceeding the maximum call stack size, usually due to infinite recursion.",
  },
  {
    q: "What is 'Microtask' vs 'Macrotask'?",
    a: "Microtasks (Promises, MutationObserver) run after the current task and before the next task; Macrotasks (setTimeout, setInterval) are queued for the event loop.",
  },
  {
    q: "What is 'QueueMicrotask' API?",
    a: "A way to explicitly add a task to the microtask queue.",
  },
  {
    q: "What is 'RequestAnimationFrame'?",
    a: "Tells the browser you wish to perform an animation and requests it to call a specified function to update an animation before the next repaint.",
  },
  {
    q: "What is 'RequestIdleCallback'?",
    a: "Queues a function to be called during a browser's idle periods.",
  },
  {
    q: "What is 'PostMessage' API?",
    a: "Allows cross-origin communication between Window objects.",
  },
  {
    q: "What is 'BroadcastChannel'?",
    a: "Allows simple communication between browsing contexts (tabs, windows, frames, workers) on the same origin.",
  },
  {
    q: "What is 'Channel Messaging API'?",
    a: "Allows two scripts in separate browsing contexts to communicate directly via ports.",
  },
  {
    q: "What is 'SharedArrayBuffer'?",
    a: "An object used to represent a generic, fixed-length raw binary data buffer, similar to ArrayBuffer, but can be shared between the main thread and workers.",
  },
  {
    q: "What is 'Atomics' in JS?",
    a: "Provides atomic operations as static methods to be used with SharedArrayBuffer objects.",
  },
  {
    q: "What is 'Object.observe' status?",
    a: "Deprecated and removed in favor of Proxy.",
  },
  {
    q: "What is 'Proxy' in JS?",
    a: "Allows you to create an object that can be used in place of the original object, but which may redefine fundamental Object operations.",
  },
  {
    q: "What is 'Reflect' API?",
    a: "A built-in object that provides methods for interceptable JavaScript operations.",
  },
  {
    q: "What is 'Symbol' and why use it?",
    a: "Unique and immutable primitive value, used for adding non-enumerable properties to objects.",
  },
  {
    q: "What is 'Symbol.iterator'?",
    a: "A well-known symbol that specifies the default iterator for an object.",
  },
  {
    q: "What is 'Symbol.asyncIterator'?",
    a: "Specifies the default AsyncIterator for an object.",
  },
  {
    q: "What is 'Generator' function?",
    a: "A function that can be exited and later re-entered, maintaining its context (variable bindings).",
  },
  {
    q: "What is 'Yield' keyword?",
    a: "Used to pause and resume a generator function.",
  },
  {
    q: "What is 'Iterable' vs 'Iterator'?",
    a: "Iterable has a Symbol.iterator; Iterator has a next() method.",
  },
  {
    q: "What is 'Async Generator'?",
    a: "A generator function that yields Promises.",
  },
  {
    q: "What is 'For-await-of' loop?",
    a: "Used to iterate over async iterable objects.",
  },
  {
    q: "What is 'Garbage Collection' in V8?",
    a: "Generational GC with Young Generation (Scavenge) and Old Generation (Mark-Sweep/Compact).",
  },
  {
    q: "What is 'Memory Leak'?",
    a: "Memory that is no longer needed but is not released by the GC.",
  },
  {
    q: "Common causes of JS memory leaks?",
    a: "Accidental globals, forgotten timers/callbacks, closures, and out-of-DOM references.",
  },
  {
    q: "What is 'WeakMap' vs 'Map'?",
    a: "WeakMap keys must be objects and are weakly held (GC can collect them).",
  },
  {
    q: "What is 'WeakSet' vs 'Set'?",
    a: "WeakSet stores objects only and are weakly held.",
  },
  {
    q: "What is 'WeakRef' and 'FinalizationRegistry'?",
    a: "Advanced APIs for weakly referencing objects and running cleanup callbacks when they are collected.",
  },
  {
    q: "What is 'Prototype' object?",
    a: "A mechanism by which JS objects inherit features from one another.",
  },
  {
    q: "What is '__proto__' vs 'prototype'?",
    a: "__proto__ is the internal link; 'prototype' is the property on a constructor function used to set the __proto__ of new instances.",
  },
  {
    q: "What is 'Shadowing' a property?",
    a: "When an object has a property with the same name as one in its prototype chain.",
  },
  {
    q: "What is 'Class' syntax in JS?",
    a: "Syntactic sugar over prototypal inheritance.",
  },
  {
    q: "What is 'Super' keyword?",
    a: "Used to access and call functions on an object's parent.",
  },
  {
    q: "What is 'Static' method in Class?",
    a: "A method that belongs to the class itself, not its instances.",
  },
  {
    q: "What is 'Private Class Fields'?",
    a: "Using # prefix to make properties truly private to the class.",
  },
  {
    q: "What is 'Object.create(null)'?",
    a: "Creates an object with no prototype (no toString, etc.).",
  },
  {
    q: "What is 'Object.assign()'?",
    a: "Copies enumerable own properties from one or more source objects to a target object (shallow copy).",
  },
  {
    q: "What is 'StructuredClone'?",
    a: "A native API for creating deep copies of objects (handles circular refs).",
  },
  {
    q: "What is 'JSON.stringify' deep copy catch?",
    a: "Can't handle functions, Dates, RegEx, Symbols, or circular refs.",
  },
  {
    q: "What is 'Property Descriptor'?",
    a: "Object describing a property's behavior (value, writable, enumerable, configurable).",
  },
  {
    q: "What is 'Object.defineProperty'?",
    a: "Defines a new property or modifies an existing one on an object.",
  },
  {
    q: "What is 'Object.freeze()'?",
    a: "Makes an object immutable (can't add, delete, or change properties).",
  },
  {
    q: "What is 'Object.seal()'?",
    a: "Can't add or delete properties, but can change existing ones.",
  },
  {
    q: "What is 'Object.preventExtensions()'?",
    a: "Prevents new properties from being added.",
  },
  {
    q: "What is 'Array.prototype.flat()'?",
    a: "Creates a new array with all sub-array elements concatenated into it recursively up to a specified depth.",
  },
  {
    q: "What is 'Array.prototype.flatMap()'?",
    a: "Maps each element using a mapping function, then flattens the result into a new array.",
  },
  {
    q: "Difference between 'Slice' and 'Splice'?",
    a: "Slice returns a copy; Splice modifies the original array.",
  },
  {
    q: "What is 'Array.from()'?",
    a: "Creates a new, shallow-copied Array instance from an array-like or iterable object.",
  },
  {
    q: "What is 'Intl' API?",
    a: "Provides language-sensitive string comparison, number formatting, and date/time formatting.",
  },
  {
    q: "What is 'BigInt'?",
    a: "A primitive that provides a way to represent whole numbers larger than 2^53 - 1.",
  },
  {
    q: "What is 'Optional Chaining' (?.)?",
    a: "Safely accessing nested properties without having to check if each level exists.",
  },
  {
    q: "What is 'Nullish Coalescing' (??)?",
    a: "Returns the right-hand operand when the left-hand is null or undefined (unlike || which checks falsy).",
  },
  {
    q: "What is 'Temporal' API status?",
    a: "New proposal for a modern date/time API in JS (replaces Date).",
  },
  {
    q: "What is 'Toplevel Await'?",
    a: "Ability to use await outside of an async function at the top level of a module.",
  },
  {
    q: "What is 'EcmaScript Modules' (ESM) vs 'CommonJS'?",
    a: "import/export (static) vs require/module.exports (dynamic).",
  },
  {
    q: "What is 'Dynamic Import' (import())?",
    a: "Allows you to load modules on demand.",
  },
  {
    q: "What is 'Node.js' Event Emitter?",
    a: "A core class that facilitates communication between objects in Node.js via events.",
  },
  { q: "What is 'Buffer' in Node.js?", a: "Used to handle binary data." },
  {
    q: "What is 'Stream' in Node.js?",
    a: "An abstract interface for working with streaming data (readable, writable, duplex, transform).",
  },
  {
    q: "What is 'Pipe' in Node.js Streams?",
    a: "A method used to take a readable stream and connect it to a writable stream.",
  },
  {
    q: "What is 'Event Loop' phases in Node.js?",
    a: "Timers, Pending Callbacks, Idle/Prepare, Poll, Check (setImmediate), Close Callbacks.",
  },
  {
    q: "What is 'Process.nextTick()'?",
    a: "Queues a callback to be executed immediately after the current operation, before the next event loop phase.",
  },
  {
    q: "SetTimeout(0) vs SetImmediate() in Node?",
    a: "nextTick > setTimeout(0) > setImmediate (usually).",
  },
  {
    q: "What is 'Libuv'?",
    a: "The C library that provides the event loop and asynchronous I/O in Node.js.",
  },
  {
    q: "What is 'V8'?",
    a: "Google's open-source high-performance JS and WebAssembly engine, written in C++.",
  },
  {
    q: "What is 'JIT' Compilation in V8?",
    a: "Just-In-Time compilation - compiling JS to machine code during execution.",
  },
  { q: "What is 'TurboFan' in V8?", a: "The optimizing compiler in V8." },
  { q: "What is 'Ignition' in V8?", a: "The interpreter in V8." },
  {
    q: "What is 'Liftoff' in V8?",
    a: "The baseline compiler for WebAssembly in V8.",
  },
  {
    q: "What is 'Profiling'?",
    a: "Analyzing code to identify performance bottlenecks and memory leaks.",
  },
  {
    q: "What is 'Flame Graph'?",
    a: "A visualization of profiled software, used to identify frequent code paths.",
  },
  {
    q: "What is 'V0' in JS context?",
    a: "Usually refers to original versions or early implementations (e.g., Shadow DOM v0).",
  },
  {
    q: "What is 'Polyfill' vs 'Ponyfill'?",
    a: "Polyfill monkey-patches the environment; Ponyfill provides the functionality as a standalone module without touching globals.",
  },
  {
    q: "What is 'Transpilation' (Babel)?",
    a: "Converting modern JS (ES6+) into an older version (ES5) for browser compatibility.",
  },
  {
    q: "What is 'Source Map'?",
    a: "A file that maps minified/transpiled code back to its original source.",
  },
  {
    q: "What is 'Strict Mode' and what it prevents?",
    a: "Throws errors for accidental globals, prevents deleting non-deletable properties, etc.",
  },
  { q: "What is Memoization?", a: "Caching function results." },
];
