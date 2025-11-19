import React from "react";
import { Link } from "react-router-dom";
import "../styles/Gallery.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import photoGalleryImg from "../assets/images/gallery/photo.jpg";
import videoGalleryImg from "../assets/images/gallery/video.jpg";
import newsGalleryImg from "../assets/images/gallery/news.jpg";

const Gallery = () => {
  return (
    <div className="main-content">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">GALLERY</h1>
          <ul>
            <li>
              <Link to="/" className="active">
                Home &gt;
              </Link>
            </li>
            <li className="active">Gallery</li>
          </ul>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="sc-team team-style-1">
        <div className="container">
          <div className="row gallery-row1">
            <div className="col-lg-6">
              <div className="team-inner-item">
                <div className="team-wrap team-wrap1">
                  <div className="team-img">
                    <Link to="/gallery/photo">
                      <img src={photoGalleryImg} alt="Photo Gallery" />
                    </Link>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <Link to="/gallery/photo">PHOTO GALLERY</Link>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="team-inner-item">
                <div className="team-wrap">
                  <div className="team-img">
                    <Link to="/gallery/video">
                      <img src={videoGalleryImg} alt="Video Gallery" />
                    </Link>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <Link to="/gallery/video">VIDEO GALLERY</Link>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row gallery-row">
            <div className="col-lg-6">
              <div className="team-inner-item">
                <div className="team-wrap">
                  <div className="team-img">
                    <Link to="/gallery/news">
                      <img src={newsGalleryImg} alt="News Gallery" />
                    </Link>
                  </div>
                  <div className="team-item-text">
                    <div className="team-details">
                      <h3 className="team-name">
                        <Link to="/gallery/news">NEWS GALLERY</Link>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
