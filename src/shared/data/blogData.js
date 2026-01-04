export const BLOG_POSTS = [
  {
    id: 1,
    title: "The 2024 Guide to System Design Interviews",
    excerpt:
      "Master the art of scaling applications and handling millions of requests with our comprehensive blueprint.",
    author: "Alex Rivera",
    date: "Jan 12, 2024",
    readTime: "8 min read",
    category: "System Design",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800",
    content: `
            System design interviews are often the most intimidating part of the senior engineering loop. 
            Unlike coding questions, there is no single right answer. It's about trade-offs.

            ### 1. Requirements Clarification
            Never start drawing immediately. Ask about:
            - DAU (Daily Active Users)
            - Read/Write ratio
            - Data retention requirements

            ### 2. High-Level Design
            Start with the basic flow: Client -> Load Balancer -> API Gateway -> Service -> Database.

            ### 3. Scaling the Database
            When a single DB isn't enough, consider Sharding, Replication, or NoSQL alternatives depending on your consistency needs.
        `,
  },
  {
    id: 2,
    title: "Demystifying the Amazon Leadership Principles",
    excerpt:
      "How to anchor your STAR stories to the values that Amazon interviewers care about most.",
    author: "Sarah Chen",
    date: "Feb 05, 2024",
    readTime: "6 min read",
    category: "Behavioral",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2959213?auto=format&fit=crop&q=80&w=800",
    content: `
            Amazon doesn't just hire for skills; they hire for 'peculiarity'. 
            Their 16 Leadership Principles are the secret sauce to their culture.

            ### Customer Obsession
            Start from the customer and work backwards. Every story should mention the end-user impact.

            ### Ownership
            Never say 'that's not my job'. Show times you stepped up to solve problems outside your immediate scope.

            ### Backbone - Disagree and Commit
            Interviewers want to see that you can challenge decisions with data, but also support the team once a final decision is made.
        `,
  },
  {
    id: 3,
    title: "React 19: What You Need to Know for Your Next Interview",
    excerpt:
      "From the Compiler to Server Components, stay ahead of the curve with latest React features.",
    author: "Jordan Smith",
    date: "Mar 10, 2024",
    readTime: "10 min read",
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    content: `
            React 19 is bringing massive shifts in how we think about state and rendering.

            ### The React Compiler
            Forget about manual useMemo and useCallback. The compiler will handle optimization automatically.

            ### Server Components (RSC)
            Understanding the distinction between Client and Server components is now mandatory for any mid-to-senior role.

            ### Actions API
            Managing form state and transitions just got a whole lot cleaner with the new 'useActionState' hook.
        `,
  },
];
