import { StrictMode } from "preact/compat";
import { createRoot } from "preact/compat/client";
import { Badge } from "./badge";

const container = document.createElement("webmarker-container");
document.body.after(container);

createRoot(container).render(
  <StrictMode>
    <Badge />
  </StrictMode>
);
