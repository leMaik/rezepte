import { Recipe } from "cooklang-parser";
import { Metadata, ResolvingMetadata } from "next";
import "server-only";
import slugify from "slugify";
import { cookManifest as recipes } from "../../../cookManifest";
import { RecipeView } from "./Recipe";
import RecipeList from "./RecipeList";

export async function generateStaticParams() {
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
      slug: recipe.slug.split("/"),
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
    const recipeData = recipes.find((recipe) => recipe.slug === slug.join("/"));
    if (recipeData) {
      return {
        title: recipeData.name,
      };
    }

    const match = recipes.find((recipe) =>
      recipe.slug.startsWith(slug.join("/"))
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
  const recipeData = recipes.find(
    (recipe) => recipe.slug === params.slug?.join("/")
  );
  const recipeText = recipeData?.source;

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
    ? recipes.filter((recipe) => recipe.slug.startsWith(params.slug.join("/")))
    : recipes;

  return (
    <RecipeList
      categories={params.slug ? matchingRecipes[0]!.categories : []}
      recipes={matchingRecipes}
    />
  );
}
