export const LANGUAGES = {
  javascript: { name: "javascript", version: "18.15.0", label: "JavaScript" },
  python: { name: "python", version: "3.10.0", label: "Python" },
  java: { name: "java", version: "15.0.2", label: "Java" },
  c: { name: "c", version: "10.2.0", label: "C" },
  cpp: { name: "cpp", version: "10.2.0", label: "C++" },
  react: { name: "react", version: "18.2.0", label: "React (Sandpack)" },
};

export const DEFAULT_CODE = {
  javascript: `// JavaScript\nconsole.log("Hello, World!");\n`,
  python: `# Python\nprint("Hello, World!")\n`,
  java: `// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
  c: `// C\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
  cpp: `// C++\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n`,
  react: `// React capabilities are powered by Sandpack\n// Select React in the dropdown to launch the environment.`,
};

export const executeCode = async (language, sourceCode, input = "") => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s client-side timeout

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: language.name,
        version: language.version,
        files: [
          {
            content: sourceCode,
          },
        ],
        stdin: input,
        run_timeout: 3000, // 3s execution timeout
        compile_timeout: 10000, // 10s compile timeout
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Failed to execute code");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Execution timed out (client-side limit)");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
