import React from "react";
import "../styles/Rules.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";

const Rules = () => {
  return (
    <div className="main-content">
      {/* Breadcrumbs Start */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">RULES</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li>
              <a>Rules </a>
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
            <div className="col-lg-12 mb-50">
              <div className="sec-title">
                <h3 className="title mb-10 text-center">
                  AGOURA MATH CIRCLE RULES AND EXPECTATIONS
                </h3>
                <div className="des about-cont">
                  <p>
                    By joining the Agoura Math Circle students and parents agree
                    to abide the following rules:
                  </p>
                  <ul style={{ fontSize: "large" }}>
                    <li>
                      1. &nbsp; Arrive on Time: All the classes start at 2 p.m.
                      sharp. We strongly discourage late arrivals since they are
                      very disruptive to the sessions.
                    </li>
                    <br />
                    <li>
                      2. &nbsp;COME PREPARED: Bring a 3 ring binder dedicated to
                      the Agoura Math Circle materials. You will be putting
                      handouts and worksheets into this binder Bring scratch
                      paper. Bring pencils, pens and erasers. If asked by the
                      instructor, bring additional supplies (such as compasses
                      and rulers for geometry sessions; calculators, graph
                      paper, etc.) Make your best effort in completing problems
                      assigned for homework. If you have missed a session, be
                      sure to download the handout from the web page and work
                      through it at home.
                    </li>
                    <br />
                    <li>
                      3. &nbsp; BEHAVIOR RULES:No food or drink in the
                      classrooms while classes are in session (you may have a
                      snack during the break only). No cell phones or electronic
                      games are allowed during class time. Calculators are
                      allowed only in sessions when instructors have asked to
                      bring them. No running and playing in the classrooms,
                      hallways, bathrooms or elevators. Stay quiet in the
                      hallways. Follow the instructions of group instructors and
                      staff. Be engaged in the classroom activities (no working
                      on outside projects or homework; no cell phones; no
                      playing games; no reading of outside materials). Maintain
                      classroom environment conductive of learning (be
                      respectful to the instructors, your peers; stay in your
                      seat; do not speak out of turn). Be careful with the
                      furniture and classroom equipment, as well as when using
                      any university facilities. Clean up your work space before
                      leaving the classroom.
                    </li>
                    <br />
                    <li>
                      4. &nbsp; FOR PARENTS: Parents (except for specially
                      designated room parents) are generally not allowed in the
                      classrooms during the math circle sessions. Room parents
                      help the lead instructor and circle docents and divide
                      their attention equally between the children. Please stay
                      with your children until the session starts. Please sign
                      in and sign out your child on the sign up sheets provided
                      next to the classroom (the sign-up sheets are maintained
                      by room parents). Conversation in the hallways should be
                      kept to a minimum. All the classes end at 5 p.m. sharp.
                      Please pick up your child(ren) promptly at the end of the
                      math circle sessions.
                    </li>
                    <br />
                    <li>
                      5. &nbsp; Home work is required for all students. Students
                      need to bring their Student ID Card and Home Work for
                      every session. If your kid/s will not be able to attend
                      this session, please contact the Instructor via the
                      message center. If students are absent for more than two
                      classes or missing homework for 2 classes, they will be
                      dropped.
                    </li>
                    <br />
                    <li>
                      6. &nbsp; Agoura Math Circle YouTube channel subscription
                      is required for all students. We publish the lecture
                      videos a week before the class. All students must watch
                      the lecture videos before coming to the class.{" "}
                      <a href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos">
                        {" "}
                        Subscribe to Agoura Math Circle YouTube Channel.
                      </a>
                    </li>
                  </ul>
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

export default Rules;
