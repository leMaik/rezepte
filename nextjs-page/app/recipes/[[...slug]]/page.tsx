import { Recipe } from "cooklang-parser";
import fs from "fs/promises";
import { glob } from "glob";
import { Metadata, ResolvingMetadata } from "next";
import { unstable_cache } from "next/cache";
import { basename } from "path";
import "server-only";
import slugify from "slugify";
import { RecipeView } from "./Recipe";
import RecipeList from "./RecipeList";

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
    async () =>
      (await glob("../recipes/**/*.cook"))
        .filter((path) => !path.includes("examples"))
        .map(getSlug),
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
  props: { params: Promise<{ slug: string[] }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;

  const { slug } = params;

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

export default async function RecipePage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const recipes = await getRecipes();
  const recipeData = recipes.find(
    (recipe) => recipe.fullSlug === params.slug?.join("/")
  );
  const recipeText = recipeData
    ? await fs.readFile(recipeData.path, "utf8")
    : null;

  if (recipeText) {
    const recipe = Recipe(recipeText);

    return (
      <RecipeView
        name={recipeData.name}
        recipe={recipe}
        categories={recipeData.categories}
      />
    );
  }

  const matchingRecipes = params.slug
    ? recipes.filter((recipe) =>
        recipe.fullSlug.startsWith(params.slug.join("/"))
      )
    : recipes;

  return (
    <RecipeList
      categories={params.slug ? matchingRecipes[0]!.categories : []}
      recipes={matchingRecipes}
    />
  );
}
