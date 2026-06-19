import React from "react";

const Services = () => {
  const services = [
    {
      title: "Online Consultation",
      desc: "Consult with expert doctors anytime.",
    },
    {
      title: "Digital Prescription",
      desc: "Get instant e-prescriptions online.",
    },
    {
      title: "Easy Appointments",
      desc: "Schedule consultations quickly.",
    },
    {
      title: "Diagnostics & Checkups",
      desc: "Book medical tests with ease.",
    },
    {
      title: "Secure Healthcare",
      desc: "Safe and private patient data management.",
    },
  ];

  return (
    <div className="services-section">

      <h1 className="services-title">Our Services</h1>

      <p className="services-text">
        Modern healthcare solutions designed to provide secure,
        fast, and reliable medical support anytime.
      </p>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-box" key={index}>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Services;