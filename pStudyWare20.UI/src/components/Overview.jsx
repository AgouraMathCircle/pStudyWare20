import React from "react";
import "../styles/Overview.css";
// Images moved to public/assets/images/
const pageHeaderImg = "/assets/images/about/page-header.jpg";
const speechImg = "/assets/images/about/Speech.jpg";
const eg1Img = "/assets/images/about/EG_1.jpg";

const Overview = () => {
  return (
    <div className="overview-page">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img
            src={pageHeaderImg}
            alt="Breadcrumbs Image"
          />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">About Us</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li className="active">About Us &gt;</li>
            <li className="active">Overview</li>
          </ul>
        </div>
      </div>

      {/* About Section */}
      <div
        id="sc-about"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
      >
        <div className="container">
          {/* History Section */}
          <div className="row">
            <div className="col-lg-5 md-mb-115 img-p">
              <div className="img-part position-relative">
                <img
                  className=""
                  src={speechImg}
                  alt="About Image"
                />
              </div>
            </div>
            <div className="col-lg-7 pl-90 md-pl-15">
              <div className="sec-title mb-20">
                <h2 className="title mb-20">History</h2>
                <div className="des about-cont" style={{ fontSize: "17px" }}>
                  The Agoura Math Circle is a student-run, 501(c)(3) nonprofit
                  community service organization founded by Pranav Kalyan in
                  September 2015. Eastern European math circle culture was the
                  inspirational source for Agoura Math Circle to bring like
                  minded math lovers together. For the first few years the
                  medium of instructions was provided by math enthusiasts:
                  educators, parent volunteers and extraordinary students.
                  Eventually a strong knowledge base was formed with highly
                  competitive study material and Agoura Math Circle students who
                  finished the program started taking over. Today we are proud
                  to call ourselves a student run program.
                </div>
              </div>
            </div>
          </div>

          <br />

          {/* Overview Image Section */}
          <div className="row text-center">
            <div className="col-lg-12 text-center">
              <center>
                <h2 className="title mb-20">Overview</h2>
                <div
                  className="img-part position-relative text-center"
                  style={{ width: "50%", height: "auto", textAlign: "center" }}
                >
                  <center>
                    <img
                      className=""
                      src={eg1Img}
                      alt="About Image"
                    />
                  </center>
                </div>
              </center>
            </div>
          </div>

          {/* Overview Content Section */}
          <div className="row">
            <div className="col-lg-12 md-mb-115 img-p">
              <div className="sec-title mb-20 text-center">
                <div
                  className="des-sec about-cont"
                  style={{ fontSize: "17px" }}
                >
                  Agoura Math Circle is a community service initiative offering
                  a free educational program with a primary focus on cultivating
                  problem-solving skills that carves a path for the students to
                  succeed in both academics and beyond. Our goal is to create a
                  strong mathematical foundation for kids to maximize their
                  critical thinking potential and motivate them to aim for
                  greater heights in their careers.
                  <br />
                  <br />
                  The organization offers diverse learning opportunities to
                  cater to students' varying interests such as engineering,
                  computer science, and problem solving for national math
                  competitions such as AMC and Math Kangaroo. Additionally we
                  hold monthly seminars from highly qualified STEM professionals
                  and prepare students for standardized testing. Currently, we
                  provide both online and on-site programs for the Math Circle
                  and online classes for Engineering Circle, Test Preparation
                  and Triangular Talks. Our latest addition is the Satellite
                  program collaborating with non profit organizations worldwide
                  to impart and promote the problem solving skills.
                </div>
                <div
                  className="des-sec about-cont"
                  style={{ fontSize: "17px" }}
                >
                  In summary, the Agoura Math Circle, founded on the principles
                  of education, empowerment, and community service, strives to
                  equip students with the essential skills and confidence needed
                  for academic excellence and success in life, all while
                  fostering a love for mathematics and problem-solving.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
