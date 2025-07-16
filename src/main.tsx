import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import "./index.css";
import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { i18nConfig } from "./config/locale.ts";
import App from "./App.tsx";

i18next.init(i18nConfig);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18next}>
    <PrimeReactProvider value={{ unstyled: false, pt: {} }}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PrimeReactProvider>
  </I18nextProvider>
);
