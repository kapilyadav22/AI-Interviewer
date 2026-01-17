export const normalizePath = (path) => {
  if (!path) return "/";
  let p = path.startsWith("/") ? path : "/" + path;
  return p.replace(/\/+$/, "");
};

export const buildTree = (files) => {
  const root = { name: "root", path: "/", type: "folder", children: {} };

  Object.keys(files).forEach((path) => {
    const normalizedFullPath = normalizePath(path);
    const parts = normalizedFullPath.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const currentPath = "/" + parts.slice(0, index + 1).join("/");

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: currentPath,
          type: isLast ? "file" : "folder",
          children: {},
        };
      }
      current = current.children[part];
    });
  });

  return root;
};
