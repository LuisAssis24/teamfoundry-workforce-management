import React, {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap-icons/font/bootstrap-icons.css"; // 👈 importa aqui
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
