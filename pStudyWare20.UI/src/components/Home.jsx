import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { initCounterAnimation } from "../assets/js/counter";
import Banner from "./Home/Banner";
import CtaSection from "./Home/CtaSection";
import About from "./Home/About";
import Courses from "./Home/Courses";
import Stats from "./Home/Stats";
import VideoGallery from "./Home/VideoGallery";
import Team from "./Home/Team";
import Sponsors from "./Home/Sponsors";
// Images moved to public/assets/images/
const counterBg2 = "/assets/images/bg/counter-bg2.jpg";
const bannerBg2 = "/assets/images/banner/banner-bg2.jpg";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    initCounterAnimation();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <Banner />
      <CtaSection />
      <About />
      <Courses />
      <Stats />
      <VideoGallery />
      <Team />
      <Sponsors />
      {/* Other Home content will go here */}
    </div>
  );
};

export default Home;
