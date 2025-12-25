import React from "react";
import "../styles/Overview.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import flyerImg from "../assets/images/about/Satellite-program-flyer.jpg";
import satelliteLogoImg from "../assets/images/about/logo.jpg";
import satelliteLogoAboutImg from "../assets/images/about/SaiKrushnaLogo.jpg";

const SatelliteProgram = () => {
  return (
    <div className="overview-page">
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">Satellite Program</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li className="active">About Us &gt;</li>
            <li className="active">Satellite Program</li>
          </ul>
        </div>
      </div>

      <div className="overview-section position-relative" style={{ paddingTop: "25px", paddingBottom: "35px" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="title mb-40">Satellite Program</h2>
            </div>
          </div>

          <div className="row overview-text-row">
            <div className="col-lg-7" style={{ marginLeft: "-12px" }}>
              <div className="sec-title mb-20">
                <div className="des-sec about-cont" style={{ fontSize: "17px", paddingLeft: 0 }}>
Agoura Math Circle is proud to introduce its groundbreaking initiative, the "Satellite Program," aimed at collaborating with schools/educational institutions, students, and teachers with a shared passion for problem-solving using mathematics and computer science on a global scale. As part of this initiative, we would create a platform for students and teachers and help build a club or study circle or enrichment classes in their respective schools/educational institutions. We will offer a range of resources, including online study material, live lectures, interactive workshops, access to a diverse team of expert mentors. Our program's curriculum will cover a wide spectrum of mathematical and computer science topics, from foundational concepts to cutting-edge problem-solving techniques.                </div>
                <div className="des-sec about-cont" style={{ fontSize: "17px", paddingLeft: 0 }}>
Together, we believe in the transformative power of education to build a more equitable and inclusive world, where the joy of problem-solving is accessible to all at no cost. Together, we can inspire the problem solvers of tomorrow and drive positive change across the globe.                </div>
                <div className="des-sec about-cont" style={{ fontSize: "17px", paddingLeft: 0 }}>
                  For further information about the Satellite Program, please contact :
                  {" "}
                  <a href="mailto:info@agouramathcircle.org" style={{ color: "#53b50a", textDecoration: "none", fontWeight: 600 }}>
                    info@agouramathcircle.org
                  </a>
                </div>
                <div className="des-sec about-cont" style={{ fontSize: "17px", paddingLeft: 0 }}>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSee8eQUL8tt0Iygl_-ocQ9c4fzO3F3VwfIrPRlwXBFZ2XVfBA/viewform?usp=pp_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "#53b50a",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "3px",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Register Now
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5" style={{ paddingLeft: "32px", display: "flex", justifyContent: "flex-end" }}>
              <div className="img-part overview-img-wrapper" style={{ marginLeft: "auto", transform: "translateX(24px)" }}>
                <img
                  src={flyerImg}
                  alt="Satellite Program Flyer"
                  className="overview-image"
                />
              </div>
            </div>
          </div>

          <div className="row" style={{ marginTop: "44px" }}>
            <div className="col-lg-12 text-center">
              <h2 className="title mb-40">Satellite Chapters</h2>
            </div>
          </div>
          <div className="row justify-content-center" style={{ marginTop: "16px" }}>
            <div className="col-lg-12 text-center mb-4">
              <h3 style={{ color: "#0d6efd", fontWeight: 600 }}>USA</h3>
              <div className="img-part overview-img-wrapper" style={{ maxWidth: "280px", margin: "0 auto" }}>
                <img src={satelliteLogoImg} alt="Agoura Math Circle Logo" className="overview-image" />
              </div>
              <div style={{ marginTop: "10px", color: "#6c757d", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                CHARLOTTE, NC
              </div>
            </div>
          </div>
          <div className="row justify-content-center" style={{ marginTop: "28px" }}>
            <div className="col-lg-12 text-center mb-4">
              <h3 style={{ color: "#0d6efd", fontWeight: 600 }}>India</h3>
              <div className="img-part overview-img-wrapper" style={{ maxWidth: "280px", margin: "0 auto" }}>
                <img src={satelliteLogoAboutImg} alt="Sai Krushna Charitable Trust Logo" className="overview-image" />
              </div>
              <div style={{ marginTop: "10px", color: "#6c757d", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                SAI KRUSHNA VIDYA MANDIR, INDIA
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteProgram;
