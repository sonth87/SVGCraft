import './globals.css';

const FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'%3E%3Crect width='32' height='32' rx='8' fill='%230d0d10'/%3E%3Cpath d='M16 4L27 10.2V21.8L16 28L5 21.8V10.2L16 4Z' stroke='%2327272a' stroke-width='1.2' stroke-dasharray='2 2'/%3E%3Cpath d='M16 6.5L24.5 11.4L16 16.3L7.5 11.4L16 6.5Z' fill='%23f97316' fill-opacity='0.22' stroke='%23f97316' stroke-width='1.6' stroke-linejoin='round'/%3E%3Cpath d='M7.5 16.2L16 21.1L24.5 16.2' stroke='%23fb923c' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M7.5 20.6L16 25.5L24.5 20.6' stroke='%236366f1' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='16' cy='6.5' r='1.8' fill='%23f97316'/%3E%3Ccircle cx='24.5' cy='11.4' r='1.8' fill='%23f97316'/%3E%3Ccircle cx='7.5' cy='11.4' r='1.8' fill='%23f97316'/%3E%3Ccircle cx='16' cy='16.3' r='2' fill='%23ffffff' stroke='%23f97316' stroke-width='1.4'/%3E%3C/svg%3E";

export const metadata = {
  title: {
    default: 'SVGCraft — Vector Icon Library, Inspector & Code Studio',
    template: '%s — SVGCraft',
  },
  description:
    '500,000+ Open-Source Vector Icons standardized by category, stroke style, Light/Dark variants, and instant code export for React JSX, Vue, HTML & PNG.',
  icons: {
    icon: FAVICON_DATA_URI,
  },
  openGraph: {
    title: 'SVGCraft — Vector Icon Library, Inspector & Code Studio',
    description:
      '500,000+ Open-Source Vector Icons standardized by category, stroke style, and instant code export for React, Vue, HTML & PNG.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body data-preview-tone="auto" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
