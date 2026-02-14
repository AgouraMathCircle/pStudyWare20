import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Container, IconButton, useTheme, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import client1Img from "../../assets/images/clients/clients-1.png";
import client2Img from "../../assets/images/clients/clients-2.png";
import client3Img from "../../assets/images/clients/clients-3.png";
import client4Img from "../../assets/images/clients/clients-4.png";
import client5Img from "../../assets/images/clients/clients-5.png";
import client6Img from "../../assets/images/clients/clients-6.png";
import client7Img from "../../assets/images/clients/clients-7.png";
import client8Img from "../../assets/images/clients/clients-8.png";

const SPONSORS = [
  { image: client1Img, alt: "Alapio", link: "https://www.alapio.org" },
  { image: client3Img, alt: "", link: null },
  { image: client4Img, alt: "", link: "https://nextphase-recruiting.com" },
  { image: client5Img, alt: "", link: null },
  { image: client6Img, alt: "", link: "http://springinfoservices.com" },
  { image: client7Img, alt: "", link: "https://www.camreal.com" },
  { image: client8Img, alt: "Bits informatics", link: "https://bitsi.in" },
  { image: client2Img, alt: "", link: null },
];

const AUTOPLAY_MS = 5000;

const Sponsors = ({ variant }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const itemsPerSlide = isMobile ? 1 : 5;
  const totalSlides = useMemo(
    () => Math.ceil(SPONSORS.length / itemsPerSlide),
    [itemsPerSlide]
  );

  useEffect(() => {
    setIndex((i) => (i >= totalSlides ? 0 : i));
  }, [totalSlides]);

  useEffect(() => {
    if (paused || totalSlides <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % totalSlides);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, totalSlides]);

  const next = () => setIndex((i) => (i + 1) % totalSlides);
  const prev = () => setIndex((i) => (i - 1 + totalSlides) % totalSlides);

  const slice = SPONSORS.slice(
    index * itemsPerSlide,
    index * itemsPerSlide + itemsPerSlide
  );

  const background = variant === "donate" ? "#f8f9fa" : "#e3f8f1";

  return (
    <Box
      sx={{
        background,
        py: 6,
        mb: 8,
      }}
    >
      <Container>
        <Typography
          variant="h2"
          sx={{ textAlign: "center", mb: 4, fontWeight: 600, color: "#102d47" }}
        >
          OUR SPONSORS
        </Typography>

        <Box
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          sx={{ position: "relative", maxWidth: 1000, mx: "auto" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
              minHeight: 120,
            }}
          >
            {slice.map((sponsor, i) => (
              <Box
                key={i}
                sx={{
                  flex: "0 0 auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 180,
                  height: 100,
                }}
              >
                {sponsor.link ? (
                  <Box
                    component="a"
                    href={sponsor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: "flex", alignItems: "center", height: "100%" }}
                  >
                    <Box
                      component="img"
                      src={sponsor.image}
                      alt={sponsor.alt || "Sponsor"}
                      sx={{ maxHeight: "100px", objectFit: "contain" }}
                    />
                  </Box>
                ) : (
                  <Box
                    component="img"
                    src={sponsor.image}
                    alt={sponsor.alt || "Sponsor"}
                    sx={{ maxHeight: "100px", objectFit: "contain" }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {totalSlides > 1 && (
            <>
              <IconButton
                onClick={prev}
                sx={{
                  position: "absolute",
                  left: { xs: -8, sm: -48 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "white" },
                  boxShadow: 1,
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={next}
                sx={{
                  position: "absolute",
                  right: { xs: -8, sm: -48 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "white" },
                  boxShadow: 1,
                }}
              >
                <ChevronRightIcon />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 0.5,
                  mt: 2,
                }}
              >
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setIndex(i)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: index === i ? "primary.main" : "grey.400",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Sponsors;
