import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from "./store/store";
import { getTotals } from "./store/reducers/cartSlice";

// TanStack Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,          // 1 second fresh
      cacheTime: 1000 * 60 * 5, // 5 min cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

store.dispatch(getTotals());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();