import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./app/App";
import store from "./store";

const rootElement = document.getElementById("root");
if (rootElement !== null) {
    const root = createRoot(rootElement);

    root.render(
        <StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </StrictMode>
    );
}
