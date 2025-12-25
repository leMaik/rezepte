import fs from "fs";
import path from "path";
import slugify from "slugify";

const DATA_DIR = path.resolve("./recipes");
const OUT_FILE = path.resolve("cookManifest.ts");

function walk(dir, base = []) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    const rel = [...base, e.name];

    if (e.name === "examples") {
      return [];
    }

    if (e.isDirectory()) {
      return walk(full, rel);
    }

    if (e.name.endsWith(".cook")) {
      const slug = rel.map((path) =>
        slugify(path)
          .toLowerCase()
          .replace(/.cook$/, "")
      );
      return [
        {
          importPath: "@recipes/" + rel.join("/"),
          slug,
          name: e.name.replace(/\.cook$/, ""),
          categories: rel,
        },
      ];
    }

    return [];
  });
}

const entries = walk(DATA_DIR);

const lines = [];
lines.push("// AUTO-GENERATED – DO NOT EDIT");
lines.push("export const cookManifest = [");

for (const e of entries) {
  lines.push(
    `  { name: "${e.name}", categories: ["${e.categories
      .slice(0, -1)
      .join('", "')}"], slug: "${e.slug.join("/")}", source: require("${
      e.importPath
    }").default as string },`
  );
}

lines.push("] as const;");

fs.writeFileSync(OUT_FILE, lines.join("\n"));
console.log("✔ cookManifest generated");
