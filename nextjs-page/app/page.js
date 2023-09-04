"use client";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Maiks Rezeptsammlung</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <a href="/recipes">
            <h3>Recipes &rarr;</h3>
            <p>Cook something nice.</p>
          </a>
        </div>
      </main>

      <footer>
        <a target="_blank" rel="noopener noreferrer">
          Powered by Next.js and Cooklang.
        </a>
      </footer>
    </div>
  );
}
