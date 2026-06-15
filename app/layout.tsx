import "./globals.css";
import MusicPlayer from "../components/MusicPlayer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <MusicPlayer />

        {children}

      </body>
    </html>
  );
}