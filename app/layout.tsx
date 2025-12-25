import ThemeRegistry from "./ThemeRegistry";

export default function RootLayout(props) {
  const { children } = props;
  return (
    <html lang="de">
      <body>
        <ThemeRegistry options={{ key: "joy" }}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
