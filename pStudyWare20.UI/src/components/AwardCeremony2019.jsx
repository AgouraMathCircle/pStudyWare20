import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import "../styles/Gallery.css";
import "../styles/About.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";

// Import all images from AwardCeremony2019 folder
import image001 from "../assets/images/gallery/photos/AwardCeremony2019/001.jpg";
import image002 from "../assets/images/gallery/photos/AwardCeremony2019/002.jpg";
import image003 from "../assets/images/gallery/photos/AwardCeremony2019/003.jpg";
import image004 from "../assets/images/gallery/photos/AwardCeremony2019/004.jpg";
import image005 from "../assets/images/gallery/photos/AwardCeremony2019/005.jpg";
import image006 from "../assets/images/gallery/photos/AwardCeremony2019/006.jpg";
import image007 from "../assets/images/gallery/photos/AwardCeremony2019/007.jpg";
import image008 from "../assets/images/gallery/photos/AwardCeremony2019/008.jpg";
import image009 from "../assets/images/gallery/photos/AwardCeremony2019/009.jpg";
import image010 from "../assets/images/gallery/photos/AwardCeremony2019/010.jpg";
import image011 from "../assets/images/gallery/photos/AwardCeremony2019/011.jpg";
import image012 from "../assets/images/gallery/photos/AwardCeremony2019/012.jpg";
import image013 from "../assets/images/gallery/photos/AwardCeremony2019/013.jpg";
import image014 from "../assets/images/gallery/photos/AwardCeremony2019/014.jpg";
import image015 from "../assets/images/gallery/photos/AwardCeremony2019/015.jpg";
import image016 from "../assets/images/gallery/photos/AwardCeremony2019/016.jpg";
import image017 from "../assets/images/gallery/photos/AwardCeremony2019/017.jpg";
import image018 from "../assets/images/gallery/photos/AwardCeremony2019/018.jpg";
import image019 from "../assets/images/gallery/photos/AwardCeremony2019/019.jpg";
import image020 from "../assets/images/gallery/photos/AwardCeremony2019/020.jpg";
import image021 from "../assets/images/gallery/photos/AwardCeremony2019/021.jpg";
import image022 from "../assets/images/gallery/photos/AwardCeremony2019/022.jpg";
import image023 from "../assets/images/gallery/photos/AwardCeremony2019/023.jpg";
import image024 from "../assets/images/gallery/photos/AwardCeremony2019/024.jpg";
import image025 from "../assets/images/gallery/photos/AwardCeremony2019/025.jpg";
import image026 from "../assets/images/gallery/photos/AwardCeremony2019/026.jpg";
import image027 from "../assets/images/gallery/photos/AwardCeremony2019/027.jpg";
import image028 from "../assets/images/gallery/photos/AwardCeremony2019/028.jpg";

const AwardCeremony2019 = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Array of all photos
  const photos = [
    { id: 1, src: image001, alt: "Award Ceremony 2019 Photo 1" },
    { id: 2, src: image002, alt: "Award Ceremony 2019 Photo 2" },
    { id: 3, src: image003, alt: "Award Ceremony 2019 Photo 3" },
    { id: 4, src: image004, alt: "Award Ceremony 2019 Photo 4" },
    { id: 5, src: image005, alt: "Award Ceremony 2019 Photo 5" },
    { id: 6, src: image006, alt: "Award Ceremony 2019 Photo 6" },
    { id: 7, src: image007, alt: "Award Ceremony 2019 Photo 7" },
    { id: 8, src: image008, alt: "Award Ceremony 2019 Photo 8" },
    { id: 9, src: image009, alt: "Award Ceremony 2019 Photo 9" },
    { id: 10, src: image010, alt: "Award Ceremony 2019 Photo 10" },
    { id: 11, src: image011, alt: "Award Ceremony 2019 Photo 11" },
    { id: 12, src: image012, alt: "Award Ceremony 2019 Photo 12" },
    { id: 13, src: image013, alt: "Award Ceremony 2019 Photo 13" },
    { id: 14, src: image014, alt: "Award Ceremony 2019 Photo 14" },
    { id: 15, src: image015, alt: "Award Ceremony 2019 Photo 15" },
    { id: 16, src: image016, alt: "Award Ceremony 2019 Photo 16" },
    { id: 17, src: image017, alt: "Award Ceremony 2019 Photo 17" },
    { id: 18, src: image018, alt: "Award Ceremony 2019 Photo 18" },
    { id: 19, src: image019, alt: "Award Ceremony 2019 Photo 19" },
    { id: 20, src: image020, alt: "Award Ceremony 2019 Photo 20" },
    { id: 21, src: image021, alt: "Award Ceremony 2019 Photo 21" },
    { id: 22, src: image022, alt: "Award Ceremony 2019 Photo 22" },
    { id: 23, src: image023, alt: "Award Ceremony 2019 Photo 23" },
    { id: 24, src: image024, alt: "Award Ceremony 2019 Photo 24" },
    { id: 25, src: image025, alt: "Award Ceremony 2019 Photo 25" },
    { id: 26, src: image026, alt: "Award Ceremony 2019 Photo 26" },
    { id: 27, src: image027, alt: "Award Ceremony 2019 Photo 27" },
    { id: 28, src: image028, alt: "Award Ceremony 2019 Photo 28" },
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
          <h1 className="page-title">AWARD CEREMONY 2019</h1>
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
            <li>Award Ceremony 2019</li>
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
              AWARD CEREMONY 2019
            </Typography>
          </Box>

          <Box
            component="div"
            className="row"
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              margin: 0,
              gap: 4,
            }}
          >
            {photos.map((photo) => (
              <Box
                key={photo.id}
                component="div"
                className="col-lg-3"
                sx={{
                  flex: {
                    xs: "0 0 100%",
                    sm: "0 0 calc(50% - 16px)",
                    md: "0 0 calc(25% - 24px)",
                    lg: "0 0 calc(25% - 24px)",
                  },
                  maxWidth: {
                    xs: "100%",
                    sm: "calc(50% - 16px)",
                    md: "calc(25% - 24px)",
                    lg: "calc(25% - 24px)",
                  },
                  padding: 0,
                  mb: 0,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
                    height: "100%",
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
                    }}
                  />
                </Box>
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

export default AwardCeremony2019;
