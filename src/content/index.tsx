import { StrictMode } from "preact/compat";
import { createRoot } from "preact/compat/client";
import { Badge } from "./badge";
import "../index.css";
// import { subscribe } from "../storage/mark";
// import { applyMarks } from "./marks";

const main = () => {
  const container = document.createElement("webmarker-container");
  document.body.after(container);

  // applyMarks();

  // subscribe(async () => {
  //   await onAddMark();
  // });

  createRoot(container).render(
    <StrictMode>
      <Badge />
    </StrictMode>
  );
};

main();
