import React from "react";
import { Link } from "react-router-dom";
import "../styles/Gallery.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
// Import news image
import indiaWestImg from "../assets/images/gallery/news/IndiaWest_AMCFest2017.jpg";

const NewsGallery = () => {
  const newsArticles = [
    {
      title: "India West - 2017",
      url: "https://www.indiawest.com/news/global_indian/agoura-math-circle-founded-by-teen-pranav-kalyan-helping-students/article_cd3fd3f0-4b1d-11e7-9794-17deed101e75.html",
      image: indiaWestImg,
    },
  ];

  const handleNewsClick = (url, e) => {
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
          <h1 className="page-title">GALLERY</h1>
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
            <li>News Gallery</li>
          </ul>
        </div>
      </div>

      {/* News Gallery Section */}
      <div id="sc-about faq" className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1">
        <div className="faq-title text-center">
          <h2 className="title mb-20">NEWS GALLERY</h2>
        </div>
        <section className="Material-contact-section section-padding section-dark">
          <div className="sc-team team-style-1">
            <div className="container pb-60">
              <div className="row gallery-row1 text-center">
                {newsArticles.map((article, index) => (
                  <div key={index} className="col-lg-4">
                    <div className="team-inner-item">
                      <div className="team-wrap team-wrap1">
                        <div className="team-img">
                          <a
                            className="image-link"
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleNewsClick(article.url, e)}
                          >
                            <img src={article.image} alt={article.title} />
                          </a>
                        </div>
                        <div className="team-item-text">
                          <div className="team-details">
                            <h3 className="team-name">
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => handleNewsClick(article.url, e)}
                              >
                                {article.title}
                              </a>
                            </h3>
                          </div>
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

export default NewsGallery;

