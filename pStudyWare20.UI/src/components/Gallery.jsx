import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../styles/Gallery.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Updated gallery data with correct image paths
  const galleryItems = [
    {
      id: 1,
      title: "AMC Class Session",
      type: "image",
      src: "/images/gallery/photos/amcClass/001.jpg",
      thumbnail: "/images/gallery/photos/amcClass/001.jpg",
    },
    {
      id: 2,
      title: "Math Class Activity",
      type: "image",
      src: "/images/gallery/photos/amcClass/002.jpg",
      thumbnail: "/images/gallery/photos/amcClass/002.jpg",
    },
    {
      id: 3,
      title: "Student Learning",
      type: "image",
      src: "/images/gallery/photos/amcClass/003.jpg",
      thumbnail: "/images/gallery/photos/amcClass/003.jpg",
    },
    {
      id: 4,
      title: "Classroom Discussion",
      type: "image",
      src: "/images/gallery/photos/amcClass/004.jpg",
      thumbnail: "/images/gallery/photos/amcClass/004.jpg",
    },
    {
      id: 5,
      title: "Group Study Session",
      type: "image",
      src: "/images/gallery/photos/amcClass/005.jpg",
      thumbnail: "/images/gallery/photos/amcClass/005.jpg",
    },
    {
      id: 6,
      title: "Interactive Learning",
      type: "image",
      src: "/images/gallery/photos/amcClass/006.jpg",
      thumbnail: "/images/gallery/photos/amcClass/006.jpg",
    },
    {
      id: 7,
      title: "Student Presentation",
      type: "image",
      src: "/images/gallery/photos/amcClass/007.JPG",
      thumbnail: "/images/gallery/photos/amcClass/007.JPG",
    },
    {
      id: 8,
      title: "Classroom Activity",
      type: "image",
      src: "/images/gallery/photos/amcClass/008.JPG",
      thumbnail: "/images/gallery/photos/amcClass/008.JPG",
    },
    {
      id: 9,
      title: "Learning Environment",
      type: "image",
      src: "/images/gallery/photos/amcClass/009.jpg",
      thumbnail: "/images/gallery/photos/amcClass/009.jpg",
    },
    {
      id: 10,
      title: "Video Session 1",
      type: "video",
      src: "https://www.youtube.com/embed/sample-video-id",
      thumbnail: "/images/gallery/video/video-01.jpg",
    },
    {
      id: 11,
      title: "Video Session 2",
      type: "video",
      src: "https://www.youtube.com/embed/sample-video-id-2",
      thumbnail: "/images/gallery/video/video-02.jpg",
    },
    {
      id: 12,
      title: "Video Session 3",
      type: "video",
      src: "https://www.youtube.com/embed/sample-video-id-3",
      thumbnail: "/images/gallery/video/video-03.jpg",
    },
  ];

  const handleImageClick = (item, index) => {
    setSelectedImage(item);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePrevious = () => {
    const newIndex =
      selectedIndex === 0 ? galleryItems.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedImage(galleryItems[newIndex]);
  };

  const handleNext = () => {
    const newIndex =
      selectedIndex === galleryItems.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedImage(galleryItems[newIndex]);
  };

  return (
    <Box className="main-content">
      {/* Breadcrumbs Section */}
      <Box className="sc-breadcrumbs breadcrumbs-overlay">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography variant="h1" className="page-title">
            GALLERY
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="li" sx={{ display: "inline-block" }}>
              <Button
                onClick={() => handleNavigation("/")}
                sx={{
                  color: "white",
                  textDecoration: "underline",
                  p: 0,
                  minWidth: "auto",
                  fontSize: "inherit",
                  textTransform: "none",
                }}
              >
                Home &gt;
              </Button>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                Gallery
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Gallery Section */}
      <Box id="sc-gallery" className="sc-gallery pt-80 pb-70 md-pt-40">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Our Gallery
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem" }}
            >
              Explore moments from our classes, events, and community activities
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {galleryItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    borderRadius: "12px",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                    },
                  }}
                  onClick={() => handleImageClick(item, index)}
                >
                  <Box sx={{ position: "relative", padding: "8px" }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={item.thumbnail}
                      alt={item.title}
                      sx={{
                        objectFit: "cover",
                        borderRadius: "8px",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    />
                    {item.type === "video" && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2,
                        }}
                      >
                        <PlayIcon sx={{ color: "white", fontSize: "2rem" }} />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        lineHeight: 1.4,
                        color: "text.primary",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Image/Video Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "rgba(0,0,0,0.95)",
            color: "white",
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              color: "white",
              zIndex: 10,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedImage && (
            <Box sx={{ position: "relative" }}>
              {selectedImage.type === "video" ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  <iframe
                    src={selectedImage.src}
                    title={selectedImage.title}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: "8px" }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    minHeight: "60vh",
                  }}
                >
                  <Box
                    component="img"
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "80vh",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}
                  />
                </Box>
              )}

              <Typography
                variant="h5"
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  fontWeight: 600,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                }}
              >
                {selectedImage.title}
              </Typography>

              {/* Navigation Buttons */}
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 15,
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.8)",
                  },
                }}
              >
                <PrevIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 15,
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.8)",
                  },
                }}
              >
                <NextIcon />
              </IconButton>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Gallery;
