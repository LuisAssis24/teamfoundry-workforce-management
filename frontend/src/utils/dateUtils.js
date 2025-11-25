export function formatDate(date) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("pt-PT");
  } catch {
    return date;
  }
}
