export const formatDate = (dateString?: Date | null) => {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};