"use client";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Link,
  Table,
  Typography,
} from "@mui/joy";
import type { Recipe } from "cooklang-parser";
import React, { useCallback, useMemo } from "react";
import "@fontsource/indie-flower";

type RecipeType = ReturnType<typeof Recipe>;
type IngredientToken<T = RecipeType["ingredients"][number]> = T extends {
  type: "ingredient";
}
  ? T
  : never;

export function RecipeView({
  name,
  recipe,
}: {
  name: string;
  recipe: RecipeType;
}) {
  const servingsInRecipe = useMemo(
    () => parseInt(recipe.metadata.servings as string, 10) || null,
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

  return (
    <Box sx={{ p: 1 }}>
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

        {servingsInRecipe && (
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
            <Typography
              sx={{ flex: 1, textAlign: "center", lineHeight: "32px" }}
            >
              {servings} Portionen
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
        )}
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
          {recipe.ingredients.map((ingredient, i) => (
            <tr key={i}>
              <td>
                {ingredient.quantity === "some"
                  ? "etwas"
                  : typeof ingredient.quantity === "string"
                  ? ingredient.quantity
                  : ingredient.quantity * multiplier}
                {ingredient.units && ` ${ingredient.units}`}
              </td>
              <td>{ingredient.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>

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
                          : token.quantity * multiplier}
                        {token.units && ` ${token.units}`} {token.name}
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
                      {token.name} {token.quantity}
                    </React.Fragment>
                  );
                case "timer":
                  return (
                    <React.Fragment key={tokenIndex}>
                      {token.quantity} {token.units}
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
