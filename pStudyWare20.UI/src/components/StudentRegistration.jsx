import React, { useState, useEffect } from "react";
import "../styles/StudentRegistration.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    // Parent Information
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    city: "",
    state: "",
    country: "US",
    
    // Student Information
    studentFirstName: "",
    studentLastName: "",
    studentEmail: "",
    school: "",
    grade: "0",
    session: "0",
    location: "0",
    
    // User Name Selection
    userNameType: "P", // P for Parent, S for Student
    
    // Signatures
    waiverSignature: "",
    ruleSignature: "",
    picturePermission: true,
    
    // Validation
    validEmailAddress: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [locations, setLocations] = useState([]);

  const grades = [
    { value: "0", text: "--Select--" },
    { value: "1", text: "1" },
    { value: "2", text: "2" },
    { value: "3", text: "3" },
    { value: "4", text: "4" },
    { value: "5", text: "5" },
    { value: "6", text: "6" },
    { value: "7", text: "7" },
    { value: "8", text: "8" },
    { value: "9", text: "9" },
    { value: "10", text: "10" },
    { value: "11", text: "11" },
    { value: "12", text: "12" }
  ];

  const sessions = [
    { value: "0", text: "--Select--" },
    { value: "S2025", text: "Spring Semester 2025" }
  ];

  const countries = [
    { value: "US", text: "United States" },
    { value: "CA", text: "Canada" },
    { value: "GB", text: "United Kingdom" },
    { value: "CN", text: "China" },
    { value: "IN", text: "India" },
    { value: "SG", text: "Singapore" },
    { value: "MX", text: "Mexico" },
    { value: "MY", text: "Malaysia" },
    // Add more countries as needed
  ];

  useEffect(() => {
    // Load locations from API
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      // This would be replaced with actual API call
      const mockLocations = [
        { value: "0", text: "--Select--" },
        { value: "1", text: "Agoura Math Circle - El Camino Real High School, Woodland Hills" },
        { value: "2", text: "VIRTUAL Math Circle - Internet" },
        { value: "3", text: "Irvine Math Circle - Beacon Park School, Irvine" },
        { value: "4", text: "Introduction to Artificial Intelligence - Internet , Agoura Hills" },
        { value: "6", text: "ACT - Internet , Agoura Hills" }
      ];
      setLocations(mockLocations);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Parent Information Validation
    if (!formData.parentFirstName.trim()) {
      newErrors.parentFirstName = "Please enter your First name.";
    }
    if (!formData.parentLastName.trim()) {
      newErrors.parentLastName = "Please enter your Last name.";
    }
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = "Please enter your Email Address.";
    } else if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(formData.parentEmail)) {
      newErrors.parentEmail = "Please enter a valid Parent Email ID.";
    }
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = "Please enter your Phone Number.";
    } else if (!/^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/.test(formData.parentPhone)) {
      newErrors.parentPhone = "Please enter a valid Phone No.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "Please enter City Name.";
    }
    if (!formData.state.trim()) {
      newErrors.state = "Please enter State Name.";
    }

    // Student Information Validation
    if (!formData.studentFirstName.trim()) {
      newErrors.studentFirstName = "Please enter Student First name.";
    }
    if (!formData.studentLastName.trim()) {
      newErrors.studentLastName = "Please enter Student Last name.";
    }
    if (!formData.school.trim()) {
      newErrors.school = "Please enter Student School Name.";
    }
    if (formData.grade === "0") {
      newErrors.grade = "Please select Grade.";
    }
    if (formData.session === "0") {
      newErrors.session = "Please select Session.";
    }
    if (formData.location === "0") {
      newErrors.location = "Please select Course/Location.";
    }

    // Student Email Validation
    if (formData.userNameType === "S" && !formData.studentEmail.trim()) {
      newErrors.studentEmail = "Please enter student email";
    } else if (formData.studentEmail.trim() && !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(formData.studentEmail)) {
      newErrors.studentEmail = "Please enter a valid Student Email ID.";
    }

    // Signature Validation
    if (!formData.waiverSignature.trim()) {
      newErrors.waiverSignature = "Please sign the waiver";
    }
    if (!formData.ruleSignature.trim()) {
      newErrors.ruleSignature = "Please Sign.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // This would be replaced with actual API call
      const response = await fetch('/api/studentregistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="student-registration-page">
        <div className="sc-breadcrumbs breadcrumbs-overlay">
          <div className="breadcrumbs-img">
            <img src={pageHeaderImg} alt="Breadcrumbs Image" />
          </div>
          <div className="breadcrumbs-text white-color">
            <h1 className="page-title">STUDENTS REGISTRATION</h1>
            <ul>
              <li>
                <a className="active" href="/">Home &gt;</a>
              </li>
              <li className="active">Registration &gt;</li>
              <li className="active">Student Registration</li>
            </ul>
          </div>
        </div>

        <div className="sc-about pt-20 pb-70 md-pt-40 position-relative arrow-animation-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <h4 className="heading">
                  {formData.studentFirstName} {formData.studentLastName}'s application has successfully been submitted. 
                  We will review it and update your enrollment status by email.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-registration-page">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">STUDENTS REGISTRATION</h1>
          <ul>
            <li>
              <a className="active" href="/">Home &gt;</a>
            </li>
            <li className="active">Registration &gt;</li>
            <li className="active">Student Registration</li>
          </ul>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="sc-about pt-20 pb-70 md-pt-40 position-relative arrow-animation-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h3 className="heading">Register for New Student</h3>
            </div>
          </div>

          {/* Important Notice */}
          <div className="row eng-row">
            <div className="col-lg-12">
              <div className="sec-title">
                <div className="important-notice">
                  <strong style={{ color: "red" }}>Important: </strong>
                  Registration for the Fall 2024 Semester is now closed due to full capacity. 
                  Unfortunately, no more spots are available. We invite you to register for our 
                  upcoming Spring 2025 Semester. Thank you for your interest in Agoura Math Circle! 
                  <strong style={{ color: "red" }}>Existing students, please do not use this page to register 
                  for ONLINE or ONSITE Math Circle classes. Instead, follow the separate registration 
                  instructions provided for returning students. This page is for new students only.</strong>
                </div>
                <br />
                <div className="register-now">
                  <strong style={{ color: "green" }}>Register Now:</strong>
                  Use this page to register for any type of program (
                  <a href="/test-preparation" target="_blank" style={{ color: "#0000FF" }}>
                    Test Preparation- SAT/PSAT and ACT
                  </a> and 
                  <a href="/engineering-circle" target="_blank" style={{ color: "#0000FF" }}>
                    Engineering circle - Data Science, Game Development and Artificial Intelligence
                  </a>), with the exception of existing students registering for a new semester at math circle. 
                  Please carefully choose the course and location. After you submit your application, we will 
                  review and decide based on the availability of space and eligibility.
                </div>
                <br />
                <div className="engineering-notice">
                  <strong style={{ color: "red" }}>Engineering Circle:</strong>
                  Before you apply for Agoura Engineering Circle, please review the 
                  <a href="/test-preparation" target="_blank" style={{ color: "#0000FF" }}> curriculum</a> 
                  and the criteria for eligibility and make an informed decision to see if this is the right 
                  class for you. Due to the limited available space and the challenging material, we will 
                  conduct an assessment. We will email details regarding this assessment. Based on the 
                  eligibility and performance of the student on the exam, we will decide on the student's enrollment.
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row eng-row1">
              {/* Parent Information */}
              <div className="col-lg-6">
                <div className="sec-title mb-10">
                  <h4 className="heading">Parent <span className="color2">Information</span></h4>
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>First Name</label>
                  <input
                    type="text"
                    name="parentFirstName"
                    value={formData.parentFirstName}
                    onChange={handleInputChange}
                    className={`form-control ${errors.parentFirstName ? 'error' : ''}`}
                    tabIndex="1"
                  />
                  {errors.parentFirstName && (
                    <span className="errormessage">{errors.parentFirstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Last Name</label>
                  <input
                    type="text"
                    name="parentLastName"
                    value={formData.parentLastName}
                    onChange={handleInputChange}
                    className={`form-control ${errors.parentLastName ? 'error' : ''}`}
                    tabIndex="2"
                  />
                  {errors.parentLastName && (
                    <span className="errormessage">{errors.parentLastName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Email ID</label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    className={`form-control ${errors.parentEmail ? 'error' : ''}`}
                    tabIndex="3"
                  />
                  {errors.parentEmail && (
                    <span className="errormessage">{errors.parentEmail}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Phone (999-999-9999)</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    className={`form-control ${errors.parentPhone ? 'error' : ''}`}
                    tabIndex="4"
                  />
                  {errors.parentPhone && (
                    <span className="errormessage">{errors.parentPhone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`form-control ${errors.city ? 'error' : ''}`}
                    tabIndex="5"
                  />
                  {errors.city && (
                    <span className="errormessage">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`form-control ${errors.state ? 'error' : ''}`}
                    tabIndex="6"
                  />
                  {errors.state && (
                    <span className="errormessage">{errors.state}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="form-control"
                    tabIndex="7"
                  >
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.text}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>User Name</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="userNameType"
                        value="P"
                        checked={formData.userNameType === "P"}
                        onChange={handleInputChange}
                      />
                      Parent Email as User Name Or
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="userNameType"
                        value="S"
                        checked={formData.userNameType === "S"}
                        onChange={handleInputChange}
                      />
                      Student Email as User Name
                    </label>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className="col-lg-6">
                <div className="sec-title mb-10">
                  <h4 className="heading">Student <span className="color2">Information</span></h4>
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Student First Name</label>
                  <input
                    type="text"
                    name="studentFirstName"
                    value={formData.studentFirstName}
                    onChange={handleInputChange}
                    className={`form-control ${errors.studentFirstName ? 'error' : ''}`}
                    tabIndex="8"
                  />
                  {errors.studentFirstName && (
                    <span className="errormessage">{errors.studentFirstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Student Last Name</label>
                  <input
                    type="text"
                    name="studentLastName"
                    value={formData.studentLastName}
                    onChange={handleInputChange}
                    className={`form-control ${errors.studentLastName ? 'error' : ''}`}
                    tabIndex="9"
                  />
                  {errors.studentLastName && (
                    <span className="errormessage">{errors.studentLastName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Student Email ID</label>
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    className={`form-control ${errors.studentEmail ? 'error' : ''}`}
                    tabIndex="10"
                  />
                  {errors.studentEmail && (
                    <span className="errormessage">{errors.studentEmail}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>School</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className={`form-control ${errors.school ? 'error' : ''}`}
                    tabIndex="11"
                  />
                  {errors.school && (
                    <span className="errormessage">{errors.school}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Grade</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className={`form-control ${errors.grade ? 'error' : ''}`}
                    style={{ width: "200px" }}
                    tabIndex="12"
                  >
                    {grades.map(grade => (
                      <option key={grade.value} value={grade.value}>
                        {grade.text}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <span className="errormessage">{errors.grade}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Register For</label>
                  <select
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    className={`form-control ${errors.session ? 'error' : ''}`}
                    style={{ width: "500px" }}
                    tabIndex="13"
                  >
                    {sessions.map(session => (
                      <option key={session.value} value={session.value}>
                        {session.text}
                      </option>
                    ))}
                  </select>
                  {errors.session && (
                    <span className="errormessage">{errors.session}</span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ color: "#174a10", fontWeight: "bold" }}>Course/Location</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`form-control ${errors.location ? 'error' : ''}`}
                    style={{ width: "500px" }}
                    tabIndex="14"
                  >
                    {locations.map(location => (
                      <option key={location.value} value={location.value}>
                        {location.text}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <span className="errormessage">{errors.location}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Signatures */}
            <div className="row row-reg">
              <div className="col-sm-12 mt-20">
                <p>
                  Pressing the "Submit" button I agree the Agoura Math Circle 
                  <button type="button" className="active" onClick={() => window.open('#terms-modal', '_blank')}>
                    Terms
                  </button> and 
                  <button type="button" className="active" onClick={() => window.open('#rules-modal', '_blank')}>
                    Rules
                  </button>
                </p>

                <div className="form-group">
                  <label htmlFor="waiverSignature">
                    Please sign the waiver (Liability Signature)* . DO NOT SIGN WITHOUT READING. 
                    I HAVE READ THIS ASSUMPTION OF RISK, WAIVER OF LIABILITY AND INDEMNITY AGREEMENT 
                    AND AGREE TO ITS TERMS.
                  </label>
                  <input
                    type="text"
                    name="waiverSignature"
                    value={formData.waiverSignature}
                    onChange={handleInputChange}
                    className={`form-control ${errors.waiverSignature ? 'error' : ''}`}
                  />
                  {errors.waiverSignature && (
                    <span className="errormessage">{errors.waiverSignature}</span>
                  )}
                  <br />
                  <p>
                    By printing your name in the box and pressing the submit button, I acknowledge 
                    that I have read and am electronically signing the Waiver of Liability, Assumption 
                    of Risk and Indemnity Agreement on behalf of myself or my dependent minor participant.
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="ruleSignature">Signature</label>
                  <input
                    type="text"
                    name="ruleSignature"
                    value={formData.ruleSignature}
                    onChange={handleInputChange}
                    className={`form-control ${errors.ruleSignature ? 'error' : ''}`}
                  />
                  {errors.ruleSignature && (
                    <span className="errormessage">{errors.ruleSignature}</span>
                  )}
                  <br />
                  <p>
                    By printing your name in the box and pressing the submit button, I acknowledge 
                    that I have read and am electronically signing the Agoura Math Circle Rules and 
                    Expectations on behalf of myself or my dependent minor participant.
                  </p>
                </div>

                <div className="form-group">
                  <p>
                    Occasionally, we take pictures at AMC meetings, which may be used for publicity 
                    purposes [e.g.: posted on our web site or used in a brochure about AMC.] Do you 
                    give us permission to include you in such photographs?
                  </p>
                  <label>
                    <input
                      type="checkbox"
                      name="picturePermission"
                      checked={formData.picturePermission}
                      onChange={handleInputChange}
                    />
                    I give permission to use the pictures/videos
                  </label>
                  <p style={{ fontSize: "12px" }}>
                    I give permission to use the pictures/videos.
                  </p>
                </div>

                <button type="submit" className="btn btn-common" tabIndex="15">
                  Submit
                </button>
              </div>
            </div>
          </form>

          {/* Animated Arrows */}
          <div className="animated-arrow-1 animated-arrow left-right-new">
            <img src={arrow1Img} alt="" />
          </div>
          <div className="animated-arrow-2 animated-arrow up-down-new">
            <img src={arrow2Img} alt="" />
          </div>
          <div className="animated-arrow-3 animated-arrow up-down-new">
            <img src={arrow3Img} alt="" />
          </div>
          <div className="animated-arrow-4 animated-arrow left-right-new">
            <img src={arrow3Img} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration; 