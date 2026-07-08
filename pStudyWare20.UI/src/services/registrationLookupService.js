import api from "./api";
import { formatSemesterLabel } from "../utils/semesterFormat";
import {
  formatLocationDropdownLabel,
  formatLocationEmailLabel,
} from "../utils/registrationFormat";

const toDropdownOption = (option) => {
  const value = String(option?.value ?? option?.Value ?? "").trim();
  const rawLabel = String(option?.label ?? option?.Label ?? "").trim();
  const label =
    rawLabel && rawLabel.toLowerCase() !== value.toLowerCase()
      ? rawLabel
      : formatSemesterLabel(value);

  return {
    id: value,
    name: label || value,
  };
};

class RegistrationLookupService {
  async getSemesters() {
    const response = await api.get("/RegistrationLookup/semesters");
    const payload = response.data ?? {};
    const options = payload.semesters ?? payload.Semesters ?? [];

    if (!payload.isSuccess && options.length === 0) {
      throw new Error(payload.errorMessage || "Failed to load semester options");
    }

    return options.map(toDropdownOption).filter((option) => option.id);
  }

  async getLocations() {
    const response = await api.get("/RegistrationLookup/locations");
    const payload = response.data ?? {};
    const options = payload.locations ?? payload.Locations ?? [];

    if (!payload.isSuccess && options.length === 0) {
      throw new Error(payload.errorMessage || "Failed to load location options");
    }

    return options
      .map((option) => {
        const id = Number(option?.chapterId ?? option?.ChapterId ?? 0);
        const name = String(option?.name ?? option?.Name ?? "").trim();
        const location = String(option?.location ?? option?.Location ?? "").trim();
        const city = String(option?.city ?? option?.City ?? "").trim();
        const label = formatLocationDropdownLabel({
          chapterId: id,
          name,
          location,
          city,
          label: option?.label ?? option?.Label,
        });
        const emailLabel = formatLocationEmailLabel({
          name,
          location,
          emailLabel: option?.emailLabel ?? option?.EmailLabel,
        });

        return { id, name: label, emailLabel, chapterName: name, location, city };
      })
      .filter((option) => option.id > 0);
  }
}

export default new RegistrationLookupService();
