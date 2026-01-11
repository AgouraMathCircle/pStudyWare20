import React from "react";
import "../styles/Projects.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import youthLogoImg from "../assets/images/about/Youth Logo -FB.png";
import pcrLogoImg from "../assets/images/about/PCR_Logo.jpg";
import ishDubeyImg from "../assets/images/team/volunteers/ISH-DUBEY.jpg";
import milindImg from "../assets/images/team/volunteers/Milind.jpeg";
import hannahImg from "../assets/images/team/volunteers/hannah.png";
import shrishGoelImg from "../assets/images/team/volunteers/shrishgeol.jpeg";
import syleshImg from "../assets/images/team/volunteers/Sylesh.jpg";
import jerryYangImg from "../assets/images/team/volunteers/JerryYang.png";

const Projects = () => {
  return (
    <div className="projects-page">
      {/* Breadcrumbs Start */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">Projects</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li className="active">About Us &gt;</li>
            <li className="active">Engineering Circle&gt;</li>
            <li className="active">Projects</li>
          </ul>
        </div>
      </div>
      {/* Breadcrumbs End */}

      {/* About Section Start */}
      <div
        id="sc-about"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-7 md-mb-115 img-p">
              <div className="sec-title mb-20">
                <h3 className="title mb-20">ACS Youth Ambassador Website</h3>
                <div className="des about-cont" style={{ fontSize: "17px" }}>
                  <h5>
                    Overview:
                    <p style={{ lineHeight: "30px" }}>
                      The ACS Youth Ambassador website is a website commissioned
                      by the American Cancer Society Youth Ambassador Branch,
                      constructed for the sole purpose of consolidating
                      information about the Youth Ambassador Program and
                      providing essential cancer-related resources to those who
                      are affected by cancer either directly or indirectly.
                    </p>
                  </h5>
                  <h5>
                    Key Features:
                    <p style={{ lineHeight: "30px" }}>
                      ● Intuitive User Interface: All pages of the website are
                      easily accessible through the tabs at the top, allowing
                      for smooth transitions between information hubs <br />
                      ● Fostering Community Service: Several different sections
                      of the website that explain what YA's do and how their
                      volunteering can result in special recognition
                      <br />
                      ● Blog: A hub for people to share their experiences in
                      different events relating to cancer awareness
                      <br />
                      ● Chat: One-on-one chat services are provided for the user
                      if they have any inquiries about the website.
                      <br />
                      ● Resources Page: Dedicated page with references links to
                      other reputed online resources pertaining to
                      cancer-related topics
                      <br />
                    </p>
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-lg-5 pl-90 md-pl-15">
              <div
                className="img-part position-relative"
                style={{ marginTop: "-0px" }}
              >
                <img className="" src={youthLogoImg} alt="About Image" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Section - ACS Youth Ambassador */}
      <div
        className="sc-team team-style-1"
        style={{ marginTop: "-0px", marginBottom: "-0px" }}
      >
        <div className="container">
          <div className="sec-title mb-10 text-center md-mb-10">
            <h3 className="title mb-0">Team Meambers</h3>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="team-inner-item">
                <div className="team-wrap team-wrap1">
                  <div className="team-img">
                    <a href="">
                      <img src={ishDubeyImg} alt="" className="img-fluid" />
                    </a>
                    <div className="team-social">
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-google-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                    </div>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <a href="">Ish Dubey</a>
                      </h3>
                      <span className="team-title">Project Lead</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="team-inner-item">
                <div className="team-wrap team-wrap1">
                  <div className="team-img">
                    <a href="">
                      <img src={milindImg} alt="" />
                    </a>
                    <div className="team-social">
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-google-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                    </div>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <a href="">Milind Patel</a>
                      </h3>
                      <span className="team-title">Programmer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="team-inner-item">
                <div className="team-wrap team-wrap1">
                  <div className="team-img">
                    <a href="">
                      <img src={hannahImg} alt="" />
                    </a>
                    <div className="team-social">
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-google-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                    </div>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <a href="">Hannah Yang</a>
                      </h3>
                      <span className="team-title">Designer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pocket Cancer Resources Section */}
      <div
        id="sc-about"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-7 md-mb-115 img-p">
              <div className="sec-title mb-20">
                <h3 className="title mb-20">Pocket Cancer Resources</h3>
                <div className="des about-cont" style={{ fontSize: "17px" }}>
                  <h5>
                    Overview:
                    <p style={{ lineHeight: "30px" }}>
                      Pocket Cancer Resources is a dedicated app under the
                      American Cancer Society - Youth Ambassador Branch,
                      designed to provide essential cancer-related resources to
                      individuals directly impacted by cancer or those
                      supporting loved ones on their journey.
                    </p>
                  </h5>
                  <h5>
                    Key Features:
                    <p style={{ lineHeight: "30px" }}>
                      ● Intuitive User Interface: All pages of the website are
                      easily accessible through the tabs at the top, allowing
                      for smooth transitions between information hubs <br />
                      ● Comprehensive Resource Hub: Access a curated collection
                      of cancer resources gathered from reputable sources on the
                      web.
                      <br />
                      ● User-Friendly Interface: Navigate the app effortlessly
                      with a user-friendly design for a seamless experience.
                      <br />
                      ● Empowering Patients: Empower cancer patients with the
                      knowledge they need to navigate their and their family's
                      journey more effectively.
                      <br />
                    </p>
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-lg-4 pl-90 md-pl-15">
              <div
                className="img-part position-relative"
                style={{ marginTop: "-0px" }}
              >
                <img className="" src={pcrLogoImg} alt="About Image" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Section - Pocket Cancer Resources */}
      <div
        className="sc-team team-style-1"
        style={{ marginTop: "-0px", marginBottom: "-0px" }}
      >
        <div className="container">
          <div className="sec-title mb-10 text-center md-mb-10">
            <h3 className="title mb-0">Team Meambers</h3>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="team-inner-item">
                <div className="team-wrap team-wrap1">
                  <div className="team-img">
                    <a href="">
                      <img src={shrishGoelImg} alt="" className="img-fluid" />
                    </a>
                    <div className="team-social">
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-google-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                    </div>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <a href="">Shrish Goel</a>
                      </h3>
                      <span className="team-title">Project Director</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="team-inner-item">
                <div className="team-wrap team-wrap1">
                  <div className="team-img">
                    <a href="">
                      <img src={syleshImg} alt="" />
                    </a>
                    <div className="team-social">
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-google-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                    </div>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <a href="">Sylesh Sundaresan</a>
                      </h3>
                      <span className="team-title">Programmer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="team-inner-item">
                <div className="team-wrap team-wrap1">
                  <div className="team-img">
                    <a href="">
                      <img src={jerryYangImg} alt="" />
                    </a>
                    <div className="team-social">
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-google-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" className="social-icon">
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                    </div>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <a href="">Jerry Yang</a>
                      </h3>
                      <span className="team-title">Lead Designer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Projects;
