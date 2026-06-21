import React from "react";
import { Link } from "react-router-dom";
import "../styles/Gallery.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
// Import video thumbnails
import video01Img from "../assets/images/gallery/video/video-01.jpg";
import video02Img from "../assets/images/gallery/video/video-02.jpg";
import video03Img from "../assets/images/gallery/video/video-03.jpg";
import video04Img from "../assets/images/gallery/video/video-04.jpg";

const VideoGallery = () => {
  const videos = [
    {
      title: "Video 1",
      url: "https://www.youtube.com/watch?v=j_CUTnHSNHQ",
      thumbnail: video01Img,
    },
    {
      title: "Video 2",
      url: "https://www.youtube.com/watch?v=LnDwNFbK61g",
      thumbnail: video02Img,
    },
    {
      title: "Video 3",
      url: "https://www.youtube.com/watch?v=ggPqGYdPxNU",
      thumbnail: video03Img,
    },
    {
      title: "Video 4",
      url: "https://www.youtube.com/watch?v=6rUbesvZ9cM",
      thumbnail: video04Img,
    },
  ];

  const handleVideoClick = (url, e) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="main-content">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">VIDEO GALLERY</h1>
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
            <li>Video Gallery</li>
          </ul>
        </div>
      </div>

      {/* Video Gallery Section */}
      <div id="sc-about faq" className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1">
        <div className="faq-title text-center">
          <h2 className="title mb-20">VIDEO GALLERY</h2>
        </div>
        <section className="Material-contact-section section-padding section-dark">
          <div className="sc-team team-style-1">
            <div className="container pb-60">
              <div className="row gallery-row1 text-center">
                {videos.map((video, index) => (
                  <div key={index} className="col-lg-6">
                    <div className="team-inner-item">
                      <div className="team-wrap team-wrap1">
                        <div className="team-img">
                          <a
                            className="image-link"
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleVideoClick(video.url, e)}
                          >
                            <img src={video.thumbnail} alt={video.title} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VideoGallery;

