import {
  Box,
  Breadcrumbs,
  Link,
  List,
  ListItemButton,
  Typography,
} from "@mui/joy";
import NextLink from "next/link";
import slugify from "slugify";

export default function RecipeList({
  categories,
  recipes,
}: {
  categories: readonly string[];
  recipes: ReadonlyArray<{
    name: string;
    categories: readonly string[];
    slug: string;
  }>;
}) {
  return (
    <Box sx={{ p: 2 }}>
      {categories.length > 0 && (
        <Breadcrumbs size="sm" sx={{ px: 0, pb: 0 }}>
          <Link component={NextLink} href="/recipes">
            Rezepte
          </Link>
          {categories.slice(0, -1).map((category, i) => (
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
      )}
      <Typography level="h3" component="h1">
        {categories.length > 0 ? categories[0] : "Rezepte"}
      </Typography>
      <List sx={{ mx: -1.5 }}>
        {recipes
          .toSorted((a, b) => a.name.localeCompare(b.name, "de-DE"))
          .map((r, i) => (
            <ListItemButton
              key={r.slug}
              component={Link}
              href={`/recipes/${r.slug}`}
              color="primary"
            >
              {r.name}
            </ListItemButton>
          ))}
      </List>
      <ul></ul>
    </Box>
  );
}
