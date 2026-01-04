export const javaCards = [
  // --- Core Java (1-50) ---
  {
    q: "What is Java?",
    a: "High-level, object-oriented, platform-independent language.",
  },
  { q: "What is JVM?", a: "Java Virtual Machine - executes bytecode." },
  {
    q: "What is JRE?",
    a: "Java Runtime Environment - includes JVM + libraries.",
  },
  {
    q: "What is JDK?",
    a: "Java Development Kit - includes JRE + compilers/tools.",
  },
  {
    q: "Why is Java platform independent?",
    a: "Bytecode runs on any OS with a JVM.",
  },
  {
    q: "What is JIT Compiler?",
    a: "Just-In-Time compiler - converts bytecode to machine code at runtime.",
  },
  {
    q: "What is OOP?",
    a: "Object-Oriented Programming (Classes, Objects, Inheritance, etc.).",
  },
  {
    q: "Four pillars of OOP?",
    a: "Encapsulation, Inheritance, Polymorphism, Abstraction.",
  },
  { q: "Difference between Class and Object?", a: "Blueprint vs Instance." },
  {
    q: "What is Inheritance?",
    a: "Child class acquiring parent class features.",
  },
  {
    q: "What is Polymorphism?",
    a: "Ability to take many forms (Runtime/Compile-time).",
  },
  {
    q: "Method Overloading vs Overriding?",
    a: "Same class/diff params vs Child class/same params.",
  },
  {
    q: "What is Abstraction?",
    a: "Showing only essential details to the user.",
  },
  {
    q: "What is Encapsulation?",
    a: "Wrapping data and methods into a single unit (POJO).",
  },
  {
    q: "What is an Interface?",
    a: "Blueprint of a class with abstract methods.",
  },
  {
    q: "Abstract Class vs Interface?",
    a: "State + Behavior vs primarily Behavior.",
  },
  {
    q: "What is 'Static' keyword?",
    a: "Variable/Method belonging to class, not instance.",
  },
  {
    q: "What is 'Final' keyword?",
    a: "Prevents change (Variable), override (Method), or inheritance (Class).",
  },
  {
    q: "What is 'Finally' block?",
    a: "Code that always executes (exception or not).",
  },
  { q: "Final vs Finally vs Finalize?", a: "Keyword vs Block vs Method (GC)." },
  { q: "What is 'Super' keyword?", a: "Refers to parent class instance." },
  { q: "What is 'This' keyword?", a: "Refers to current class instance." },
  {
    q: "What is Constructor?",
    a: "Special method invoked to create an object.",
  },
  {
    q: "What is Garbage Collection?",
    a: "Automatic memory management in JVM.",
  },
  {
    q: "Java Memory Areas?",
    a: "Heap, Stack, Method Area, PC Register, Native Stack.",
  },
  { q: "Stack vs Heap?", a: "Primitive + Ref vars (Stack) vs Objects (Heap)." },
  { q: "What is 'String Pool'?", a: "Cachable area for string literals." },
  { q: "Why are Strings immutable?", a: "Security, Thread-safety, Caching." },
  {
    q: "StringBuilder vs StringBuffer?",
    a: "Non-thread-safe (faster) vs Thread-safe (slower).",
  },
  {
    q: "What is Wrapper class?",
    a: "Class representing primitive types (e.g., Integer).",
  },
  {
    q: "What is Autoboxing/Unboxing?",
    a: "Auto conversion between primitive and wrapper.",
  },
  {
    q: "What is Exception Handling?",
    a: "Managing errors using try-catch-finally.",
  },
  {
    q: "Checked vs Unchecked Exceptions?",
    a: "Compile-time (IOException) vs Runtime (NullPointer).",
  },
  {
    q: "What is 'Throw' vs 'Throws'?",
    a: "Throwing an exception vs Declaring it in signature.",
  },
  {
    q: "What is Collection Framework?",
    a: "Group of classes/interfaces for data structures.",
  },
  {
    q: "List vs Set vs Map?",
    a: "Ordered (duplicates) vs Unordered (unique) vs Key-Value.",
  },
  {
    q: "ArrayList vs LinkedList?",
    a: "Resizable array vs Doubly linked list.",
  },
  { q: "HashMap vs HashSet?", a: "Key-Value pairs vs Unique elements." },
  { q: "HashMap internal work?", a: "Hashing + Indexing + Collisions." },
  { q: "What is 'Generics'?", a: "Type-safe classes/methods." },
  { q: "What is 'Reflection'?", a: "Inspecting/Modifying code at runtime." },
  { q: "What is 'Serialization'?", a: "Converting object to byte stream." },
  {
    q: "What is 'Transient' keyword?",
    a: "Preventing serialization of a field.",
  },
  {
    q: "What is 'Multithreading'?",
    a: "Concurrent execution of multiple threads.",
  },
  { q: "How to create a Thread?", a: "Extend Thread or Implement Runnable." },
  {
    q: "Thread lifecycle phases?",
    a: "New, Runnable, Running, Blocked, Waiting, Timed_Waiting, Terminated.",
  },
  {
    q: "What is 'Synchronized'?",
    a: "Locking a method/block for thread safety.",
  },
  {
    q: "What is 'Volatile'?",
    a: "Ensuring variable visibility across threads.",
  },
  {
    q: "What is 'Deadlock'?",
    a: "Two threads waiting on each other indefinitely.",
  },
  {
    q: "What is 'Lambda Expression'?",
    a: "Concise way to write functional interfaces.",
  },

  // --- Spring Boot (51-100) ---
  {
    q: "What is Spring Framework?",
    a: "Lightweight, modular Java framework for enterprise apps.",
  },
  {
    q: "What is Spring Boot?",
    a: "Opinionated extension of Spring for fast setup.",
  },
  {
    q: "What is IoC (Inversion of Control)?",
    a: "Framework managing object lifecycle.",
  },
  {
    q: "What is Dependency Injection (DI)?",
    a: "Container injecting dependencies into classes.",
  },
  { q: "What is Spring Bean?", a: "Object managed by Spring container." },
  { q: "Bean Scopes?", a: "Singleton, Prototype, Request, Session." },
  { q: "What is '@Autowired'?", a: "Injecting dependencies automatically." },
  { q: "What is '@Component'?", a: "Generic stereotype for managed beans." },
  {
    q: "Controller vs Service vs Repository?",
    a: "Web entry vs Business logic vs Data access.",
  },
  {
    q: "What is '@SpringBootApplication'?",
    a: "Combines Config, AutoConfig, and Scan.",
  },
  {
    q: "What is 'Auto-Configuration'?",
    a: "Configuring beans based on classpath jars.",
  },
  { q: "What is 'Starter' project?", a: "Convenient dependency descriptor." },
  { q: "What is 'Actuator'?", a: "Monitoring and managing Spring Boot apps." },
  { q: "What is 'DevTools'?", a: "Tools for faster development (hot swap)." },
  {
    q: "What is 'Profiles'?",
    a: "Configuration for different environments (dev/prod).",
  },
  {
    q: "What is 'Spring AOP'?",
    a: "Aspect-oriented programming (logging, auth).",
  },
  { q: "What is 'Aspect'?", a: "Modularization of cross-cutting concern." },
  { q: "What is 'JoinPoint'?", a: "Point where aspect can be applied." },
  { q: "What is 'Advice'?", a: "Action taken at a JoinPoint." },
  { q: "What is 'Spring MVC'?", a: "Web framework for Model-View-Controller." },
  {
    q: "What is 'DispatcherServlet'?",
    a: "Core servlet handling all requests.",
  },
  {
    q: "What is '@RestController'?",
    a: "Controller specialized for APIs (JSON).",
  },
  {
    q: "What is 'Spring Data JPA'?",
    a: "Abstraction over JPA for data access.",
  },
  {
    q: "What is 'Repository' intersection?",
    a: "Defining logic by method name (findByFirstname).",
  },
  {
    q: "What is 'Hibernate'?",
    a: "ORM framework (Object-Relational Mapping).",
  },
  { q: "What is 'Entity'?", a: "Class mapped to a database table." },
  {
    q: "What is 'JPA'?",
    a: "Java Persistence API - the standard specification.",
  },
  {
    q: "What is 'Spring Security'?",
    a: "Authentication and and Authorization framework.",
  },
  { q: "What is 'Interceptors'?", a: "Code running before/after requests." },
  {
    q: "What is 'Rest template' vs 'WebClient'?",
    a: "Synchronous vs Reactive web client.",
  },
  { q: "What is 'Eureka'?", a: "Netflix service for discovery." },
  { q: "What is 'Zuul'?", a: "Gateway for routing and security." },
  { q: "What is 'Hystrix'?", a: "Library for latency and fault tolerance." },
  { q: "What is 'Feign'?", a: "Declarative REST client." },
  { q: "What is 'Config Server'?", a: "Centralized configuration management." },
  {
    q: "What is 'Spring Cloud'?",
    a: "Tools for building distributed systems.",
  },
  { q: "What is 'Microlearning'?", a: "Breaking content into small pieces." },
  { q: "What is '@Value'?", a: "Injecting properties into fields." },
  { q: "What is '@Configuration'?", a: "Class defining bean methods." },
  { q: "What is '@Bean'?", a: "Defining a bean manually in config." },
  {
    q: "What is '@Qualifier'?",
    a: "Selecting specific bean from multiple of same type.",
  },
  { q: "What is '@Primary'?", a: "Marking default bean." },
  { q: "What is 'Spring Batch'?", a: "Framework for bulk data processing." },
  {
    q: "What is 'Spring Reactive'?",
    a: "Building non-blocking apps (Project Reactor).",
  },
  {
    q: "What is 'Netty'?",
    a: "Async event-driven network framework used in Reactive.",
  },
  {
    q: "What is 'JWT' in Spring context?",
    a: "Used for securing REST APIs stateless.",
  },
  { q: "What is 'Liquibase'?", a: "DB migration tool." },
  {
    q: "What is 'Dockerizing' Spring app?",
    a: "Running Spring Boot in a container.",
  },
  {
    q: "What is 'Maven lifecycle'?",
    a: "Compile, Test, Package, Install, Deploy.",
  },
  {
    q: "What is 'Maven Surefire Plugin'?",
    a: "Plugin for running unit tests during build.",
  },
  {
    q: "What is 'Maven Failsafe Plugin'?",
    a: "Plugin for running integration tests.",
  },
  {
    q: "What is 'Fat Jar' (Uber Jar)?",
    a: "A JAR file that contains the application and all its dependencies.",
  },
  {
    q: "What is 'Shading' in Maven?",
    a: "Renaming packages to avoid dependency conflicts.",
  },
  {
    q: "What is 'Gradle'?",
    a: "An open-source build automation system that uses a Domain-Specific Language (DSL) based on Groovy or Kotlin.",
  },
  {
    q: "What is 'Bill of Materials' (BOM)?",
    a: "A special kind of POM used to control the versions of a project’s dependencies and provide a central place to define and update those versions.",
  },
  {
    q: "What is 'Spring Initializr'?",
    a: "A web-based tool provided by the Spring team to bootstrap Spring Boot projects.",
  },
  {
    q: "What is '@ConditionalOnProperty'?",
    a: "Allows you to enable/disable beans based on application property values.",
  },
  {
    q: "What is '@ConditionalOnClass'?",
    a: "Enables a bean only if a specific class is present on the classpath (used in auto-config).",
  },
  {
    q: "What is 'Spring Boot CLI'?",
    a: "A command-line tool that you can use to quickly prototype with Spring.",
  },
  {
    q: "What is 'Spring Boot Admin'?",
    a: "A community project to manage and monitor Spring Boot applications with a nice UI.",
  },
  {
    q: "What is 'Prometheus' in Spring Boot?",
    a: "A popular monitoring system that collects metrics from Actuator via an endpoint.",
  },
  {
    q: "What is 'Micrometer'?",
    a: "An application metrics facade for the most popular monitoring systems (like SLF4J for metrics).",
  },
  {
    q: "What is 'Spring Cloud Gateway'?",
    a: "A library for building API Gateways on top of Spring WebFlux.",
  },
  {
    q: "What is 'Spring Cloud Sleuth'?",
    a: "Implements distributed tracing for Spring Cloud applications (replaced by Micrometer Tracing).",
  },
  {
    q: "What is 'Spring Cloud OpenFeign'?",
    a: "Integrates Netflix Feign for declarative REST clients in Spring Boot.",
  },
  {
    q: "What is 'Spring Cloud LoadBalancer'?",
    a: "Client-side load balancer provided by the Spring Cloud project.",
  },
  {
    q: "What is 'Resilience4j'?",
    a: "A lightweight fault tolerance library inspired by Netflix Hystrix, designed for Java 8 and functional programming.",
  },
  {
    q: "What is 'Spring Batch' ItemReader?",
    a: "Interface used to read data from a source (DB, File, etc.).",
  },
  {
    q: "What is 'Spring Batch' ItemProcessor?",
    a: "Used to transform or validate data during batch processing.",
  },
  {
    q: "What is 'Spring Batch' ItemWriter?",
    a: "Interface used to write data to a destination.",
  },
  {
    q: "What is 'Chunk' in Spring Batch?",
    a: "A specific number of items read, processed, and written in a single transaction.",
  },
  {
    q: "What is 'Tasklet' in Spring Batch?",
    a: "Used for simple, non-item based tasks (like cleaning directories).",
  },
  {
    q: "What is 'Spring Integration'?",
    a: "An extension of the Spring programming model to support the Enterprise Integration Patterns.",
  },
  {
    q: "What is 'Spring WebFlux'?",
    a: "A non-blocking, reactive-stack web framework.",
  },
  {
    q: "What is 'Project Reactor'?",
    a: "A fourth-generation reactive library, based on the Reactive Streams specification, for building non-blocking applications on the JVM.",
  },
  {
    q: "What is 'Mono' in Reactor?",
    a: "A reactive stream that emits 0 or 1 element.",
  },
  {
    q: "What is 'Flux' in Reactor?",
    a: "A reactive stream that emits 0 to N elements.",
  },
  {
    q: "What is 'Backpressure' in Reactive Streams?",
    a: "A mechanism that allows the consumer to signal to the producer how much data it can handle.",
  },
  {
    q: "What is 'Netty'?",
    a: "The default underlying web server for Spring WebFlux.",
  },
  {
    q: "What is 'R2DBC'?",
    a: "Reactive Relational Database Connectivity - bringing reactive programming to SQL databases.",
  },
  {
    q: "What is 'Spring Security' Filter Chain?",
    a: "A series of filters that process Every request to implement security.",
  },
  {
    q: "What is 'SecurityContextHolder'?",
    a: "Where Spring Security stores the details of the currently authenticated user.",
  },
  {
    q: "What is 'AuthenticationProvider'?",
    a: "Interface that performs actual authentication (e.g., DaoAuthenticationProvider).",
  },
  {
    q: "What is 'UserDetailsService'?",
    a: "Core interface which loads user-specific data (usernames, passwords, authorities).",
  },
  {
    q: "What is 'GrantedAuthority'?",
    a: "Represents a permission or role granted to a user.",
  },
  {
    q: "What is 'CSRF' protection in Spring Security?",
    a: "Enabled by default, it requires a token for state-changing requests (POST, PUT, DELETE).",
  },
  {
    q: "What is 'CORS' in Spring Security?",
    a: "Configures which cross-origin requests are allowed to your app.",
  },
  {
    q: "What is 'JWT' Secret Key vs Private Key?",
    a: "HMAC (Secret) uses same key to sign/verify; RSA/ECDSA (Private) uses key pair.",
  },
  {
    q: "What is 'Spring Data REST'?",
    a: "Automatically exports Spring Data repositories as RESTful resources.",
  },
  {
    q: "What is 'Hibernate' Second Level Cache?",
    a: "A cache that is shared across multiple sessions (SessionFactory scope).",
  },
  {
    q: "What is 'Hibernate' Query Cache?",
    a: "Caches the results of a query, mapping query + parameters to a list of IDs.",
  },
  {
    q: "What is 'N+1 Select Problem' in Hibernate?",
    a: "When one query for a parent entity causes N additional queries for its children.",
  },
  {
    q: "How to fix N+1 in Hibernate?",
    a: "Use join fetch, entity graphs, or batch fetching.",
  },
  {
    q: "What is 'LazyInitializationException'?",
    a: "Occurs when you try to access a lazy-loaded relationship outside of an active session.",
  },
  {
    q: "What is 'Dirty Checking' in Hibernate?",
    a: "Automatic detection of changes to persistent objects so they can be synchronized with the DB.",
  },
  {
    q: "What is 'Pessimistic Locking' in JPA?",
    a: "Using database-level locks (e.g., SELECT ... FOR UPDATE).",
  },
  {
    q: "What is 'Optimistic Locking' in JPA?",
    a: "Using a @Version field to detect concurrent modifications.",
  },
  {
    q: "What is 'Criteria API'?",
    a: "A type-safe way to define queries programmatically in JPA.",
  },
  {
    q: "What is 'QueryDSL'?",
    a: "A framework that allows the construction of type-safe SQL-like queries.",
  },
  {
    q: "What is 'MapStruct'?",
    a: "A code generator that greatly simplifies the implementation of mappings between Java bean types (DTOs to Entities).",
  },
  {
    q: "What is 'Lombok'?",
    a: "A library that uses annotations to generate boilerplate code like getters, setters, and constructors.",
  },
  {
    q: "What is 'JUnit 5' Jupiter?",
    a: "The core programming and extension model for writing tests in JUnit 5.",
  },
  {
    q: "What is 'Mockito' when() thenReturn()?",
    a: "Defining the behavior of a mock object.",
  },
  {
    q: "What is 'Mockito' verify()?",
    a: "Checking if a specific method was called on a mock.",
  },
  {
    q: "What is 'Mockito' ArgumentCaptor?",
    a: "Allows you to capture the actual arguments passed to a mock method for further assertion.",
  },
  {
    q: "What is 'Testcontainers'?",
    a: "A library that supports JUnit tests by providing lightweight, throwaway instances of common databases, etc. via Docker.",
  },
  {
    q: "What is 'Spring Boot Test' Slice?",
    a: "@WebMvcTest, @DataJpaTest, @JsonTest are used to test only a specific layer.",
  },
  {
    q: "What is 'MockMvc'?",
    a: "Main entry point for server-side Spring MVC test support, allowing you to execute requests.",
  },
  {
    q: "What is 'JVM Option' -Xmx and -Xms?",
    a: "Maximum and starting heap size.",
  },
  { q: "What is 'JVM Option' -Xss?", a: "Specifies the thread stack size." },
  {
    q: "What is 'Metaspace' in Java 8?",
    a: "The memory area where class metadata is stored (replaces PermGen).",
  },
  {
    q: "What is 'Java Memory Model' (JMM)?",
    a: "Specifies how threads interact through memory and which behaviors are legal in multi-threaded code.",
  },
  {
    q: "What is 'Happens-Before' relationship?",
    a: "A guarantee that memory writes by one specific statement are visible to another specific statement.",
  },
  {
    q: "What is 'Double-Checked Locking'?",
    a: "A pattern used to reduce overhead in lazy initialization (must use volatile).",
  },
  {
    q: "What is 'AtomicReference'?",
    a: "Provides a way to update an object reference atomically.",
  },
  {
    q: "What is 'LongAdder'?",
    a: "A better alternative to AtomicLong under high contention, using multiple cells.",
  },
  {
    q: "What is 'ThreadLocal'?",
    a: "Provides thread-local variables, where each thread has its own, independently initialized copy.",
  },
  {
    q: "What is 'CountDownLatch'?",
    a: "A synchronization aid that allows one or more threads to wait until a set of operations being performed in other threads completes.",
  },
  {
    q: "What is 'CyclicBarrier'?",
    a: "Allows a set of threads to all wait for each other to reach a common barrier point.",
  },
  {
    q: "What is 'Semaphore'?",
    a: "Controls access to a shared resource by a whole number of permits.",
  },
  {
    q: "What is 'Exchanger'?",
    a: "Allows two threads to exchange objects at a synchronization point.",
  },
  {
    q: "What is 'Phaser'?",
    a: "A more flexible, reusable synchronization barrier that supports variable numbers of parties.",
  },
  {
    q: "What is 'ForkJoinPool'?",
    a: "Designed for work that can be broken down recursively into smaller pieces.",
  },
  {
    q: "What is 'CompletableFuture'?",
    a: "A Future that may be explicitly completed (setting its value and status), and can be used as a CompletionStage.",
  },
  {
    q: "What is 'Virtual Threads' (Project Loom) motivation?",
    a: "Supporting high-throughput concurrent applications with a simpler thread-per-request model.",
  },
  {
    q: "What is 'Structured Concurrency' in Java 21?",
    a: "Treating groups of related tasks running in different threads as a single unit of work.",
  },
  {
    q: "What is 'Scoped Values'?",
    a: "An alternative to ThreadLocal for sharing data between threads in a structured way.",
  },
  {
    q: "What is 'Foreign Function & Memory API' (Project Panama)?",
    a: "Allows Java programs to interoperate more easily with code and data outside of the Java runtime.",
  },
  {
    q: "What is 'Vector API'?",
    a: "Platform-agnostic API for expressing vector computations (SIMD).",
  },
  {
    q: "What is 'ZGC' (Z Garbage Collector)?",
    a: "A scalable low-latency garbage collector designed to handle very large heaps (terabytes).",
  },
  {
    q: "What is 'Shenandoah GC'?",
    a: "Another low-pause GC that performs concurrent evacuation.",
  },
  {
    q: "What is 'G1 GC' Pause Time Goal?",
    a: "A soft real-time goal for GC pause duration.",
  },
  {
    q: "What is 'CMS' (Concurrent Mark Sweep) status?",
    a: "Deprecated and removed in recent JDK versions in favor of G1.",
  },
  {
    q: "What is 'Java Flight Recorder' (JFR)?",
    a: "A tool for collecting diagnostic and profiling data about a running Java application.",
  },
  {
    q: "What is 'JDK Mission Control' (JMC)?",
    a: "The UI for analyzing JFR recordings.",
  },
  {
    q: "What is 'jstack'?",
    a: "Prints Java stack traces of Java threads for a given Java process.",
  },
  {
    q: "What is 'jmap'?",
    a: "Prints shared object memory maps or heap memory details of a given process.",
  },
  {
    q: "What is 'jstat'?",
    a: "Displays performance statistics for a monitorable HotSpot JVM.",
  },
];
