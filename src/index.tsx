import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootswatch/dist/journal/bootstrap.min.css";

ReactDOM.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
