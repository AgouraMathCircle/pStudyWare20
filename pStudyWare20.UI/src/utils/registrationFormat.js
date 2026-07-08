export const formatLocationDropdownLabel = ({
  chapterId,
  name,
  location,
  city,
  label,
  Label,
}) => {
  if (label || Label) {
    return String(label || Label).trim();
  }

  const parts = [chapterId, name, location, city]
    .map((value) => (value === undefined || value === null ? "" : String(value).trim()))
    .filter(Boolean);

  return parts.join(" - ");
};

export const formatLocationEmailLabel = ({
  name,
  Name,
  location,
  Location,
  emailLabel,
  EmailLabel,
}) => {
  if (emailLabel || EmailLabel) {
    return String(emailLabel || EmailLabel).trim();
  }

  const courseName = String(name || Name || "").trim();
  const courseLocation = String(location || Location || "").trim();

  if (courseName && courseLocation) {
    return `${courseName} - ${courseLocation}`;
  }

  return courseName || courseLocation;
};
