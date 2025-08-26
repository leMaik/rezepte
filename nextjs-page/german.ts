const words: Record<
  string,
  { plural: string; pluralWithoutNumber?: string; variants?: string[] }
> = {
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
  "Weiße Zuckerschrift": {
    plural: "Weiße Zuckerschrift",
    variants: ["weißer Zuckerschrift"],
  },
  Eigelb: {
    plural: "Eigelb",
    pluralWithoutNumber: "Eigelbe",
  },
};

function normalize(word: string) {
  return (
    Object.entries(words).find(
      ([, entry]) =>
        entry.plural === word ||
        entry.variants?.some(
          (variant) => variant.toLowerCase() === word.toLowerCase()
        )
    )?.[0] ?? word
  );
}

export function pluralize(
  word: string,
  count: number | string,
  options: { withoutNumber?: boolean } = {}
) {
  word = normalize(word);
  if (typeof count !== "number") {
    return word;
  }
  if (count === 1) {
    return word;
  }
  return getPlural(word, { withoutNumber: options.withoutNumber });
}

export function getPlural(
  word: string,
  options: { withoutNumber?: boolean } = {}
) {
  const match = words[normalize(word)];
  if (!match) {
    return word;
  }
  return options.withoutNumber
    ? match.pluralWithoutNumber ?? match.plural
    : match.plural;
}
