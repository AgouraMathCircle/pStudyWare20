import React from "react";
import "../styles/Overview.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import speechImg from "../assets/images/about/Speech.jpg";
import eg1Img from "../assets/images/about/EG_1.jpg";
import NewsletterSection from "../components/NewsletterSection";
const Overview = () => {
  return (
    <div className="overview-page">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
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

      {/* History Section */}
      <div
        id="sc-history"
        className="history-section pt-80 pb-70 md-pt-40 position-relative"
      >
        <div className="history-container">
          <div className="history-row">
            {/* Image Column - Left */}
            <div className="history-image-col">
              <div className="img-part history-img-wrapper">
                <img
                  src={speechImg}
                  alt="History Image"
                  className="history-image"
                />
              </div>
            </div>

            {/* Text Column - Right */}
            <div className="history-text-col">
              <div className="history-content">
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
        </div>
      </div>

      {/* Overview Section */}
      <div id="sc-overview" className="overview-section position-relative">
        <div className="overview-container">
          {/* Overview Title */}
          <div className="overview-title-wrapper">
            <h2 className="title mb-40">Overview</h2>
          </div>

          {/* Overview Image Row - Top */}
          <div className="overview-image-row">
            <div className="img-part overview-img-wrapper">
              <img
                src={eg1Img}
                alt="Overview Image"
                className="overview-image"
              />
            </div>
          </div>

          {/* Overview Text Row - Bottom */}
          <div className="overview-text-row">
            <div className="sec-title mb-20">
              <div className="des-sec about-cont" style={{ fontSize: "17px" }}>
                Agoura Math Circle is a community service initiative offering a
                free educational program with a primary focus on cultivating
                problem-solving skills that carves a path for the students to
                succeed in both academics and beyond. Our goal is to create a
                strong mathematical foundation for kids to maximize their
                critical thinking potential and motivate them to aim for greater
                heights in their careers. The organization offers diverse
                learning opportunities to cater to students' varying interests
                such as engineering, computer science, and problem solving for
                national math competitions such as AMC and Math Kangaroo.
                Additionally we hold monthly seminars from highly qualified STEM
                professionals and prepare students for standardized testing.
                Currently, we provide both online and on-site programs for the
                Math Circle and online classes for Engineering Circle, Test
                Preparation and Triangular Talks. Our latest addition is the
                Satellite program collaborating with non profit organizations
                worldwide to impart and promote the problem solving skills..
              </div>
             <div className="des-sec about-cont" style={{ fontSize: "17px", paddingBottom: "5%" }}>
                In summary, the Agoura Math Circle, founded on the principles of
                education, empowerment, and community service, strives to equip
                students with the essential skills and confidence needed for
                academic excellence and success in life, all while fostering a
                love for mathematics and problem-solving.
              </div>
            </div>
          </div>
        </div>
      </div>
    
            </div>
    
  );
};

export default Overview;
