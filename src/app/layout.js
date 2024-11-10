import "./globals.css";

export const metadata = {
  title: "My Story",
  description: "Writing Personalized Stories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        {children}
      </body>
    </html>
  );
}
