/**
 * Course/location display for registration emails and dropdowns.
 * Format: Name - Location - City
 */
export const formatLocationEmailLabel = ({
  name,
  Name,
  location,
  Location,
  city,
  City,
  emailLabel,
  EmailLabel,
}) => {
  const removeCourseIdPrefix = (value) => {
    const text = String(value || "").trim();
    const match = text.match(/^\d+\s*-\s*(.+)$/);
    return match ? match[1].trim() : text;
  };

  return [
    removeCourseIdPrefix(name || Name || emailLabel || EmailLabel),
    String(location || Location || "").trim(),
    String(city || City || "").trim(),
  ]
    .filter(Boolean)
    .join(" - ");
};
