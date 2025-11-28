export function formatName(firstName, lastName) {
  const trimmedFirst = firstName?.trim?.();
  const trimmedLast = lastName?.trim?.();
  const full = [trimmedFirst, trimmedLast].filter(Boolean).join(" ").trim();
  return full || "Nome Sobrenome";
}

export function normalizeSelection(values) {
  if (!Array.isArray(values)) return [];
  return Array.from(
    new Set(
      values
        .filter(Boolean)
        .map((v) => (typeof v === "string" ? v.trim() : v))
        .filter(Boolean)
    )
  );
}
