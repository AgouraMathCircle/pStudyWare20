import React from "react";
import { Link } from "react-router-dom";
import "../styles/Gallery.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import award2026Icon from "../assets/images/gallery/photos/AwardCeremony2026/IMG 1.jpeg";
import award2025Icon from "../assets/images/gallery/photos/AwardCeremony2025/017.jpg";
import award2024Icon from "../assets/images/gallery/photos/AwardCeremony2024/icon.jpeg";
import award2023Icon from "../assets/images/gallery/photos/AwardCeremony2023/icon.jpg";
import award2019Icon from "../assets/images/gallery/photos/AwardCeremony2019/icon.jpg";
import award2018Icon from "../assets/images/gallery/photos/AwardCeremony2018/icon.jpg";
import award2017Icon from "../assets/images/gallery/photos/AwardCeremony2017/icon.jpg";
import mathKangarooIcon from "../assets/images/gallery/photos/MathKangaroo2017/icon.jpg";
import amcClassIcon from "../assets/images/gallery/photos/amcClass/icon.jpg";
import fieldTripIcon from "../assets/images/gallery/photos/FieldTrip2016/icon.jpg";

const PhotoGallery = () => {
  const photoAlbums = [
    {
      title: "AWARD CEREMONY 2026",
      link: "/gallery/photo/AwardCeremony2026",
      image: award2026Icon,
    },
    {
      title: "AWARD CEREMONY 2025",
      link: "/gallery/photo/AwardCeremony2025",
      image: award2025Icon,
    },
    {
      title: "AWARD CEREMONY 2024",
      link: "/gallery/photo/AwardCeremony2024",
      image: award2024Icon,
    },
    {
      title: "AWARD CEREMONY 2023",
      link: "/gallery/photo/AwardCeremony2023",
      image: award2023Icon,
    },
    {
      title: "AWARD CEREMONY 2019",
      link: "/gallery/photo/AwardCeremony2019",
      image: award2019Icon,
    },
    {
      title: "AWARD CEREMONY 2018",
      link: "/gallery/photo/AwardCeremony2018",
      image: award2018Icon,
    },
    {
      title: "AWARD CEREMONY 2017",
      link: "/gallery/photo/AwardCeremony2017",
      image: award2017Icon,
    },
    {
      title: "MATH KANGAROO 2017",
      link: "/gallery/photo/MathKangaroo2017",
      image: mathKangarooIcon,
    },
    {
      title: "MATH KANGAROO",
      link: "/gallery/photo/MathKangaroo",
      image: mathKangarooIcon,
    },
    {
      title: "AMC CLASS",
      link: "/gallery/photo/AmcClass",
      image: amcClassIcon,
    },
    {
      title: "FIELD TRIP 2016",
      link: "/gallery/photo/FieldTrip2016",
      image: fieldTripIcon,
    },
    {
      title: "EC",
      link: "/gallery/photo/EC",
      image: amcClassIcon,
    },
  ];

  return (
    <div className="main-content gallery-page">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">PHOTO GALLERY</h1>
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
            <li>Photo Gallery</li>
          </ul>
        </div>
      </div>

      {/* Photo Albums Section */}
      <div className="sc-team team-style-1">
        <div className="container">
          <div className="row gallery-row1">
            {photoAlbums.map((album, index) => (
              <div key={index} className="col-lg-6">
                <div className="team-inner-item">
                  <div className="team-wrap">
                    <div className="team-img">
                      <Link to={album.link}>
                        <img src={album.image} alt={album.title} />
                      </Link>
                    </div>
                    <div className="team-item-text">
                      <div className="team-details">
                        <h3 className="team-name">
                          <Link to={album.link}>{album.title}</Link>
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
    </div>
  );
};

export default PhotoGallery;
