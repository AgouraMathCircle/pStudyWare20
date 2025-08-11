import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  keyframes,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// Import images from src/assets
import eventsImage from "../../assets/images/courses/8.png";
import scheduleImage from "../../assets/images/about/12.jpg";
import mediaImage from "../../assets/images/courses/10.png";

// Keyframe animations
const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Courses = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        padding: { xs: "40px 0", md: "110px 0" },
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: { xs: "20px", md: "55px" },
            animation: `${fadeInAnimation} 0.8s ease-out`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#40c1ec",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            Agoura Math Circle
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: "#102d47",
              fontWeight: 700,
              "@media (max-width: 600px)": {
                fontSize: "28px",
              },
            }}
          >
            What We Do
          </Typography>
        </Box>

        {/* Cards Grid */}
        <Grid container spacing={3}>
          {/* Events/Programs Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0px 0px 16px rgba(4, 59, 80, 0.1)",
                borderRadius: "5px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                animation: `${fadeInAnimation} 0.8s ease-out 0.1s both`,
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 8px 25px rgba(4, 59, 80, 0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={eventsImage}
                alt="Events and Programs"
                sx={{
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <CardContent
                sx={{
                  padding: "24px 20px 20px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#102d47",
                    fontWeight: 600,
                    marginBottom: "15px",
                    lineHeight: 1.3,
                    "&:hover": {
                      color: "#53b50a",
                    },
                  }}
                >
                  EVENTS/PROGRAMS
                </Typography>
                <Box sx={{ marginBottom: "15px" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#505050",
                      lineHeight: 1.6,
                      marginBottom: "8px",
                    }}
                  >
                    Math Circle - Agoura, CA Chapter
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#505050",
                      lineHeight: 1.6,
                      marginBottom: "8px",
                    }}
                  >
                    Math Circle - Charlotte, NC Chapter
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#505050",
                      lineHeight: 1.6,
                      marginBottom: "8px",
                    }}
                  >
                    Math Circle - Online Chapter
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#505050",
                      lineHeight: 1.6,
                      marginBottom: "8px",
                    }}
                  >
                    Engineering Circle - Intro to Data Science /AI
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#505050",
                      lineHeight: 1.6,
                      marginBottom: "8px",
                    }}
                  >
                    Test Preparation - ACT and SAT/PSAT
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#505050",
                      lineHeight: 1.6,
                      marginBottom: "8px",
                    }}
                  >
                    Triangular Talks - Every Month
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#505050",
                      lineHeight: 1.6,
                      marginBottom: "15px",
                    }}
                  >
                    Satellite Program
                  </Typography>
                  <Button
                    variant="contained"
                    href="/studentregistration"
                    component="a"
                    sx={{
                      backgroundColor: "#53b50a",
                      color: "#ffffff",
                      padding: "8px 16px",
                      borderRadius: "3px",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#4a9d09",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#505050",
                      lineHeight: 1.6,
                      marginBottom: "8px",
                    }}
                  >
                    Math Kangaroo -{" "}
                    <Button
                      variant="text"
                      href="https://mathkangaroo.oasis-lms.com/Public/Catalog/Home.aspx?Criteria=44&Option=503&tab=2"
                      component="a"
                      target="_blank"
                      sx={{
                        color: "#53b50a",
                        textTransform: "none",
                        padding: "0",
                        minWidth: "auto",
                        fontSize: "14px",
                        fontWeight: 600,
                        "&:hover": {
                          color: "#4a9d09",
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      Register
                    </Button>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Fall Semester 2024 Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0px 0px 16px rgba(4, 59, 80, 0.1)",
                borderRadius: "5px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 8px 25px rgba(4, 59, 80, 0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={scheduleImage}
                alt="Fall Semester 2024 Schedule"
                sx={{
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <CardContent
                sx={{
                  padding: "24px 20px 20px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#102d47",
                    fontWeight: 600,
                    marginBottom: "15px",
                    lineHeight: 1.3,
                  }}
                >
                  Fall Semester 2024
                </Typography>
                <List sx={{ padding: 0 }}>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="08/24/2024: 2.00 - 5 PM (SATURDAY)"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="09/07/2024: 2.00 - 5 PM (SATURDAY)"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="09/21/2024: 2.00 - 5 PM (SATURDAY)"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="10/05/2024: 2.00 - 5 PM (SATURDAY)"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="10/19/2024: 2.00 - 5 PM (SATURDAY)"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="11/02/2024: 2.00 - 5 PM (SATURDAY)"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="11/16/2024: 2.00 - 5 PM (SATURDAY)"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="12/07/2024: 2.00 - 5 PM (SATURDAY)"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary="12/21/2024: 2.00 - 4 PM FINAL EXAM"
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          color: "#505050",
                          lineHeight: 1.4,
                          fontWeight: 600,
                        },
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Media/News Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0px 0px 16px rgba(4, 59, 80, 0.1)",
                borderRadius: "5px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                animation: `${fadeInAnimation} 0.8s ease-out 0.3s both`,
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 8px 25px rgba(4, 59, 80, 0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={mediaImage}
                alt="Media and News"
                sx={{
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <CardContent
                sx={{
                  padding: "24px 20px 20px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#102d47",
                    fontWeight: 600,
                    marginBottom: "15px",
                    lineHeight: 1.3,
                  }}
                >
                  MEDIA/NEWS
                </Typography>
                <List sx={{ padding: 0, marginBottom: "15px" }}>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary={
                        <Button
                          variant="text"
                          href="https://timesofindia.indiatimes.com/city/madurai/us-settled-siblings-keen-to-teach-city-students-math-for-free/articleshow/70252199.cms"
                          component="a"
                          target="_blank"
                          sx={{
                            color: "#53b50a",
                            textTransform: "none",
                            padding: "0",
                            minWidth: "auto",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            justifyContent: "flex-start",
                            "&:hover": {
                              color: "#4a9d09",
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          AMC LAUNCHED IN INDIA, JULY 2019
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary={
                        <Button
                          variant="text"
                          href="https://www.youtube.com/watch?v=j_CUTnHSNHQ"
                          component="a"
                          target="_blank"
                          sx={{
                            color: "#53b50a",
                            textTransform: "none",
                            padding: "0",
                            minWidth: "auto",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            justifyContent: "flex-start",
                            "&:hover": {
                              color: "#4a9d09",
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          CBS LOS ANGELES
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary={
                        <Button
                          variant="text"
                          href="https://www.youtube.com/watch?v=LnDwNFbK61g"
                          component="a"
                          target="_blank"
                          sx={{
                            color: "#53b50a",
                            textTransform: "none",
                            padding: "0",
                            minWidth: "auto",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            justifyContent: "flex-start",
                            "&:hover": {
                              color: "#4a9d09",
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          JUNIORITY TV
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary={
                        <Button
                          variant="text"
                          href="https://www.indiawest.com/news/global_indian/agoura-math-circle-founded-by-teen-pranav-kalyan-helping-students/article_cd3fd3f0-4b1d-11e7-9794-17deed101e75.html"
                          component="a"
                          target="_blank"
                          sx={{
                            color: "#53b50a",
                            textTransform: "none",
                            padding: "0",
                            minWidth: "auto",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            justifyContent: "flex-start",
                            "&:hover": {
                              color: "#4a9d09",
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          INDIA WEST
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary={
                        <Button
                          variant="text"
                          href="https://twitter.com/Agouramathcirle"
                          component="a"
                          target="_blank"
                          sx={{
                            color: "#53b50a",
                            textTransform: "none",
                            padding: "0",
                            minWidth: "auto",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            justifyContent: "flex-start",
                            "&:hover": {
                              color: "#4a9d09",
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          Join AMC Twitter
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary={
                        <Button
                          variant="text"
                          href="https://www.facebook.com/profile.php?id=100010784343153"
                          component="a"
                          target="_blank"
                          sx={{
                            color: "#53b50a",
                            textTransform: "none",
                            padding: "0",
                            minWidth: "auto",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            justifyContent: "flex-start",
                            "&:hover": {
                              color: "#4a9d09",
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          AMC Facebook
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary={
                        <Button
                          variant="text"
                          href="https://www.linkedin.com/in/agouramathcircle/"
                          component="a"
                          target="_blank"
                          sx={{
                            color: "#53b50a",
                            textTransform: "none",
                            padding: "0",
                            minWidth: "auto",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            justifyContent: "flex-start",
                            "&:hover": {
                              color: "#4a9d09",
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          Connect in Linkedin
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ padding: "4px 0" }}>
                    <ListItemText
                      primary={
                        <Button
                          variant="text"
                          href="https://www.instagram.com/agouramathcircle/"
                          component="a"
                          target="_blank"
                          sx={{
                            color: "#53b50a",
                            textTransform: "none",
                            padding: "0",
                            minWidth: "auto",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            justifyContent: "flex-start",
                            "&:hover": {
                              color: "#4a9d09",
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          Follow Instagram
                        </Button>
                      }
                    />
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  href="/news-gallery"
                  component="a"
                  sx={{
                    backgroundColor: "#53b50a",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "3px",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#4a9d09",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Courses;
