export const backendCards = [
  // --- Core Backend & Architecture (1-40) ---
  {
    q: "What is a Microservices architecture?",
    a: "Loosely coupled services communicating via APIs.",
  },
  { q: "Monolith vs Microservices?", a: "Single unit vs distributed units." },
  {
    q: "What is Load Balancing?",
    a: "Distributing traffic to prevent server overload.",
  },
  {
    q: "Horizontal vs Vertical Scaling?",
    a: "Adding nodes vs adding power to a node.",
  },
  {
    q: "What is a Reverse Proxy?",
    a: "Forwarding client requests (e.g., Nginx).",
  },
  {
    q: "What is 'Idempotency'?",
    a: "Request result is same if executed once or multiple times.",
  },
  {
    q: "Circuit Breaker pattern?",
    a: "Stopping requests to a failing service.",
  },
  {
    q: "Saga pattern?",
    a: "Managing distributed transactions with compensations.",
  },
  { q: "What is 'CQRS'?", a: "Command Query Responsibility Segregation." },
  { q: "What is 'Event Sourcing'?", a: "Storing state changes as events." },
  {
    q: "Explain 'CAP Theorem'.",
    a: "Pick two: Consistency, Availability, Partition Tolerance.",
  },
  {
    q: "What is 'Distributed Tracing'?",
    a: "Tracking requests across services.",
  },
  {
    q: "What is 'API Gateway'?",
    a: "Entry point for all requests to a microservice ecosystem.",
  },
  {
    q: "What is 'Service Discovery'?",
    a: "Services finding each other dynamically (e.g., Consul).",
  },
  { q: "What is 'REST'?", a: "Representational State Transfer arch style." },
  {
    q: "What is 'GraphQL'?",
    a: "Query language for APIs (ask for data needed).",
  },
  { q: "What is 'gRPC'?", a: "High performance RPC framework using Protobuf." },
  { q: "What is 'SOAP'?", a: "XML-based legacy messaging protocol." },
  {
    q: "What is 'Websockets'?",
    a: "Bi-directional, persistent communication protocol.",
  },
  {
    q: "What is 'Server-Sent Events' (SSE)?",
    a: "One-way streaming from server to client.",
  },
  {
    q: "What is 'Stateless' vs 'Stateful'?",
    a: "Stateless doesn't store session info; stateful does.",
  },
  { q: "What is 'Rate Limiting'?", a: "Throttling requests to prevent abuse." },
  { q: "What is 'Caching'?", a: "Storing data temporarily for faster access." },
  { q: "What is 'CDN'?", a: "Content Delivery Network for global content." },
  {
    q: "What is 'Message Queue'?",
    a: "Buffer for async communication (RabbitMQ).",
  },
  { q: "What is 'Topic' (Kafka)?", a: "Stream of related events." },
  {
    q: "What is 'Partition' (Kafka)?",
    a: "Subset of a topic for parallel processing.",
  },
  { q: "What is 'Replication'?", a: "Copying data for redundancy." },
  { q: "What is 'Failover'?", a: "Switching to a standby system on failure." },
  { q: "What is 'Elasticity'?", a: "Ability to scale up/down automatically." },
  {
    q: "What is 'Multitenancy'?",
    a: "Sharing infrastructure for multiple customers/users.",
  },
  { q: "What is 'Containers'?", a: "Isolated runtime environments (Docker)." },
  {
    q: "What is 'Orchestration'?",
    a: "Managing containers at scale (Kubernetes).",
  },
  { q: "What is 'Serverless'?", a: "Vendor-managed compute (FaaS)." },
  { q: "What is 'Sidecar'?", a: "Helper container attached to a main app." },
  {
    q: "What is 'Service Mesh'?",
    a: "Layer for managing service communication.",
  },
  {
    q: "What is 'Zero Trust'?",
    a: "Security model: trust no one, verify everything.",
  },
  {
    q: "What is 'Blue-Green Deployment'?",
    a: "Running two environments and switching.",
  },
  {
    q: "What is 'Canary Release'?",
    a: "Gradual rollout to small user subset.",
  },
  { q: "What is 'A/B Testing'?", a: "Comparing two versions of a feature." },

  // --- Databases (41-80) ---
  { q: "What is ACID?", a: "Atomicity, Consistency, Isolation, Durability." },
  {
    q: "What is BASE?",
    a: "Basically Available, Soft state, Eventual consistency.",
  },
  { q: "SQL vs NoSQL?", a: "Relational vs Non-relational." },
  {
    q: "What is 'Normalization'?",
    a: "Reducing data redundancy (1NF, 2NF, 3NF).",
  },
  {
    q: "What is 'Denormalization'?",
    a: "Adding redundancy for read performance.",
  },
  { q: "What is 'Indexing'?", a: "Data structure for fast retrieval." },
  { q: "What is 'Primary Key'?", a: "Unique identifier for a row." },
  { q: "What is 'Foreign Key'?", a: "Link between two tables." },
  { q: "What is 'Join'?", a: "Combining data from multiple tables." },
  {
    q: "What is 'Transaction'?",
    a: "Unit of work that succeeds or fails as a whole.",
  },
  {
    q: "What is 'Isolation Level'?",
    a: "Degree to which transactions are isolated (Read Committed, etc.).",
  },
  {
    q: "What is 'Optimistic Locking'?",
    a: "Check for conflict during update.",
  },
  {
    q: "What is 'Pessimistic Locking'?",
    a: "Lock record before modification.",
  },
  { q: "What is 'Sharding'?", a: "Horizontal partitioning of data." },
  { q: "What is 'Replication Lag'?", a: "Delay between master and slave DBs." },
  {
    q: "What is 'Consistent Hashing'?",
    a: "Mapping data to nodes for elastic sharding.",
  },
  { q: "What is 'Redis'?", a: "In-memory database and cache." },
  { q: "What is 'MongoDB'?", a: "Document-based NoSQL database." },
  { q: "What is 'Cassandra'?", a: "Wide-column, highly available DB." },
  { q: "What is 'Elasticsearch'?", a: "Search and analytics engine." },
  { q: "What is 'Database Proxy'?", a: "Pooler for DB connections." },
  {
    q: "What is 'Wal' (Write Ahead Log)?",
    a: "Logging changes before committing to data files.",
  },
  {
    q: "What is 'Checkpoint'?",
    a: "Flushing logged changes to stable storage.",
  },
  {
    q: "What is 'Stored Procedure'?",
    a: "Code stored and executed inside DB.",
  },
  { q: "What is 'Trigger'?", a: "Auto-executing code on DB event." },
  { q: "What is 'View'?", a: "Virtual table based on a query." },
  { q: "What is 'Materialized View'?", a: "View with cached query results." },
  {
    q: "What is 'OLTP'?",
    a: "Online Transaction Processing (many small updates).",
  },
  { q: "What is 'OLAP'?", a: "Online Analytical Processing (complex reads)." },
  {
    q: "What is 'Columnar Storage'?",
    a: "Storing data by column (good for OLAP).",
  },
  {
    q: "What is 'Time Series' DB?",
    a: "Optimized for timestamped data (InfluxDB).",
  },
  { q: "What is 'Graph' DB?", a: "Optimized for relationships (Neo4j)." },
  {
    q: "What is 'Vector' DB?",
    a: "Optimized for AI/Embedding search (Pinecone)..",
  },
  { q: "What is 'Database Migration'?", a: "Versioning schema changes." },
  {
    q: "What is 'Connection Pooling'?",
    a: "Reusing DB connections for performance.",
  },
  {
    q: "What is 'LSM Tree'?",
    a: "Optimized for writes (Log-Structured Merge).",
  },
  { q: "What is 'B-Tree'?", a: "Optimized for reads/searches." },
  {
    q: "What is 'Deadlock'?",
    a: "Two transactions waiting on each other's locks.",
  },
  {
    q: "What is 'Zombie Process'?",
    a: "Finished process that stays in the table.",
  },
  { q: "What is 'Orphan Process'?", a: "Process whose parent has finished." },
  {
    q: "What is 'Process Control Block' (PCB)?",
    a: "Data structure used by OS to store all information about a process.",
  },
  {
    q: "What is 'Context Switch'?",
    a: "The process of storing the state of a process so that it can be restored and resume execution at a later point.",
  },
  {
    q: "What is 'Message Broker' vs 'Task Queue'?",
    a: "Brokers manage message routing between services; Queues manage asynchronous execution of tasks.",
  },
  {
    q: "What is 'AMQP'?",
    a: "Advanced Message Queuing Protocol (used by RabbitMQ).",
  },
  {
    q: "What is 'MQTT'?",
    a: "Message Queuing Telemetry Transport - lightweight protocol for IoT.",
  },
  { q: "What is 'STOMP'?", a: "Simple Text Oriented Messaging Protocol." },
  {
    q: "Explain 'Backpressure'.",
    a: "A resistance or force opposing the desired flow of data in a software system (telling the producer to slow down).",
  },
  {
    q: "What is 'TCP Flow Control'?",
    a: "Prevents a fast sender from overwhelming a slow receiver using a sliding window.",
  },
  {
    q: "What is 'TCP Congestion Control'?",
    a: "Prevents the network from being overwhelmed using algorithms like Slow Start.",
  },
  {
    q: "What is 'QUIC' protocol?",
    a: "UDP-based multiplexed and secure transport protocol.",
  },
  {
    q: "What is 'OSI Model' Layers?",
    a: "Physical, Data Link, Network, Transport, Session, Presentation, Application.",
  },
  {
    q: "What is 'TCP' vs 'UDP'?",
    a: "Reliable, connection-oriented vs Unreliable, connectionless.",
  },
  {
    q: "What is 'DNS'?",
    a: "Domain Name System - maps hostnames to IP addresses.",
  },
  {
    q: "What is 'BGP' (Border Gateway Protocol)?",
    a: "Manages how packets are routed across the internet.",
  },
  {
    q: "What is 'ICMP'?",
    a: "Internet Control Message Protocol (used by ping).",
  },
  {
    q: "What is 'Anycast'?",
    a: "Routing where packets are sent to the nearest node among a group of potential receivers.",
  },
  {
    q: "What is 'Geographic Load Balancing'?",
    a: "Directing users to the datacenter closest to them.",
  },
  {
    q: "What is 'Layer 4 Load Balancing'?",
    a: "Load balancing at the transport layer (TCP/UDP port).",
  },
  {
    q: "What is 'Layer 7 Load Balancing'?",
    a: "Load balancing at the application layer (URL, headers, cookies).",
  },
  {
    q: "What is 'SSL Termination'?",
    a: "Decrypting SSL traffic at the load balancer before sending it to the web server.",
  },
  {
    q: "What is 'SSL Passthrough'?",
    a: "Sending encrypted traffic directly to the web server without decryption at the load balancer.",
  },
  {
    q: "What is 'Stick Session' (Session Affinity)?",
    a: "Ensuring all requests from a user are sent to the same server.",
  },
  {
    q: "What is 'Heartbeat' mechanism?",
    a: "Periodic signal to check the availability of a service or node.",
  },
  {
    q: "What is 'Gossip Protocol'?",
    a: "A method for nodes in a distributed system to spread information via peer-to-peer communication.",
  },
  {
    q: "What is 'Leader Election'?",
    a: "The process of designating a single node as the organizer or coordinator.",
  },
  {
    q: "What is 'Raft' Consensus Algorithm?",
    a: "A consensus algorithm designed as an alternative to Paxos, focusing on understandability.",
  },
  {
    q: "What is 'Paxos'?",
    a: "A family of protocols for reaching consensus in a network of unreliable or fallible processors.",
  },
  {
    q: "What is 'Split Brain' in distributed systems?",
    a: "When a cluster divides and both sides think they are the master.",
  },
  {
    q: "What is 'Quorum'?",
    a: "The minimum number of votes that a distributed transaction has to obtain in order to proceed.",
  },
  {
    q: "What is 'Write Concern' in MongoDB?",
    a: "The level of acknowledgment requested from the database for write operations.",
  },
  {
    q: "What is 'Read Preference'?",
    a: "Controls how the driver routes read operations to members of a replica set.",
  },
  {
    q: "What is 'Vector Clock'?",
    a: "An algorithm for generating a partial ordering of events in a distributed system and detecting causality violations.",
  },
  {
    q: "What is 'Lamport Timestamp'?",
    a: "A simple logical clock algorithm used to determine the order of events.",
  },
  {
    q: "What is 'Distributed Lock'?",
    a: "A lock mechanism shared across multiple processes or nodes (often using Redis or Zookeeper).",
  },
  {
    q: "What is 'Redlock' algorithm?",
    a: "A distributed lock implementation for Redis clusters.",
  },
  {
    q: "What is 'Two-Phase Commit' (2PC)?",
    a: "A type of atomic commitment protocol used in distributed systems.",
  },
  {
    q: "What is 'Three-Phase Commit' (3PC)?",
    a: "A non-blocking extension of 2PC.",
  },
  {
    q: "What is 'Compensating Transaction'?",
    a: "Undoing an action if a later step in a long-running process fails (used in Sagas).",
  },
  {
    q: "What is 'Sidecar Pattern'?",
    a: "Deploying helper services (proxy, monitoring) alongside the main application container.",
  },
  {
    q: "What is 'Ambassador Pattern'?",
    a: "A helper container that manages connectivity to external services.",
  },
  {
    q: "What is 'Adapter Pattern' in containers?",
    a: "Standardizing the output or interface of a container for external monitoring.",
  },
  {
    q: "What is 'Strangler Fig Pattern'?",
    a: "Gradually migrating a legacy system by replacing features with new services.",
  },
  {
    q: "What is 'CQRS' Read/Write split?",
    a: "Using different models and databases for reading and writing data.",
  },
  {
    q: "What is 'Materialized View' in CQRS?",
    a: "A pre-computed view of data optimized for specific queries.",
  },
  {
    q: "What is 'Eventual Consistency'?",
    a: "A promise that if no new updates are made, all accesses will eventually return the same value.",
  },
  {
    q: "What is 'Strong Consistency'?",
    a: "All nodes see the same data at the same time.",
  },
  {
    q: "What is 'Causal Consistency'?",
    a: "Ensuring that operations that are causally related are seen by all processes in the same order.",
  },
  {
    q: "What is 'Read-Your-Writes Consistency'?",
    a: "Ensuring that a user always sees their own updates immediately.",
  },
  {
    q: "What is 'Session Consistency'?",
    a: "Ensuring read-your-writes within the scope of a user session.",
  },
  {
    q: "What is 'Monotonic Reads'?",
    a: "Ensuring that if a user has seen a certain version of data, they will never see an older version.",
  },
  {
    q: "What is 'Monotonic Writes'?",
    a: "Ensuring that writes by a single process are executed in the order they were issued.",
  },
  {
    q: "What is 'Write-Ahead Log' (WAL)?",
    a: "A family of techniques for providing atomicity and durability by logging changes before applying them.",
  },
  {
    q: "What is 'Log-Structured Merge Tree' (LSM)?",
    a: "A data structure with performance characteristics that make it attractive for providing indexed access to data with high insert volume.",
  },
  {
    q: "What is 'Bloom Filter'?",
    a: "A space-efficient probabilistic data structure used to test whether an element is a member of a set (may have false positives, never false negatives).",
  },
  {
    q: "What is 'Cuckoo Filter'?",
    a: "An alternative to Bloom filters that supports deletion.",
  },
  {
    q: "What is 'HyperLogLog'?",
    a: "An algorithm for the count-distinct problem, approximating the number of unique elements in a set.",
  },
  {
    q: "What is 'T-digest'?",
    a: "An algorithm for estimating quantiles (like 99th percentile) on high-throughput data.",
  },
  {
    q: "What is 'Circuit Breaker' Open/Closed/Half-Open states?",
    a: "Closed (normal), Open (failing), Half-Open (testing recovery).",
  },
  {
    q: "What is 'Bulkhead Pattern'?",
    a: "Isolating elements of an application into pools so that if one fails, others continue to function.",
  },
  {
    q: "What is 'Throttling' vs 'Rate Limiting'?",
    a: "Rate limiting prevents excessive requests; Throttling slows down processing to match capacity.",
  },
  {
    q: "What is 'Leaky Bucket' algorithm?",
    a: "A rate limiting algorithm where requests are processed at a constant rate from a bucket.",
  },
  {
    q: "What is 'Token Bucket' algorithm?",
    a: "A rate limiting algorithm where tokens are added to a bucket periodically; requests consume tokens.",
  },
  {
    q: "What is 'Fixed Window' rate limiting?",
    a: "Counters reset at fixed time intervals (can lead to bursts at window edges).",
  },
  {
    q: "What is 'Sliding Window' rate limiting?",
    a: "Smooths out bursts by tracking the rate over a moving time window.",
  },
  {
    q: "What is 'Backoff' strategy?",
    a: "Waiting longer between retries after a failure (Exponential Backoff).",
  },
  {
    q: "What is 'Jitter' in retries?",
    a: "Adding randomness to backoff times to avoid 'thundering herd' problems.",
  },
  {
    q: "What is 'Thundering Herd' problem?",
    a: "When many processes wake up at once and overwhelm a resource.",
  },
  {
    q: "What is 'Idempotency Key'?",
    a: "A unique value passed by the client to ensure an operation is only performed once even if retried.",
  },
  {
    q: "What is 'API Versioning' strategies?",
    a: "URI path (/v1/), Query param (?v=1), Custom header, or Accept header (media type).",
  },
  {
    q: "What is 'Hateoas'?",
    a: "Hypermedia as the Engine of Application State - providing links to related resources in API responses.",
  },
  {
    q: "What is 'Postel's Law'? (Robustness Principle)",
    a: "Be conservative in what you send, be liberal in what you accept.",
  },
  {
    q: "What is 'GraphQL Introspection'?",
    a: "Querying a GraphQL API for information about its own schema.",
  },
  {
    q: "What is 'N+1 Problem' in GraphQL?",
    a: "When a field resolver causes a database query for every item in a list.",
  },
  {
    q: "What is 'DataLoader'?",
    a: "A batching and caching library used to solve the N+1 problem in GraphQL.",
  },
  {
    q: "What is 'Protobuf' (Protocol Buffers)?",
    a: "A language-neutral, platform-neutral, extensible mechanism for serializing structured data (used by gRPC).",
  },
  {
    q: "What is 'Apache Thrift'?",
    a: "A binary communication protocol and serialization framework.",
  },
  {
    q: "What is 'Avro'?",
    a: "A binary serialization format used extensively in the Hadoop ecosystem.",
  },
  {
    q: "What is 'Schema Registry'?",
    a: "A service for storing and managing versions of schemas for binary data formats.",
  },
  {
    q: "What is 'Message Deduplication'?",
    a: "Ensuring that 'exactly once' delivery is achieved by filtering redundant messages.",
  },
  {
    q: "What is 'Outbox Pattern'?",
    a: "Atomically updating a database and publishing an event by using an outbox table.",
  },
  {
    q: "What is 'Dead Letter Queue' (DLQ)?",
    a: "A service where messages that cannot be processed are sent for debugging.",
  },
  {
    q: "What is 'Poison Message'?",
    a: "A message that causes a consumer to fail repeatedly.",
  },
  {
    q: "What is 'Compaction' in Kafka?",
    a: "Retaining only the latest value for each key in a topic.",
  },
  {
    q: "What is 'Log Segment'?",
    a: "A physical file in Kafka where messages are stored.",
  },
  {
    q: "What is 'Zookeeper' role in Kafka?",
    a: "Managing cluster membership, controller election, and configuration (legacy, replaced by KRaft).",
  },
  {
    q: "What is 'KRaft'?",
    a: "Kafka's built-in consensus mechanism that removes the dependency on Zookeeper.",
  },
  {
    q: "What is 'Elasticsearch Inverted Index'?",
    a: "Mapping words to the documents they appear in for fast search.",
  },
  {
    q: "What is 'Term Frequency / Inverse Document Frequency' (TF-IDF)?",
    a: "A scoring algorithm used to rank search results.",
  },
  {
    q: "What is 'Vector Search'?",
    a: "Searching for similar data using embeddings and distance metrics (e.g., cosine similarity).",
  },
  {
    q: "What is 'RAG' (Retrieval-Augmented Generation)?",
    a: "Enhancing AI models by providing them with retrieved context from a database.",
  },
];
