const CONTACT_MARKER = /\[\[contact\]\]/g;
// While streaming, hide a marker that has only partially arrived (e.g. "[[cont").
const PARTIAL_MARKER = /\[(\[[a-z]*\]?)?$/;

/** Hide the contact marker from displayed text. */
export const stripMarkers = (text: string, streaming: boolean) => {
  const cleaned = text.replace(CONTACT_MARKER, "");
  return (streaming ? cleaned.replace(PARTIAL_MARKER, "") : cleaned).trimEnd();
};
