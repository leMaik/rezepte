"use client";
import "@fontsource/indie-flower";
import {
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Table,
  Typography,
} from "@mui/joy";
import type { Recipe } from "cooklang-parser";
import NextLink from "next/link";
import React, { useCallback, useMemo } from "react";
import slugify from "slugify";
import { pluralize } from "../../../german";

type RecipeType = ReturnType<typeof Recipe>;
type IngredientToken<T = RecipeType["ingredients"][number]> = T extends {
  type: "ingredient";
}
  ? T
  : never;

export function RecipeView({
  name,
  recipe,
  categories,
}: {
  name: string;
  recipe: RecipeType;
  categories: string[];
}) {
  const servingsInRecipe = useMemo(
    () => parseInt(recipe.metadata.servings as string, 10) || 1,
    [recipe]
  );
  const [servings, setServings] = React.useState(servingsInRecipe);
  const multiplier = servingsInRecipe ? servings / servingsInRecipe : 1;

  const handleAddServing = useCallback(() => {
    setServings((servings) => servings + 1);
  }, []);

  const handleRemoveServing = useCallback(() => {
    setServings((servings) => Math.max(1, servings - 1));
  }, []);

  const ingredients = useMemo(
    () => mergeIngredients(recipe.ingredients),
    [recipe]
  );

  const cookware = useMemo(() => mergeCookware(recipe.cookware), [recipe]);

  return (
    <Box sx={{ p: 1 }}>
      <Breadcrumbs size="sm" sx={{ px: 0 }}>
        <Link component={NextLink} href="/recipes">
          Rezepte
        </Link>
        {categories.map((category, i) => (
          <Link
            key={category}
            component={NextLink}
            href={`/recipes/${categories
              .slice(0, i + 1)
              .map((category) => slugify(category).toLowerCase())
              .join("/")}`}
          >
            {category}
          </Link>
        ))}
      </Breadcrumbs>
      <Typography level="h3" component="h1" mb={1}>
        {name}
      </Typography>
      {recipe.metadata.note && (
        <Typography
          level="body-md"
          sx={{ fontFamily: "Indie Flower", color: "#12467B", mb: 2 }}
        >
          <strong>Notiz:</strong> {recipe.metadata.note as string}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography
          level="title-lg"
          component="h2"
          sx={{ flex: 1, verticalAlign: "bottom" }}
        >
          Zutaten
        </Typography>

        <Box
          sx={{
            width: 200,
            display: "flex",
            flexDirection: "row",
            ml: 1,
            mt: -1,
          }}
        >
          <IconButton
            variant="soft"
            color="primary"
            size="sm"
            disabled={servings === 1}
            onClick={handleRemoveServing}
          >
            -
          </IconButton>
          <Typography sx={{ flex: 1, textAlign: "center", lineHeight: "32px" }}>
            {recipe.metadata.servings
              ? `${servings} Portionen`
              : servings === 1
              ? "einfache Menge"
              : servings === 2
              ? "doppelte Menge"
              : `${servings}-fache Menge`}
          </Typography>
          <IconButton
            variant="soft"
            color="primary"
            size="sm"
            onClick={handleAddServing}
          >
            +
          </IconButton>
        </Box>
      </Box>

      <Table
        stripe="odd"
        borderAxis="none"
        sx={{
          "& tr": {
            borderRadius: 6,
          },
          "& td:first-child": {
            textAlign: "right",
            width: "33.33%",
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          },
          "& td:last-child": {
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
          },
          mt: 1,
          mb: 2,
        }}
      >
        <tbody>
          {ingredients.map((ingredient, i) => (
            <tr key={i}>
              <td>
                {ingredient.quantity === "some"
                  ? "etwas"
                  : typeof ingredient.quantity === "string"
                  ? ingredient.quantity
                  : (ingredient.quantity * multiplier).toLocaleString("de-DE", {
                      maximumFractionDigits: 3,
                    })}
                {ingredient.units && `\u202f${ingredient.units}`}
              </td>
              <td>{ingredient.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {recipe.cookware.length > 0 && (
        <>
          <Typography level="title-lg" component="h2" mt={2}>
            Kochutensilien
          </Typography>
          <Typography>
            {cookware
              .map((cookware) =>
                cookware.quantity
                  ? typeof cookware.quantity === "number"
                    ? cookware.quantity === 1
                      ? cookware.name
                      : `${cookware.quantity} ${pluralize(
                          cookware.name,
                          cookware.quantity
                        )}`
                    : `${cookware.name} (${cookware.quantity})`
                  : cookware.name
              )
              .sort((a, b) => a.localeCompare(b, "de-DE"))
              .join(", ")}
          </Typography>
        </>
      )}

      <Typography level="title-lg" component="h2" mt={2}>
        Zubereitung
      </Typography>
      {recipe.steps.map((step, i) => (
        <React.Fragment key={i}>
          {step.some((token) => token.type === "ingredient") && (
            <Typography level="body-xs">
              {step
                .filter((token) => token.type === "ingredient")
                .map(
                  (token: IngredientToken, tokenIndex) =>
                    token.type === "ingredient" && (
                      <span key={tokenIndex}>
                        {tokenIndex > 0 && ", "}
                        {token.quantity === "some"
                          ? "etwas"
                          : typeof token.quantity === "string"
                          ? token.quantity
                          : (token.quantity * multiplier).toLocaleString(
                              "de-DE",
                              {
                                maximumFractionDigits: 3,
                              }
                            )}
                        {token.units && `\u202f${token.units}`} {token.name}
                      </span>
                    )
                )}
            </Typography>
          )}
          <Typography mb={2}>
            {step.map((token, tokenIndex) => {
              switch (token.type) {
                case "text":
                  return (
                    <React.Fragment key={tokenIndex}>
                      {token.value}
                    </React.Fragment>
                  );
                case "ingredient":
                  return (
                    <React.Fragment key={tokenIndex}>
                      {token.name}
                    </React.Fragment>
                  );
                case "cookware":
                  return (
                    <React.Fragment key={tokenIndex}>
                      {pluralize(token.name, token.quantity)}
                    </React.Fragment>
                  );
                case "timer":
                  return (
                    <React.Fragment key={tokenIndex}>
                      {token.quantity}
                      {`\u202f`}
                      {pluralize(token.units, token.quantity)}
                    </React.Fragment>
                  );
              }
            })}
          </Typography>
        </React.Fragment>
      ))}

      {recipe.metadata.source && (
        <Typography level="body-sm">
          Quelle:{" "}
          {(recipe.metadata.source as string).startsWith("http") ? (
            <Link
              href={recipe.metadata.source as string}
              target="_blank"
              rel="noreferrer noopener"
            >
              {new URL(recipe.metadata.source as string).host}
            </Link>
          ) : (
            (recipe.metadata.source as string)
          )}
        </Typography>
      )}
    </Box>
  );
}

function mergeIngredients(ingredients: IngredientToken[]): IngredientToken[] {
  // Merge ingredients by name and units
  const deduped = new Map<string, (typeof ingredients)[0]>();
  for (const ing of ingredients) {
    const key = `${ing.name}|${ing.units ?? ""}`;
    if (deduped.has(key)) {
      const existing = deduped.get(key)!;
      if (
        typeof existing.quantity === "number" &&
        typeof ing.quantity === "number"
      ) {
        existing.quantity += ing.quantity;
      }
    } else {
      deduped.set(key, { ...ing });
    }
  }
  return Array.from(deduped.values());
}

function mergeCookware(
  cookware: RecipeType["cookware"]
): RecipeType["cookware"] {
  const deduped = new Map<string, (typeof cookware)[0]>();
  for (const item of cookware) {
    const key = `${item.name}`;
    if (deduped.has(key)) {
      const existing = deduped.get(key)!;
      if (
        typeof existing.quantity === "number" &&
        typeof item.quantity === "number"
      ) {
        existing.quantity += item.quantity;
      }
    } else {
      deduped.set(key, { ...item });
    }
  }
  return Array.from(deduped.values());
}
