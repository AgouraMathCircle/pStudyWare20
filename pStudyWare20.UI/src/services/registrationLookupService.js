import api from "./api";
import { formatLocationEmailLabel } from "../utils/registrationFormat";

const toSemesterOption = (option) => {
  const value = String(option?.value ?? option?.Value ?? "").trim();
  const label = String(option?.label ?? option?.Label ?? "").trim();

  return {
    id: value,
    name: label || value,
  };
};

class RegistrationLookupService {
  /**
   * Register For: id = Semester / NextSemester, name = SemesterName / NextSemesterName
   * (from AMC_spRegistrationSemesterLookup — no F/S formatting).
   */
  async getSemesters() {
    const response = await api.get("/RegistrationLookup/semesters");
    const payload = response.data ?? {};
    const options = payload.semesters ?? payload.Semesters ?? [];

    if (!payload.isSuccess && options.length === 0) {
      throw new Error(payload.errorMessage || "Failed to load semester options");
    }

    return options.map(toSemesterOption).filter((option) => option.id);
  }

  /**
   * Course/Location: id = chapterId, name/emailLabel = Name - Location - City
   */
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
        const emailLabel = formatLocationEmailLabel({
          name,
          location,
          city,
          emailLabel: option?.emailLabel ?? option?.EmailLabel ?? "",
        });
        const label = emailLabel;

        return {
          id,
          name: label,
          emailLabel,
          chapterName: name,
          location,
          city,
        };
      })
      .filter((option) => option.id > 0);
  }
}

export default new RegistrationLookupService();
