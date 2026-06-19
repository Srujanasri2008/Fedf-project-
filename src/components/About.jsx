import React from "react";

const About = () => {
  const services = [
    {
      img: "https://cdn-icons-png.flaticon.com/128/387/387569.png",
      title: "Video Consultation",
      desc: "Connect with doctors securely from anywhere.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/128/2693/2693507.png",
      title: "Easy Appointments",
      desc: "Book and manage appointments with ease.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/128/2921/2921222.png",
      title: "Digital Prescription",
      desc: "Receive prescriptions instantly in PDF format.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/128/3064/3064197.png",
      title: "Secure & Private",
      desc: "Your data is protected with top security.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
      title: "Expert Doctors",
      desc: "Consult with qualified doctors.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/128/2966/2966486.png",
      title: "Better Healthcare",
      desc: "Quality care and support for everyone.",
    },
  ];

  return (
    <div className="about-section">

      <h1 className="about-title">About Telemed UI</h1>

      <p className="about-text">
        Telemed UI Consultation is an online healthcare platform
        designed to simplify doctor-patient communication through
        video consultation, appointment booking, digital prescriptions,
        and secure medical services.
      </p>

      <div className="services-container">
        {services.map((service, index) => (
          <div className="service-card" key={index}>

            <img
              src={service.img}
              alt={service.title}
              className="service-icon"
            />

            <h3>{service.title}</h3>

            <p>{service.desc}</p>

          </div>
        ))}
      </div>

    </div>
  );
};

export default About;