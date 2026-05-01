import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { BottomNav } from "@/components/layout/BottomNav";
import { StoryViewer } from "@/components/social/StoryViewer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center glass-medium rounded-3xl p-8">
        <h1 className="text-7xl font-semibold gold-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Адрес неверный или раздел был перенесён.
        </p>
        <a
          href="/home"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-b from-[var(--gold)] to-[var(--gold-soft)] text-black px-6 py-2.5 text-sm font-medium"
        >
          На главную
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
      },
      { title: "HOSTESS ELITE — Премиальный гид по ресторанам" },
      {
        name: "description",
        content:
          "Премиальная платформа для бронирования ресторанов, событий и закрытых ужинов в Алматы.",
      },
      { name: "theme-color", content: "#040404" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased noise">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <BottomNav />
      <StoryViewer />
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.1 0.01 270 / 0.85)",
            border: "1px solid oklch(1 0 0 / 0.1)",
            color: "oklch(0.97 0.005 80)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "16px",
          },
        }}
      />
    </>
  );
}
