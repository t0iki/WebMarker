import { StrictMode } from "preact/compat";
import { createRoot } from "preact/compat/client";
import { Badge } from "./badge";
import { List } from "./list";

const main = () => {
  const root = document.createElement("div");
  const shadowRoot = root.attachShadow({ mode: "open" });
  document.body.appendChild(root);

  createRoot(shadowRoot).render(
    <StrictMode>
      <style>{`@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.0.0/dist/tailwind.min.css';`}</style>
      <Badge />
      <List />
    </StrictMode>
  );
};

main();
