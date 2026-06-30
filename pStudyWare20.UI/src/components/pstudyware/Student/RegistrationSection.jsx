import React, { useState, useEffect, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
} from "@mui/material";
import studentDashboardService from "../../../services/studentDashboardService";
import { formatSemesterLabel, formatRegistrationCloseDate } from "../../../utils/semesterFormat";

const MESSAGE_CENTER_PATH = "/pstudyware/student/message-center";
const PAGE_SIZE = 10;

const pickField = (row, ...keys) => {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return "";
};

const getRegistrationStudentId = (student) => {
  const id = pickField(student, "studentID", "studentId", "StudentID");
  const parsed = Number(id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : id;
};

const getRegistrationStatus = (student) =>
  String(pickField(student, "status", "Status", "regStatus", "RegStatus") || "").trim();

const isRegistrationOpen = (student) => {
  if (student?.canRegister === true || student?.CanRegister === true) {
    return true;
  }
  return getRegistrationStatus(student).toLowerCase() === "open";
};

const isRegistrationClosed = (student) => {
  const status = getRegistrationStatus(student).toLowerCase();
  return status.includes("closed") || status.includes("full - closed");
};

const isRegistrationWaitingList = (student) => {
  if (student?.isWaitingList === true || student?.IsWaitingList === true) {
    return true;
  }
  return getRegistrationStatus(student).toLowerCase().includes("waiting");
};

const RegistrationSection = ({
  registrationData,
  username,
  activeSemester,
  registrationCloseDate,
  onSuccess,
  onError,
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasOpenRegistration, setHasOpenRegistration] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (registrationData?.length > 0) {
      setHasOpenRegistration(registrationData.some(isRegistrationOpen));
    } else {
      setHasOpenRegistration(false);
    }
    setCurrentPage(1);
    setSelectedStudents([]);
  }, [registrationData]);

  const totalPages = Math.max(
    1,
    Math.ceil((registrationData?.length ?? 0) / PAGE_SIZE)
  );

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return (registrationData ?? []).slice(start, start + PAGE_SIZE);
  }, [registrationData, currentPage]);

  const semesterLabel = useMemo(() => {
    const fromLookup = formatSemesterLabel(activeSemester);
    if (fromLookup) {
      return fromLookup;
    }

    const fromRegistration =
      formatSemesterLabel(
        pickField(registrationData?.[0], "semester", "Semester")
      ) ||
      pickField(registrationData?.[0], "semesterName", "SemesterName");

    return fromRegistration || "the upcoming semester";
  }, [activeSemester, registrationData]);

  const sessionLabel = semesterLabel;

  const formattedCloseDate = useMemo(
    () => formatRegistrationCloseDate(registrationCloseDate),
    [registrationCloseDate]
  );

  const showDeadlineNotice = Boolean(semesterLabel && formattedCloseDate);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      const message = "Please select the student , then click the submit button.";
      setSubmitMessage(message);
      setSubmitError(true);
      onError?.(message);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError(false);

    try {
      for (const studentId of selectedStudents) {
        const response = await studentDashboardService.submitRegistration(
          studentId,
          username
        );

        if (!response.isSuccess) {
          throw new Error(response.message || "Registration failed");
        }
      }

      const successMessage =
        selectedStudents.length === 1
          ? `You have successfully registered for ${sessionLabel}.`
          : `Successfully registered ${selectedStudents.length} students for ${sessionLabel}.`;

      setSubmitMessage(successMessage);
      setSubmitError(false);
      setSelectedStudents([]);
      onSuccess?.(successMessage);
    } catch (error) {
      const errorMessage =
        error.message || "Error submitting registration. Please try again.";
      setSubmitMessage(errorMessage);
      setSubmitError(true);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="student-registration-section">
      <Box className="student-registration-warning-box">
        {showDeadlineNotice && (
          <Typography
            component="p"
            className="student-registration-deadline-notice"
          >
            The {semesterLabel}&apos;s registration will be close on {formattedCloseDate}.
            If you have any question, please contact via{" "}
            <RouterLink to={MESSAGE_CENTER_PATH}>Message Center</RouterLink>.
          </Typography>
        )}

        <Typography component="p" className="student-registration-copy">
          Your kids are on the waiting list for our {semesterLabel} because they did
          not take the final exam. The final exam is required for {semesterLabel}{" "}
          registration. Take the final exam (Class Material Section) and update the
          answer key in the update score section. After the update of the answer key,
          you will be able to register for {semesterLabel}.
        </Typography>

        <Box className="student-registration-grid-wrap">
          <TableContainer className="student-registration-table-container">
            <Table
              size="small"
              className="student-registration-grid"
              aria-label="Student registration"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" />
                  <TableCell align="center">Student Id</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Grade</TableCell>
                  <TableCell align="center">School</TableCell>
                  <TableCell align="center">Parent Name</TableCell>
                  <TableCell align="center">Class</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Available Space</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((student) => {
                  const studentId = getRegistrationStudentId(student);
                  const status = getRegistrationStatus(student);
                  const isClosed = isRegistrationClosed(student);
                  const isWaitingList = isRegistrationWaitingList(student);
                  const isOpen = isRegistrationOpen(student);

                  return (
                    <TableRow key={studentId}>
                      <TableCell align="center" padding="checkbox">
                        {isOpen ? (
                          <Checkbox
                            size="small"
                            checked={selectedStudents.includes(studentId)}
                            onChange={() => handleStudentSelection(studentId)}
                          />
                        ) : isClosed ? (
                          <Typography
                            component="span"
                            className="student-registration-status-label"
                          >
                            Closed
                          </Typography>
                        ) : isWaitingList ? (
                          <Typography
                            component="span"
                            className="student-registration-status-label"
                          >
                            Waiting List
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>{studentId}</TableCell>
                      <TableCell>
                        {pickField(student, "studentName", "StudentName")}
                      </TableCell>
                      <TableCell>
                        {pickField(student, "eventLocation", "EventLocation")}
                      </TableCell>
                      <TableCell>{pickField(student, "grade", "Grade")}</TableCell>
                      <TableCell>{pickField(student, "school", "School")}</TableCell>
                      <TableCell>
                        {pickField(student, "parentName", "ParentName")}
                      </TableCell>
                      <TableCell>{pickField(student, "class", "Class")}</TableCell>
                      <TableCell>{status || "—"}</TableCell>
                      <TableCell align="center">
                        {pickField(student, "openSpace", "OpenSpace") ?? "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box className="student-registration-pager">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    size="small"
                    variant={page === currentPage ? "contained" : "text"}
                    onClick={() => setCurrentPage(page)}
                    sx={{ minWidth: 28, px: 0.75 }}
                  >
                    {page}
                  </Button>
                );
              })}
            </Box>
          )}

          {hasOpenRegistration && (
            <Box sx={{ mt: 1.5 }}>
              <Button
                className="student-registration-submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {submitMessage && submitError && (
        <Box className="student-registration-error-box" role="alert">
          {submitMessage}
        </Box>
      )}

      {submitMessage && !submitError && (
        <Box className="student-registration-valid-box" role="status">
          {submitMessage}
        </Box>
      )}
    </Box>
  );
};

export default RegistrationSection;
