import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import "../styles/Gallery.css";
import "../styles/About.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";

// Import all images from amcClass folder
import image001 from "../assets/images/gallery/photos/amcClass/001.jpg";
import image002 from "../assets/images/gallery/photos/amcClass/002.jpg";
import image003 from "../assets/images/gallery/photos/amcClass/003.jpg";
import image004 from "../assets/images/gallery/photos/amcClass/004.jpg";
import image005 from "../assets/images/gallery/photos/amcClass/005.jpg";
import image006 from "../assets/images/gallery/photos/amcClass/006.jpg";
import image007 from "../assets/images/gallery/photos/amcClass/007.JPG";
import image008 from "../assets/images/gallery/photos/amcClass/008.JPG";
import image009 from "../assets/images/gallery/photos/amcClass/009.jpg";

const AmcClass = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Array of all photos
  const photos = [
    { id: 1, src: image001, alt: "AMC Class Photo 1" },
    { id: 2, src: image002, alt: "AMC Class Photo 2" },
    { id: 3, src: image003, alt: "AMC Class Photo 3" },
    { id: 4, src: image004, alt: "AMC Class Photo 4" },
    { id: 5, src: image005, alt: "AMC Class Photo 5" },
    { id: 6, src: image006, alt: "AMC Class Photo 6" },
    { id: 7, src: image007, alt: "AMC Class Photo 7" },
    { id: 8, src: image008, alt: "AMC Class Photo 8" },
    { id: 9, src: image009, alt: "AMC Class Photo 9" },
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
          <h1 className="page-title">AMC CLASS</h1>
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
            <li>AMC Class</li>
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
              AMC CLASS PHOTOS
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

export default AmcClass;
