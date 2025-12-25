import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import "../styles/Gallery.css";
import "../styles/About.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";

// Import all images from AwardCeremony2018 folder
import image001 from "../assets/images/gallery/photos/AwardCeremony2018/001.jpg";
import image002 from "../assets/images/gallery/photos/AwardCeremony2018/002.jpg";
import image003 from "../assets/images/gallery/photos/AwardCeremony2018/003.jpg";
import image004 from "../assets/images/gallery/photos/AwardCeremony2018/004.jpg";
import image005 from "../assets/images/gallery/photos/AwardCeremony2018/005.jpg";
import image006 from "../assets/images/gallery/photos/AwardCeremony2018/006.jpg";
import image007 from "../assets/images/gallery/photos/AwardCeremony2018/007.jpg";
import image008 from "../assets/images/gallery/photos/AwardCeremony2018/008.jpg";
import image009 from "../assets/images/gallery/photos/AwardCeremony2018/009.jpg";
import image010 from "../assets/images/gallery/photos/AwardCeremony2018/010.jpg";
import image011 from "../assets/images/gallery/photos/AwardCeremony2018/011.jpg";
import image012 from "../assets/images/gallery/photos/AwardCeremony2018/012.jpg";
import image013 from "../assets/images/gallery/photos/AwardCeremony2018/013.jpg";
import image014 from "../assets/images/gallery/photos/AwardCeremony2018/014.jpg";
import image015 from "../assets/images/gallery/photos/AwardCeremony2018/015.jpg";
import image016 from "../assets/images/gallery/photos/AwardCeremony2018/016.jpg";
import image017 from "../assets/images/gallery/photos/AwardCeremony2018/017.jpg";
import image018 from "../assets/images/gallery/photos/AwardCeremony2018/018.jpg";
import image019 from "../assets/images/gallery/photos/AwardCeremony2018/019.jpg";
import image020 from "../assets/images/gallery/photos/AwardCeremony2018/020.jpg";
import image021 from "../assets/images/gallery/photos/AwardCeremony2018/021.jpg";

const AwardCeremony2018 = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Array of all photos
  const photos = [
    { id: 1, src: image001, alt: "Award Ceremony 2018 Photo 1" },
    { id: 2, src: image002, alt: "Award Ceremony 2018 Photo 2" },
    { id: 3, src: image003, alt: "Award Ceremony 2018 Photo 3" },
    { id: 4, src: image004, alt: "Award Ceremony 2018 Photo 4" },
    { id: 5, src: image005, alt: "Award Ceremony 2018 Photo 5" },
    { id: 6, src: image006, alt: "Award Ceremony 2018 Photo 6" },
    { id: 7, src: image007, alt: "Award Ceremony 2018 Photo 7" },
    { id: 8, src: image008, alt: "Award Ceremony 2018 Photo 8" },
    { id: 9, src: image009, alt: "Award Ceremony 2018 Photo 9" },
    { id: 10, src: image010, alt: "Award Ceremony 2018 Photo 10" },
    { id: 11, src: image011, alt: "Award Ceremony 2018 Photo 11" },
    { id: 12, src: image012, alt: "Award Ceremony 2018 Photo 12" },
    { id: 13, src: image013, alt: "Award Ceremony 2018 Photo 13" },
    { id: 14, src: image014, alt: "Award Ceremony 2018 Photo 14" },
    { id: 15, src: image015, alt: "Award Ceremony 2018 Photo 15" },
    { id: 16, src: image016, alt: "Award Ceremony 2018 Photo 16" },
    { id: 17, src: image017, alt: "Award Ceremony 2018 Photo 17" },
    { id: 18, src: image018, alt: "Award Ceremony 2018 Photo 18" },
    { id: 19, src: image019, alt: "Award Ceremony 2018 Photo 19" },
    { id: 20, src: image020, alt: "Award Ceremony 2018 Photo 20" },
    { id: 21, src: image021, alt: "Award Ceremony 2018 Photo 21" },
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
          <h1 className="page-title">AWARD CEREMONY 2018</h1>
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
            <li>Award Ceremony 2018</li>
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
              AWARD CEREMONY 2018
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

export default AwardCeremony2018;
