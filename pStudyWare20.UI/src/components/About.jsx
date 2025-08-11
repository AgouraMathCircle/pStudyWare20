import React from "react";
import "../styles/About.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import aboutAmcImg from "../assets/images/about/about-amc copy copy.png";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";
import arrow4Img from "../assets/images/arrow-4.png";
import arrow5Img from "../assets/images/arrow-5.png";
import teamMember1 from "../assets/images/team/1.jpg";
import teamMember2 from "../assets/images/team/2.jpg";
import austinLawImg from "../assets/images/team/Team/AustinLaw.png";
import joshnaImg from "../assets/images/team/Team/Joshna.png";
import charlieImg from "../assets/images/team/volunteers/charlie.png";
import mugilImg from "../assets/images/team/volunteers/mugil.jpg";

const About = () => {
  return (
    <div className="about-page">
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
            <li className="active">Math Circle</li>
          </ul>
        </div>
      </div>

      {/* About Section */}
      <div
        id="sc-about"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-5 md-mb-115 img-p">
              <div className="img-part position-relative">
                <img className="" src={aboutAmcImg} alt="About Image" />
                <div className="about-experience text-center">
                  <span>1000+</span>
                  Students
                </div>
              </div>
            </div>
            <div className="col-lg-7 pl-90 md-pl-15">
              <div className="sec-title mb-20">
                <h2 className="title mb-20">ABOUT AMC</h2>
                <div className="des about-cont">
                  The Agoura Math Circle is a student-run, 501(c)(3) nonprofit
                  community service organization founded by Pranav Kalyan in
                  September 2015. Agoura Math Circle is a free educational
                  program focusing on the problem-solving skills that lead
                  students to success in both academics and the real world. More
                  importantly, Agoura Math Circle gives students confidence and
                  the skills to tackle any type of problem, academic or
                  otherwise. Our goal is to create a strong foundation for kids
                  to increase critical thinking and motivate kids to aim for top
                  universities in a fun-filled environment.
                </div>
                <div className="des-sec about-cont">
                  Agoura Math Circle has many opportunities for students
                  dependent on their various interests. At the moment we have
                  online and OnSite where students can learn math and
                  Engineering. These chapters work together to support our
                  students as best we can. Agoura Engineering Circle is a place
                  for high school students to apply their math skills to
                  engineering. Our test preparation course, offered to 8th
                  graders and up, help students achieve the score they want for
                  standardized tests like the PSAT, SAT and ACT. For kids around
                  the world who still wish to learn math concepts, we have a
                  YouTube channel.
                </div>
                <div className="row">
                  <div
                    className="col-lg-3 btn-read"
                    style={{ textAlign: "center" }}
                  >
                    <div
                      className="btn-part wow fadeInUp"
                      data-wow-delay="300ms"
                      data-wow-duration="2000ms"
                    >
                      <a className="readon" href="/leadership">
                        Leadership
                      </a>
                    </div>
                  </div>
                  <div
                    className="col-lg-5 btn-read"
                    style={{ textAlign: "center", paddingLeft: "50px" }}
                  >
                    <div
                      className="btn-part wow fadeInUp"
                      data-wow-delay="300ms"
                      data-wow-duration="2000ms"
                    >
                      <a className="readon" href="/our-team">
                        Our Team
                      </a>
                    </div>
                  </div>
                  <div
                    className="col-lg-4 btn-read"
                    style={{ textAlign: "center" }}
                  >
                    <div
                      className="btn-part wow fadeInUp"
                      data-wow-delay="300ms"
                      data-wow-duration="2000ms"
                    >
                      <a className="readon" href="/amc-alumni">
                        AMC Alumni
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div
          id="sc-about"
          className="sc-about pt-80 md-pt-40 md-pb-70 position-relative arrow-animation-1"
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <ul className="check-square two-line mb-20 about-cont">
                  <li>Problem Solving Skills</li>
                  <li>Basic Math</li>
                  <li>Pre Algebra</li>
                  <li>Pre Calculus</li>
                </ul>
              </div>
              <div className="col-lg-3">
                <ul className="check-square two-line mb-20 about-cont">
                  <li>Calculus</li>
                  <li>MATH COUNTS</li>
                  <li>AMC 8</li>
                  <li>AMC 10</li>
                  <li>AMC 12</li>
                </ul>
              </div>
              <div className="col-lg-4">
                <ul className="check-square two-line mb-20 about-cont">
                  <li>MATH Kangaroo</li>
                  <li>MATH LEAGUE</li>
                  <li>ACT/PSAT</li>
                  <li>Introduction to Data Science</li>
                  <li>Introduction to Artificial Intelligence</li>
                </ul>
              </div>
              <div className="col-lg-2 btn-read">
                <div
                  className="btn-part wow fadeInUp"
                  data-wow-delay="300ms"
                  data-wow-duration="2000ms"
                >
                  <a className="readon" href="/register">
                    Register Now
                  </a>
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

      {/* Counter Section */}
      <div className="sc-counter style2-about pt-120 pb-115 md-pt-80 md-pb-50 counter-bg1 position-relative arrow-animation-1">
        <div className="container">
          <div className="row couter-area">
            <div className="col-lg-3 col-md-6 md-mb-30">
              <div className="counter-item text-center">
                <div className="icon-part">
                  <i className="flaticon flaticon-laptop"></i>
                </div>
                <h2 className="counter-title">
                  <span className="sc-count">8</span>
                  <span className="text">+</span>
                </h2>
                <h5 className="title mb-0">Chapter</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 md-mb-30">
              <div className="counter-item text-center ping-color">
                <div className="icon-part">
                  <i className="flaticon flaticon-study"></i>
                </div>
                <h2 className="counter-title">
                  <span className="sc-count">1000</span>
                  <span className="text">+</span>
                </h2>
                <h5 className="title mb-0">Students</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 md-mb-30">
              <div className="counter-item text-center green-color">
                <div className="icon-part">
                  <i className="flaticon flaticon-teacher"></i>
                </div>
                <h2 className="counter-title">
                  <span className="sc-count">125</span>
                  <span className="text">+</span>
                </h2>
                <h5 className="title mb-0">Volunteers</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 md-mb-30">
              <div className="counter-item text-center yellow-color">
                <div className="icon-part">
                  <i className="flaticon flaticon-monitor"></i>
                </div>
                <h2 className="counter-title">
                  <span className="sc-count">6</span>
                  <span className="text">+</span>
                </h2>
                <h5 className="title mb-0">Subjects</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="animated-arrow-1 animated-arrow left-right-new">
          <img src={arrow5Img} alt="" />
        </div>
        <div className="animated-arrow-2 animated-arrow up-down-new">
          <img src={arrow2Img} alt="" />
        </div>
        <div className="animated-arrow-3 animated-arrow up-down-new">
          <img src={arrow4Img} alt="" />
        </div>
        <div className="animated-arrow-4 animated-arrow left-right-new">
          <img src={arrow3Img} alt="" />
        </div>
      </div>

      {/* Team Section */}
      <div className="sc-team team-style-1 pt-20 pb-10 md-pt-70 md-pb-20">
        <div className="container">
          <div className="sec-title mb-30 text-center md-mb-10">
            <h2 className="title mb-0">AMC TEAM</h2>
          </div>
          <div className="row team-row">
            <div className="col-lg-6">
              <div className="team-inner-item">
                <div className="team-wrap">
                  <div className="team-img">
                    <a href="">
                      <img src={teamMember1} alt="" />
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
                        <a href="">Pranav Kalyan</a>
                      </h3>
                      <span className="team-title">Founder and President</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="team-inner-item">
                <div className="team-wrap">
                  <div className="team-img">
                    <a href="">
                      <img src={teamMember2} alt="" />
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
                        <a href="">Sriya Kalyan</a>
                      </h3>
                      <span className="team-title">
                        Chief Executive Officer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Board Members Section */}
      <div className="sc-team team-style-1">
        <div className="container">
          <div className="sec-title mb-10 text-center md-mb-10">
            <h3 className="title mb-0">AMC Student Board Members</h3>
          </div>
          <div className="row">
            {/* Senior Vice Presidents */}
            <div className="col-lg-3">
              <div className="team-inner-item">
                <div className="team-wrap team-wrap1">
                  <div className="team-img">
                    <a href="">
                      <img src={austinLawImg} alt="" />
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
                        <a href="">Austin Law</a>
                      </h3>
                      <span className="team-title">Senior Vice President</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="team-inner-item">
                <div className="team-wrap">
                  <div className="team-img">
                    <a href="">
                      <img src={joshnaImg} alt="" />
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
                        <a href="">JOSHNA JUDE</a>
                      </h3>
                      <span className="team-title">Senior Vice President</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="team-inner-item">
                <div className="team-wrap">
                  <div className="team-img">
                    <a href="">
                      <img src={charlieImg} alt="" />
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
                        <a href="">CHARLIE NICKS</a>
                      </h3>
                      <span className="team-title">Senior Vice President</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="team-inner-item">
                <div className="team-wrap">
                  <div className="team-img">
                    <a href="">
                      <img src={mugilImg} alt="" />
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
                        <a href="">MUGIL</a>
                      </h3>
                      <span className="team-title">Senior Vice President</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
