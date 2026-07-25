import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { portalModalFieldSx, portalModalSendButtonSx } from "../Common/portalModalStyles";
import PortalDialog from "../Common/PortalDialog";
import PortalModalSelect from "../Common/PortalModalSelect";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import AppSnackbar from "../Common/AppSnackbar";

const CLASS_OPTIONS = [
  { value: "JB", label: "Junior Beginner" },
  { value: "JI", label: "Junior Intermediate" },
  { value: "JA", label: "Junior Advanced" },
  { value: "SB", label: "Senior Beginner" },
  { value: "SI", label: "Senior Intermediate" },
  { value: "SA", label: "Senior Advanced" },
  { value: "DS", label: "Data Science" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "GD", label: "Game Development" },
  { value: "AD", label: "App Development" },
  { value: "DM", label: "Data Management" },
  { value: "ST", label: "PSAT" },
  { value: "AT", label: "ACT" },
  { value: "ED", label: "Engineering Design" },
];

const pickField = (item, ...keys) => {
  if (item == null || typeof item !== "object") return "";
  for (const key of keys) {
    const value = item[key];
    if (value != null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
};

// Legacy InstructorInfo: FirstName~#LastName~#Email~#Phone~#Type~#Class~#Section~#ChapterID~#Status
const parseInstructorInfo = (info) => {
  if (!info || typeof info !== "string") return {};
  const parts = info.split("~#");
  return {
    firstName: (parts[0] || "").trim(),
    lastName: (parts[1] || "").trim(),
    emailID: (parts[2] || "").trim(),
    contactPhone: (parts[3] || "").trim(),
    instructorType: (parts[4] || "").trim(),
    class: (parts[5] || "").trim(),
    section: (parts[6] || "").trim(),
    chapterID: (parts[7] || "").trim(),
    memberStatus: (parts[8] || "").trim(),
  };
};

const normalizeMemberStatus = (status) => {
  if (status === null || status === undefined || status === "") return "1";
  const value = String(status).trim().toLowerCase();
  if (value === "1" || value === "active") return "1";
  if (value === "0" || value === "inactive" || value === "deactive") return "0";
  return "1";
};

const normalizeInstructorType = (type) => {
  if (!type) return "P";
  const value = String(type).trim();
  const byLabel = {
    Primary: "P",
    Secondary: "S",
    Coordinator: "C",
    Volunteer: "V",
    Volunteers: "V",
  };
  return byLabel[value] || (/^[PSCV]$/i.test(value) ? value.toUpperCase() : "P");
};

const normalizeClassCode = (classValue) => {
  if (!classValue) return "JB";

  let value = String(classValue).trim();
  if (!value) return "JB";

  const comboMatch = value.match(/^([A-Za-z]{2})[\s-]/);
  if (comboMatch) {
    value = comboMatch[1].toUpperCase();
  }

  const exactMatch = CLASS_OPTIONS.find(
    (option) => option.value.toLowerCase() === value.toLowerCase(),
  );
  if (exactMatch) return exactMatch.value;

  const labelMatch = CLASS_OPTIONS.find(
    (option) => option.label.toLowerCase() === value.toLowerCase(),
  );
  if (labelMatch) return labelMatch.value;

  if (/psat|sat/i.test(value)) return "ST";

  const partialMatch = CLASS_OPTIONS.find((option) => {
    const label = option.label.toLowerCase();
    const normalized = value.toLowerCase();
    return label.includes(normalized) || normalized.includes(label);
  });
  if (partialMatch) return partialMatch.value;

  return /^[A-Za-z]{2}$/.test(value) ? value.toUpperCase() : "JB";
};

const resolveInstructorClass = (instructor, parsedInfo) => {
  const rawClass =
    pickField(instructor, "class", "Class", "className", "ClassName") ||
    (parsedInfo?.class ?? "");

  if (!rawClass) return "JB";

  return normalizeClassCode(rawClass);
};

const getClassLabel = (classCode) => {
  const match = CLASS_OPTIONS.find((option) => option.value === classCode);
  return match?.label ?? classCode;
};

const ensureClassCode = (classCode) => {
  const normalized = normalizeClassCode(classCode);
  return CLASS_OPTIONS.some((option) => option.value === normalized)
    ? normalized
    : "JB";
};

const getChapterNameOnly = (chapter) =>
  String(
    chapter?.name ??
      chapter?.Name ??
      chapter?.chapterName ??
      chapter?.ChapterName ??
      "",
  ).trim();

const getChapterOptionValue = (chapter) =>
  String(chapter?.value ?? chapter?.chapterID ?? chapter?.ChapterID ?? "").trim();

/** Display: prefer server Label, else Name - Location - City (AMC_ChapterMaster). */
const getChapterOptionLabel = (chapter) => {
  const label = String(chapter?.label ?? chapter?.Label ?? "").trim();
  if (label) return label;

  const name = getChapterNameOnly(chapter);
  const loc = String(chapter?.location ?? chapter?.Location ?? "").trim();
  const city = String(chapter?.city ?? chapter?.City ?? "").trim();
  return [name, loc, city].filter(Boolean).join(" - ");
};

const ensureChapterID = (chapterID, chapters, chapterName = "") => {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    return chapterID ? String(chapterID) : "";
  }

  const normalizedId = chapterID ? String(chapterID) : "";
  if (normalizedId) {
    const byId = chapters.find(
      (chapter) => getChapterOptionValue(chapter) === normalizedId,
    );
    if (byId) return getChapterOptionValue(byId);
  }

  const normalizedName = String(chapterName || "").trim().toLowerCase();
  if (normalizedName) {
    const byName = chapters.find((chapter) => {
      const name = getChapterNameOnly(chapter).trim().toLowerCase();
      return (
        name === normalizedName ||
        name.includes(normalizedName) ||
        normalizedName.includes(name)
      );
    });
    if (byName) return getChapterOptionValue(byName);
  }

  return normalizedId;
};

const resolveChapterID = (instructor, parsedInfo, chapters) => {
  const chapterID =
    pickField(instructor, "chapterID", "ChapterID") ||
    parsedInfo.chapterID ||
    "";
  const chapterName = pickField(instructor, "chapterName", "ChapterName");

  return ensureChapterID(chapterID, chapters, chapterName);
};

const getChapterLabel = (chapterID, chapters) => {
  if (!chapterID || !Array.isArray(chapters)) return "";
  const match = chapters.find(
    (chapter) => getChapterOptionValue(chapter) === String(chapterID),
  );
  return match ? getChapterOptionLabel(match) : "";
};

const InstructorForm = ({
  open,
  onClose,
  onSubmit,
  instructor,
  chapters,
  isEdit,
}) => {
  const [formData, setFormData] = useState({
    instructorID: 0,
    firstName: "",
    lastName: "",
    emailID: "",
    contactPhone: "",
    chapterID: "",
    classCode: "JB",
    section: "A",
    instructorType: "P",
    memberStatus: "1",
  });

  const [errors, setErrors] = useState({});
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("error");

  // Class options (alias for dropdown rendering)
  const classOptions = CLASS_OPTIONS;

  // Instructor type options
  const typeOptions = [
    { value: "P", label: "Primary" },
    { value: "S", label: "Secondary" },
    { value: "C", label: "Coordinator" },
    { value: "V", label: "Volunteer" },
  ];

  // Status options
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  // Section options
  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
  ];

  // Initialize form data when the modal opens
  useEffect(() => {
    if (!open) return;

    if (instructor && isEdit) {
      const parsedInfo = parseInstructorInfo(
        instructor.instructorInfo ?? instructor.InstructorInfo,
      );
      const chapterID = resolveChapterID(instructor, parsedInfo, chapters);
      const classCode = ensureClassCode(
        resolveInstructorClass(instructor, parsedInfo),
      );
      const sectionRaw =
        pickField(instructor, "section", "Section") ||
        parsedInfo.section ||
        "A";
      const typeRaw =
        pickField(instructor, "instructorType", "InstructorType") ||
        parsedInfo.instructorType ||
        "P";
      const statusRaw =
        pickField(instructor, "memberStatus", "MemberStatus") ||
        parsedInfo.memberStatus ||
        "1";

      setFormData({
        instructorID: instructor.instructorID ?? instructor.InstructorID ?? 0,
        firstName:
          pickField(instructor, "firstName", "FirstName") ||
          parsedInfo.firstName ||
          "",
        lastName:
          pickField(instructor, "lastName", "LastName") ||
          parsedInfo.lastName ||
          "",
        emailID:
          pickField(instructor, "emailID", "EmailID") || parsedInfo.emailID || "",
        contactPhone:
          pickField(instructor, "contactPhone", "ContactPhone") ||
          parsedInfo.contactPhone ||
          "",
        chapterID,
        classCode,
        section: sectionRaw || "A",
        instructorType: normalizeInstructorType(typeRaw),
        memberStatus: normalizeMemberStatus(statusRaw),
      });
    } else {
      // Reset form for new instructor
      setFormData({
        instructorID: 0,
        firstName: "",
        lastName: "",
        emailID: "",
        contactPhone: "",
        chapterID:
          chapters && chapters.length > 0
            ? getChapterOptionValue(chapters[0])
            : "",
        classCode: "JB",
        section: "A",
        instructorType: "P",
        memberStatus: "1",
      });
    }
    setErrors({});
  }, [instructor, isEdit, open, chapters]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }

    if (!formData.emailID.trim()) {
      newErrors.emailID = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailID)) {
      newErrors.emailID = "Invalid email format";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact Phone is required";
    }

    if (!formData.chapterID) {
      newErrors.chapterID = "Chapter is required";
    }

    if (!formData.classCode) {
      newErrors.classCode = "Class is required";
    }

    if (!formData.section) {
      newErrors.section = "Section is required";
    }

    if (!formData.instructorType) {
      newErrors.instructorType = "Instructor Type is required";
    }

    if (!formData.memberStatus) {
      newErrors.memberStatus = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        instructorID: Number(formData.instructorID ?? 0),
        firstName: String(formData.firstName ?? "").trim(),
        lastName: String(formData.lastName ?? "").trim(),
        emailID: String(formData.emailID ?? "").trim(),
        contactPhone: String(formData.contactPhone ?? "").trim(),
        chapterID: String(formData.chapterID ?? "").trim(),
        class: String(formData.classCode ?? "").trim(),
        classCode: String(formData.classCode ?? "").trim(),
        section: String(formData.section ?? "A").trim(),
        instructorType: String(formData.instructorType ?? "P").trim(),
        memberStatus: String(formData.memberStatus ?? "1").trim(),
      });
      handleClose();
    } catch (error) {
      showSnackbar(
        error.message || "An error occurred while saving the instructor",
        "error",
      );
    }
  };

  // Handle close
  const handleClose = () => {
    setFormData({
      instructorID: 0,
      firstName: "",
      lastName: "",
      emailID: "",
      contactPhone: "",
      chapterID: "",
      classCode: "JB",
      section: "A",
      instructorType: "P",
      memberStatus: "1",
    });
    setErrors({});
    onClose();
  };

  if (!open) return null;

  const formFields = (
    <Box>
      <Grid container spacing={2}>
        {/* Contact fields — single row */}
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
            size="small"
            sx={portalModalFieldSx}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
            size="small"
            sx={portalModalFieldSx}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Email ID"
            name="emailID"
            type="email"
            value={formData.emailID}
            onChange={handleChange}
            error={!!errors.emailID}
            helperText={errors.emailID}
            required
            size="small"
            sx={portalModalFieldSx}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Contact Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            error={!!errors.contactPhone}
            helperText={errors.contactPhone}
            required
            size="small"
            sx={portalModalFieldSx}
          />
        </Grid>

        {/* Row 2: Chapter on its own line */}
        <Grid item xs={12}>
          <Tooltip
            title={
              getChapterLabel(
                ensureChapterID(
                  formData.chapterID,
                  chapters,
                  pickField(instructor || {}, "chapterName", "ChapterName"),
                ),
                chapters,
              ) || "Select chapter"
            }
            placement="top-start"
            enterDelay={400}
          >
            <Box sx={{ width: "100%", minWidth: 0 }}>
              <FormControl
                fullWidth
                error={!!errors.chapterID}
                required
                size="small"
                sx={{ ...portalModalFieldSx, width: "100%", minWidth: 0 }}
              >
                <InputLabel id="instructor-chapter-label">Chapter</InputLabel>
                <PortalModalSelect
                  labelId="instructor-chapter-label"
                  name="chapterID"
                  value={ensureChapterID(
                    formData.chapterID,
                    chapters,
                    pickField(instructor || {}, "chapterName", "ChapterName"),
                  )}
                  onChange={handleChange}
                  label="Chapter"
                  renderValue={(selected) =>
                    getChapterLabel(selected, chapters) || selected
                  }
                >
                  {chapters && chapters.length > 0 ? (
                    chapters.map((chapter) => {
                      const chapterValue = getChapterOptionValue(chapter);
                      const chapterLabel = getChapterOptionLabel(chapter);
                      return (
                        <MenuItem
                          key={chapterValue}
                          value={chapterValue}
                          title={chapterLabel}
                        >
                          {chapterLabel}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="">No chapters available</MenuItem>
                  )}
                </PortalModalSelect>
                {errors.chapterID && (
                  <Typography variant="caption" color="error">
                    {errors.chapterID}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </Tooltip>
        </Grid>

        {/* Row 3: Type, Class, Section, Status */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "nowrap" }}>
            <FormControl
              fullWidth
              error={!!errors.instructorType}
              required
              size="small"
              sx={{ ...portalModalFieldSx, flex: 1, minWidth: 0 }}
            >
              <InputLabel>Type</InputLabel>
              <PortalModalSelect
                name="instructorType"
                value={formData.instructorType}
                onChange={handleChange}
                label="Type"
              >
                {typeOptions.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
              {errors.instructorType && (
                <Typography variant="caption" color="error">
                  {errors.instructorType}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={!!errors.classCode}
              required
              size="small"
              sx={{ ...portalModalFieldSx, flex: 1.4, minWidth: 0 }}
            >
              <InputLabel id="instructor-class-label">Class</InputLabel>
              <PortalModalSelect
                labelId="instructor-class-label"
                name="classCode"
                value={ensureClassCode(formData.classCode)}
                onChange={handleChange}
                label="Class"
                renderValue={(selected) => getClassLabel(selected)}
              >
                {classOptions.map((classOption) => (
                  <MenuItem key={classOption.value} value={classOption.value}>
                    {classOption.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
              {errors.classCode && (
                <Typography variant="caption" color="error">
                  {errors.classCode}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={!!errors.section}
              required
              size="small"
              sx={{ ...portalModalFieldSx, flex: 0.7, minWidth: 0 }}
            >
              <InputLabel>Section</InputLabel>
              <PortalModalSelect
                name="section"
                value={formData.section || "A"}
                onChange={handleChange}
                label="Section"
              >
                {sectionOptions.map((section) => (
                  <MenuItem key={section.value} value={section.value}>
                    {section.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
              {errors.section && (
                <Typography variant="caption" color="error">
                  {errors.section}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={!!errors.memberStatus}
              required
              size="small"
              sx={{ ...portalModalFieldSx, flex: 1, minWidth: 0 }}
            >
              <InputLabel>Status</InputLabel>
              <PortalModalSelect
                name="memberStatus"
                value={formData.memberStatus}
                onChange={handleChange}
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
              {errors.memberStatus && (
                <Typography variant="caption" color="error">
                  {errors.memberStatus}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
    <PortalDialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      ariaLabelledby="instructor-form-dialog-title"
      title={isEdit ? "Update Instructor" : "Add Instructor"}
      icon={
        isEdit ? (
          <EditIcon sx={{ fontSize: 20 }} />
        ) : (
          <PersonAddIcon sx={{ fontSize: 20 }} />
        )
      }
      actions={
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={portalModalSendButtonSx}
        >
          {isEdit ? "Update" : "Add"}
        </Button>
      }
    >
      {formFields}
    </PortalDialog>
    <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </>
  );
};

export default InstructorForm;
