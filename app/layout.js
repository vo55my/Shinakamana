import "@/styles/globals.css";

export const metadata = {
  title: "Shinakamana - Temukan Anime Favoritmu",
  description:
    "Temukan anime favoritmu dan nikmati rekomendasi terbaik dari kami!",
  icon: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-[#202040] text-white antialiased">{children}</body>
    </html>
  );
}
