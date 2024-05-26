const words: Record<string, { plural: string; variants?: string[] }> = {
  Ei: {
    plural: "Eier",
  },
  Minute: {
    plural: "Minuten",
  },
  "Roter Spitzpaprika": {
    plural: "Rote Spitzpaprika",
    variants: ["Roten Spitzpaprika"],
  },
  Schüssel: {
    plural: "Schüsseln",
  },
};

export function pluralize(word: string, count: number | string) {
  if (typeof count !== "number") {
    return word;
  }
  if (count === 1) {
    return word;
  }
  return getPlural(word);
}

export function getPlural(word: string) {
  return (
    words[word]?.plural ??
    Object.values(words).find((entry) => entry.variants?.includes(word))
      ?.plural ??
    word
  );
}
