import "server-only";
import { glob } from "glob";
import { unstable_cache } from "next/cache";
import slugify from "slugify";
import fs from "fs/promises";
import { Recipe } from "cooklang-parser";
import { basename } from "path";
import React from "react";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import { RecipeView } from "./Recipe";

function getSlug(recipePath: string) {
  const slug = recipePath
    .split("/")
    .slice(2)
    .map((path) =>
      slugify(path)
        .toLowerCase()
        .replace(/.cook$/, "")
    );
  return {
    path: recipePath,
    name: basename(recipePath).replace(/\.cook$/, ""),
    categories: recipePath.split("/").slice(2, -1),
    slug,
    fullSlug: slug.join("/"),
  };
}

function getRecipes() {
  return unstable_cache(
    async () => (await glob("../recipes/**/*.cook")).map(getSlug),
    ["recipes"]
  )();
}

export async function generateStaticParams() {
  const recipes = await getRecipes();
  const categories = new Set(
    recipes.flatMap((recipe) => recipe.categories.join("/"))
  );

  return [
    { slug: [""] },
    ...[...categories.values()].map((category) => ({
      slug: category.split("/").map((path) =>
        slugify(path)
          .toLowerCase()
          .replace(/.cook$/, "")
      ),
    })),
    ...recipes.map((recipe) => ({
      slug: recipe.slug,
    })),
  ];
}

export async function generateMetadata(
  { params: { slug } }: { params: { slug: string[] } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (slug) {
    const recipes = await getRecipes();
    const recipeData = recipes.find(
      (recipe) => recipe.fullSlug === slug.join("/")
    );
    if (recipeData) {
      return {
        title: recipeData.name,
      };
    }

    const match = recipes.find((recipe) =>
      recipe.fullSlug.startsWith(slug.join("/"))
    );
    if (match) {
      return {
        title: match.categories.join(" / "),
      };
    }
  }
  return {
    title: "Rezepte",
  };
}

export default async function RecipePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const recipes = await getRecipes();
  const recipeData = recipes.find(
    (recipe) => recipe.fullSlug === params.slug?.join("/")
  );
  const recipeText = recipeData
    ? await fs.readFile(recipeData.path, "utf8")
    : null;

  if (recipeText) {
    const recipe = Recipe(recipeText);
    return <RecipeView name={recipeData.name} recipe={recipe} />;
  }

  return (
    <>
      <ul>
        {recipes
          .filter((recipe) =>
            params.slug
              ? recipe.fullSlug.startsWith(params.slug.join("/"))
              : true
          )
          .sort((a, b) => a.name.localeCompare(b.name, "de-DE"))
          .map((r, i) => (
            <li key={i}>
              <Link href={`/recipes/${r.fullSlug}`}>{r.name}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}
