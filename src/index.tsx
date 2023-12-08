import {createRoot} from "react-dom/client";
import App from "./App";
import * as React from "react";
import {StrictMode} from "react";

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App/>
  </StrictMode>
)

