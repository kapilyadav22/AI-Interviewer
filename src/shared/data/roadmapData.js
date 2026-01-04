export const ROADMAP_CATEGORIES = {
  ALGORITHMS: {
    id: "algorithms",
    title: "Algorithmic Patterns",
    icon: "Code2",
    description: "Master the most frequent coding interview patterns.",
    items: [
      {
        title: "Sliding Window",
        difficulty: "Medium",
        description: "Used for problems involving subarrays or substrings.",
        logic: "Maintain a window that grows or shrinks based on conditions.",
        code: `function slidingWindow(arr, k) {
  let windowSum = 0, maxSum = 0;
  let start = 0;
  
  for (let end = 0; end < arr.length; end++) {
    windowSum += arr[end];
    if (end >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[start];
      start++;
    }
  }
  return maxSum;
}`,
      },
      {
        title: "Two Pointers",
        difficulty: "Easy",
        description: "Efficiently processing sorted arrays or linked lists.",
        logic:
          "Initialize two pointers and move them toward each other or at different speeds.",
        code: `function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    sum < target ? left++ : right--;
  }
  return [];
}`,
      },
      {
        title: "BFS (Breadth First Search)",
        difficulty: "Medium",
        description: "Level-order traversal for trees and graphs.",
        logic: "Use a Queue to process nodes level by level.",
        code: `function bfs(root) {
  if (!root) return [];
  const queue = [root], result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}`,
      },
    ],
  },
  SYSTEM_DESIGN: {
    id: "system-design",
    title: "System Design Blueprints",
    icon: "Network",
    description: "Architecting scalable, fault-tolerant systems.",
    items: [
      {
        title: "Rate Limiter",
        difficulty: "Hard",
        description: "Preventing abuse of APIs.",
        logic:
          "Token Bucket, Leaking Bucket, or Fixed/Sliding Window counters.",
        components: ["Redis (Storage)", "Middleware", "HTTP 429 Responses"],
        tradeoffs: "Distributed consistency vs. Latency.",
      },
      {
        title: "URL Shortener",
        difficulty: "Medium",
        description: "Generating tiny aliases for long URLs.",
        logic: "Base62 encoding of an auto-incrementing ID or MD5 hashing.",
        components: ["RDBMS (Mapping)", "NoSQL (Caching)", "Redirect Handler"],
        tradeoffs: "Read-heavy vs. Write-heavy optimization.",
      },
    ],
  },
  REACT: {
    id: "react",
    title: "React Performance",
    icon: "Zap",
    description: "Optimizing rendering and state management.",
    items: [
      {
        title: "memo vs. useMemo",
        difficulty: "Medium",
        description: "Preventing unnecessary re-renders.",
        logic: "memo is for components; useMemo is for values.",
        code: `// Value memoization
const heavyValue = useMemo(() => compute(data), [data]);

// Component memoization
const MyComp = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});`,
      },
      {
        title: "Virtualization",
        difficulty: "Medium",
        description: "Rendering only visible items in a long list.",
        logic:
          "Calculate window offset and render a tiny fraction of the total DOM.",
        libs: ["react-window", "react-virtualized"],
      },
    ],
  },
};
