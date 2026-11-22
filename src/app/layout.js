import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import LayoutShell from "@/components/LayoutShell";

export const metadata = {
  title: "GearGrid | Equipment Rental Platform",
  description:
    "Browse, book, and rent verified construction, photography, vehicle, agriculture, electronics, and event equipment securely.",
};

const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('geargrid-theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
