export const getDocumentUrl = (documentId: string) =>
  documentId && `/api/Documents/${documentId}`;

export const formatNumber = (v?: number | null, toFixed?: number) => {
  const value = +(v || 0);
  return Intl.NumberFormat().format(+value.toFixed(toFixed));
};
