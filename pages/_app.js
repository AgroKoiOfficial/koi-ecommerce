import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Provider from "@/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
        storageType="local"
        onChange={(theme) => {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }}
        getTheme={(theme) => (theme === "dark" ? "dark" : "light")}>
        <Provider>
          <Component {...pageProps} />
          <ToastContainer position="top-center" />
        </Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}
