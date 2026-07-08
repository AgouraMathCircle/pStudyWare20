import React, { useState } from "react";
import "../styles/Contact.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import {
  Facebook as FacebookIcon,
  X as XIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Contact form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-container">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay contact-breadcrumbs">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">CONTACT US</h1>
          <ul>
            <li>Home &gt;</li>
            <li className="active">Contact Us</li>
          </ul>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        <div
          id="sc-about-contact"
          className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
        >
          <div className="contact-title text-center">
            <h2 className="title">HAPPY TO HELP!</h2>
          </div>
          <section className="Material-contact-section section-padding section-dark">
            <div className="container">
              <div className="row contact-row">
                {/* Section Titile */}
                <div
                  className="col-md-7 mt-3 contact-widget-section2 wow animated fadeInLeft"
                  data-wow-delay=".2s"
                >
                  <h4 className="contact-us-heading">CONTACT US</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="find-widget">
                        Agoura Chapter El Camino Real High School
                      </div>
                      <div className="find-widget">
                        <span className="address-text">
                          5440 Valley Cir Blvd, Woodland Hill
                          <br />
                          CA 91367
                        </span>
                      </div>
                      <div className="find-widget email-widget">
                        <span>Email: support@agouramathcircle.org</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="find-widget">
                        Agoura Engineering Circle
                      </div>
                      <div className="find-widget email-widget">
                        <span>Email: support@agouramathcircle.org</span>
                      </div>
                    </div>
                  </div>

                  <div className="row pt-10">
                    <div className="col-md-6">
                      <div className="find-widget">Online Chapter</div>
                      <div className="find-widget email-widget">
                        <span>Email: support@agouramathcircle.org</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="find-widget">ACT/SAT/PSAT</div>
                      <div className="find-widget email-widget">
                        <span>Email: support@agouramathcircle.org</span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 social-section-inline">
                      <h4 className="social-heading">WE'RE SOCIAL</h4>
                    </div>
                    <div className="col-md-6">
                      <div className="canvas-contact">
                        <ul className="social soc-cont">
                          <li>
                            <FacebookIcon />
                          </li>
                          <li>
                            <XIcon />
                          </li>
                          <li>
                            <LinkedInIcon />
                          </li>
                          <li>
                            <InstagramIcon />
                          </li>
                          <li>
                            <YouTubeIcon />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div
                  className="col-md-5 wow animated fadeInRight"
                  data-wow-delay=".2s"
                >
                  <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group label-floating">
                      <label className="control-label" htmlFor="name">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="help-block with-errors"></div>
                    </div>
                    {/* Email */}
                    <div className="form-group label-floating">
                      <label className="control-label" htmlFor="email">
                        Email ID
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="help-block with-errors"></div>
                    </div>
                    {/* Subject */}
                    <div className="form-group label-floating">
                      <label className="control-label" htmlFor="subject">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="help-block with-errors"></div>
                    </div>
                    {/* Message */}
                    <div className="form-group label-floating">
                      <label className="control-label" htmlFor="message">
                        Message
                      </label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                      <div className="help-block with-errors"></div>
                    </div>
                    {/* Form Submit */}
                    <div>
                      <button type="submit" className="btn btn-common">
                        Send Message
                      </button>
                      <div
                        id="msgSubmit"
                        className="h3 text-center hidden"
                      ></div>
                      <div className="clearfix"></div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* About Section End */}
      </div>
    </div>
  );
};

export default Contact;
