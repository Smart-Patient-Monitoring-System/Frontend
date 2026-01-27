import React from "react"
import ReactDOM from "react-dom/client"
if (typeof global === 'undefined') {
  window.global = window;
}
import App from "./App"
import "./index.css"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
