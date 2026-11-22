import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import LayoutShell from "@/components/LayoutShell";

export const metadata = {
  title: "GearGrid | Equipment Rental Platform",
  description:
    "Browse, book, and rent verified construction, photography, vehicle, agriculture, electronics, and event equipment securely.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
