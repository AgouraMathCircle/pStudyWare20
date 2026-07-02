import React from "react";
import "../styles/Terms.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";

const Terms = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="main-content">
      {/* Breadcrumbs Start */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">TERMS</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li>
              <a>Terms </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Breadcrumbs End */}

      {/* About Section Start */}
      <div
        id="sc-about"
        className="sc-about pt-40 pb-70 md-pt-40 position-relative arrow-animation-1"
      >
        <div className="container mb-40">
          <div className="row eng-row1 mb-50">
            <div className="col-lg-12">
              <div className="sec-title">
                <h3 className="title mb-10 text-center">
                  ASSUMPTION OF RISK, WAIVER OF LIABILITY AND INDEMNITY
                  AGREEMENT
                </h3>
                <div className="des about-cont">
                  <p style={{ textAlign: "justify" }}>
                    I will not attempt to hold Agoura Math Circle, its
                    directors, officers, teachers, volunteers, shareholders,
                    members, employees, affiliates, sponsors, and/or insurers
                    (all together, "Releasees") liable for any damages, injury,
                    and/or loss to person or property one might sustain while
                    participating in the Agoura Math Circle Program. I knowingly
                    and voluntarily release Releasees from any and all liability
                    whatsoever for any personal injury (including death) or
                    property damage arising from-participation in Agoura Math
                    Circle's program including, without limitation, any
                    incidental travel. I further knowingly and voluntarily agree
                    to defend, indemnify, and hold harmless the Releasees from
                    any and all liabilities, damages, claims, demands, causes of
                    action, loss and/or liability (including attorneys' fees)
                    arising out of my own actions or omissions while
                    participating in/and/or attending the Agoura Math Circle
                    Program or any incident thereto. I fully recognize that
                    there are dangers and risks I may be exposed to by
                    participating in the Agoura Math Circle Program including,
                    but not limited to injury, illness, substantial bodily harm,
                    death, and or property damage for which I may be liable. I
                    expressly and knowingly assume the full risk, without
                    limitation. I expressly acknowledge and agree that I am
                    voluntarily participating in the Agoura Math Circle Program
                    and that it is my sole responsibility to comply with any and
                    all applicable laws. I expressly acknowledge and agree that
                    it is my sole responsibility to participate only in those
                    activities for which I have the necessary skills, fitness,
                    and training. I expressly acknowledge and agree that
                    Releasees do not warrant or guarantee as to the condition,
                    safety, or suitability of any equipment, vehicle, roadway,
                    sidewalk, classroom, classroom furniture, property,
                    building, parking lot, and/or location or structure of any
                    kind that may be involved, used, and/or visited in
                    connection with the Agoura Math Circle Program. DO NOT SIGN
                    WITHOUT READING. I HAVE READ THIS ASSUMPTION OF RISK, WAIVER
                    OF LIABILITY AND INDEMNITY AGREEMENT AND AGREE TO ITS TERMS.
                  </p>
                  <h5>Last revised: January 1, {currentYear}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

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
      {/* About Section End */}
    </div>
  );
};

export default Terms;
