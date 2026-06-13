import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UpdateProfileModal from "../components/pstudyware/Common/UpdateProfileModal";
import { useAuth } from "./AuthContext";
import { getPortalDashboardPath } from "../utils/routeUtils";

const UpdateProfileModalContext = createContext(null);

export function UpdateProfileModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [savedHandler, setSavedHandler] = useState(null);

  const openUpdateProfile = useCallback((id = null, onSaved = null) => {
    setStudentId(id != null && String(id).trim() !== "" ? String(id).trim() : null);
    setSavedHandler(() => (typeof onSaved === "function" ? onSaved : null));
    setOpen(true);
  }, []);

  const closeUpdateProfile = useCallback(() => {
    setOpen(false);
    setStudentId(null);
    setSavedHandler(null);
  }, []);

  const handleSaved = useCallback(
    (formData) => {
      const handler = savedHandler?.();
      handler?.(formData);
    },
    [savedHandler],
  );

  return (
    <UpdateProfileModalContext.Provider value={{ openUpdateProfile, closeUpdateProfile }}>
      {children}
      <UpdateProfileModal
        open={open}
        onClose={closeUpdateProfile}
        studentId={studentId}
        onSaved={handleSaved}
      />
    </UpdateProfileModalContext.Provider>
  );
}

export function useUpdateProfileModal() {
  const context = useContext(UpdateProfileModalContext);
  if (!context) {
    throw new Error("useUpdateProfileModal must be used within UpdateProfileModalProvider");
  }
  return context;
}

/** Legacy /UpdateProfile/:id URLs — open modal then return to portal home. */
export function UpdateProfileRouteOpener() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openUpdateProfile } = useUpdateProfileModal();

  useEffect(() => {
    openUpdateProfile(studentId || null);
    navigate(getPortalDashboardPath(user), { replace: true });
  }, [studentId, navigate, openUpdateProfile, user]);

  return null;
}
