import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import GlobalStyle from "./components/GlobalStyle/GlobalStyle.jsx";
import { store } from "@/redux/store.jsx";
import { Provider } from "react-redux";
import { WalletProvider } from "./context/WalletContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <WalletProvider>
        <GlobalStyle>
          <App />
        </GlobalStyle>
      </WalletProvider>
    </Provider>
  </StrictMode>
);
