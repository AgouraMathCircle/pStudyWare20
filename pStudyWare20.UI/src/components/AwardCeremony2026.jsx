import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import "../styles/Gallery.css";
import "../styles/About.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";

// Import all images from AwardCeremony2026 folder
import img1 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 1.jpeg";
import img2 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 2.jpeg";
import img3 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 3.jpeg";
import img4 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 4.jpeg";
import img5 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 5.jpeg";
import img6 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 6.jpeg";
import img7 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 7.jpg";
import img8 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 8.jpg";
import img9 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 9.jpg";
import img10 from "../assets/images/gallery/photos/AwardCeremony2026/IMG 10.jpg";
import fb1 from "../assets/images/gallery/photos/AwardCeremony2026/702043303_2699111117125007_350006303293899090_n.jpg";
import fb2 from "../assets/images/gallery/photos/AwardCeremony2026/702051665_2699112693791516_7438569826337495576_n.jpg";
import fb3 from "../assets/images/gallery/photos/AwardCeremony2026/702064010_2699112283791557_6409814095350757349_n.jpg";
import fb4 from "../assets/images/gallery/photos/AwardCeremony2026/702087051_2699112483791537_5641882611819009816_n.jpg";
import fb5 from "../assets/images/gallery/photos/AwardCeremony2026/702094161_2699112623791523_1137279335811766909_n.jpg";
import fb6 from "../assets/images/gallery/photos/AwardCeremony2026/702107084_2699111743791611_4185937333306236328_n.jpg";
import fb7 from "../assets/images/gallery/photos/AwardCeremony2026/702191501_2699112190458233_7860505479694526610_n.jpg";
import fb8 from "../assets/images/gallery/photos/AwardCeremony2026/702209742_2699111300458322_4851501361847296435_n.jpg";
import fb9 from "../assets/images/gallery/photos/AwardCeremony2026/702273406_2699111453791640_6425016817942404446_n.jpg";
import fb10 from "../assets/images/gallery/photos/AwardCeremony2026/702325042_2701215580247894_8611988381996383593_n.jpg";
import fb11 from "../assets/images/gallery/photos/AwardCeremony2026/702621355_2701217093581076_2170575568894046260_n.jpg";
import fb12 from "../assets/images/gallery/photos/AwardCeremony2026/702718823_2701217206914398_1760117873653005247_n.jpg";

const AwardCeremony2026 = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Array of all photos
  const photos = [
    { id: 1, src: img1, alt: "Award Ceremony 2026 Photo 1" },
    { id: 2, src: img2, alt: "Award Ceremony 2026 Photo 2" },
    { id: 3, src: img3, alt: "Award Ceremony 2026 Photo 3" },
    { id: 4, src: img4, alt: "Award Ceremony 2026 Photo 4" },
    { id: 5, src: img5, alt: "Award Ceremony 2026 Photo 5" },
    { id: 6, src: img6, alt: "Award Ceremony 2026 Photo 6" },
    { id: 7, src: img7, alt: "Award Ceremony 2026 Photo 7" },
    { id: 8, src: img8, alt: "Award Ceremony 2026 Photo 8" },
    { id: 9, src: img9, alt: "Award Ceremony 2026 Photo 9" },
    { id: 10, src: img10, alt: "Award Ceremony 2026 Photo 10" },
    { id: 11, src: fb1, alt: "Award Ceremony 2026 Photo 11" },
    { id: 12, src: fb2, alt: "Award Ceremony 2026 Photo 12" },
    { id: 13, src: fb3, alt: "Award Ceremony 2026 Photo 13" },
    { id: 14, src: fb4, alt: "Award Ceremony 2026 Photo 14" },
    { id: 15, src: fb5, alt: "Award Ceremony 2026 Photo 15" },
    { id: 16, src: fb6, alt: "Award Ceremony 2026 Photo 16" },
    { id: 17, src: fb7, alt: "Award Ceremony 2026 Photo 17" },
    { id: 18, src: fb8, alt: "Award Ceremony 2026 Photo 18" },
    { id: 19, src: fb9, alt: "Award Ceremony 2026 Photo 19" },
    { id: 20, src: fb10, alt: "Award Ceremony 2026 Photo 20" },
    { id: 21, src: fb11, alt: "Award Ceremony 2026 Photo 21" },
    { id: 22, src: fb12, alt: "Award Ceremony 2026 Photo 22" },
  ];

  const handleImageClick = (photo) => {
    setSelectedImage(photo);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="main-content">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">AWARD CEREMONY 2026</h1>
          <ul>
            <li>
              <Link to="/" className="active">
                Home &gt;
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="active">
                Gallery &gt;
              </Link>
            </li>
            <li>
              <Link to="/gallery/photo" className="active">
                Photo Gallery &gt;
              </Link>
            </li>
            <li>Award Ceremony 2026</li>
          </ul>
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div className="sc-team team-style-1">
        <div
          className="container"
          style={{ paddingTop: "10px", paddingBottom: "70px" }}
        >
          <Box sx={{ textAlign: "center", mb: "40px", width: "100%" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: "#102d47",
              }}
            >
              AWARD CEREMONY 2026
            </Typography>
          </Box>

          <Box
            component="div"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)"
              },
              gap: "24px",
              width: "100%",
            }}
          >
            {photos.map((photo) => (
              <Box
                key={photo.id}
                component="div"
                sx={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.15)",
                  },
                }}
                onClick={() => handleImageClick(photo)}
              >
                <Box
                  component="img"
                  src={photo.src}
                  alt={photo.alt}
                  sx={{
                    width: "100%",
                    aspectRatio: "3/2", // Enforce landscape aspect ratio
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            ))}
          </Box>
        </div>
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <Box
          onClick={closeModal}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <Box
            component="img"
            src={selectedImage.src}
            alt={selectedImage.alt}
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
          />
          <Box
            component="button"
            onClick={closeModal}
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              "&:hover": {
                background: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            ×
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AwardCeremony2026;
