import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initCounterAnimation } from "../assets/js/counter";
import Banner from "./Home/Banner";
import CtaSectionRegistration from "./Home/CtaSectionRegistration";
import CtaSectionSatellite from "./Home/CtaSectionSatellite";
import CtaSectionNews from "./Home/CtaSectionNews";
import WhoAreWe from "./Home/WhoAreWe";
import WhatWeDo from "./Home/WhatWeDo";
import Stats from "./Home/Stats";
import VideoGallery from "./Home/VideoGallery";
import Team from "./Home/Team";
import Sponsors from "./common/Sponsors";
import JoinUs from "./Home/WhyWaitJoinUs";
import YouTubeCoursesSection from "./Home/YouTubeCoursesSection";
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
    <div className="home-page">
      <Banner />
      <CtaSectionRegistration />
      <WhoAreWe />
      <CtaSectionSatellite />
      <WhatWeDo />
      <Stats />
      <YouTubeCoursesSection />
      <JoinUs />
      <CtaSectionNews />
      <Team />
      <VideoGallery />
      <Sponsors />
    </div>
  );
};

export default Home;
