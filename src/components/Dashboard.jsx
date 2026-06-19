// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {

//   const navigate = useNavigate();

//   const modules = [
//     "Pre-Call Check",
//     "Video Interface",
//     "Symptom Input",
//     "Prescription Form",
//     "Doctor Notes",
//     "PDF Prescription",
//     "Post-Call Summary",
//     "History Log",
//     "Notifications",
//     "Admin Module",
//   ];

//   return (
//     <div className="dashboard-container">

//       {/* Sidebar */}
//       <div className="sidebar">

//         {/* <h2 className="logo">TELEMED UI</h2> */}

//         {/* <ul>
//           {modules.map((module, index) => (
//             <li key={index}>{module}</li>
//           ))}
//         </ul> */}
        
//         <div className="sidebar-menu">

//   {modules.map((module, index) => (
//     <div className="menu-item" key={index}>
//       {index + 1}. {module}
//     </div>
//   ))}

// </div>

//       </div>

//       {/* Main Content */}
//       <div className="dashboard-main">

//         {/* Topbar */}
//         <div className="topbar">

//           <h1>Dashboard</h1>

//           <button
//             className="logout-btn"
//             onClick={() => navigate("/")}
//           >
//             Logout
//           </button>

//         </div>

//         {/* Welcome Box */}
//         <div className="welcome-box">

//           <h2>Welcome to Telemed Dashboard</h2>

//           <p>
//             Manage consultations, prescriptions, appointments,
//             and healthcare services from one platform.
//           </p>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Dashboard;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// // import PreCallCheck from "./dashboardModules.jsx/PreCallCheck";



// const Dashboard = () => {

//   const navigate = useNavigate();

//   const [selectedModule, setSelectedModule] =
//     useState("Pre-Call Check");

//   const modules = [
//     "Pre-Call Check",
//     "Video Interface",
//     "Symptom Input",
//     "Prescription Form",
//     "Doctor Notes",
//     "PDF Prescription",
//     "Post-Call Summary",
//     "History Log",
//     "Notifications",
//     "Admin Module",
//   ];


//   const renderModule = () => {
//     switch (selectedModule) {
//       case "Pre-Call Check":
//         return <PreCallCheck />;

//       case "Video Interface":
//         return <VideoInterface />;

//       case "Symptom Input":
//         return <SymptomInput />;

//       case "Prescription Form":
//         return <PrescriptionForm />;

//       case "Doctor Notes":
//         return <DoctorNotes />;

//       case "PDF Prescription":
//         return <PDFPrescription />;

//       case "Post-Call Summary":
//         return <PostCallSummary />;

//       case "History Log":
//         return <HistoryLog />;

//       case "Notifications":
//         return <Notifications />;

//       case "Admin Module":
//         return <AdminModule />;

//       default:
//         return <PreCallCheck />;
//     }
//   };



//   return (
//     <div className="dashboard-container">

//       {/* Sidebar */}
//       <div className="sidebar">

//         <div className="sidebar-menu">

//           {modules.map((module, index) => (
//             <div
//               key={index}
//               className={`menu-item ${
//                 selectedModule === module ? "active" : ""
//               }`}
//               onClick={() => setSelectedModule(module)}
//             >
//               {index + 1}. {module}
//             </div>
//           ))}

//         </div>

//       </div>

//       {/* Main */}
//       <div className="dashboard-main">

//         {/* Topbar */}
//         <div className="topbar">

//           <h1>Dashboard</h1>

//           <button
//             className="logout-btn"
//             onClick={() => navigate("/")}
//           >
//             Logout
//           </button>

//         </div>

//         {/* Dynamic Content */}
//         <div className="module-content">

//           <h2>{selectedModule}</h2>

//           {/* Different Content */}

//           {selectedModule === "Pre-Call Check" && (
//             <div>
//               <p>Check microphone, camera and internet connection.</p>
//             </div>
//           )}

//           {selectedModule === "Video Interface" && (
//             <div>
//               <p>Start secure doctor-patient video consultation.</p>
//             </div>
//           )}

//           {selectedModule === "Symptom Input" && (
//             <div>
//               <p>Enter patient symptoms and medical history.</p>
//             </div>
//           )}

//           {selectedModule === "Prescription Form" && (
//             <div>
//               <p>Create and manage digital prescriptions.</p>
//             </div>
//           )}

//           {selectedModule === "Doctor Notes" && (
//             <div>
//               <p>Add consultation notes and observations.</p>
//             </div>
//           )}

//           {selectedModule === "PDF Prescription" && (
//             <div>
//               <p>Generate downloadable prescription PDF.</p>
//             </div>
//           )}

//           {selectedModule === "Post-Call Summary" && (
//             <div>
//               <p>View consultation summary and recommendations.</p>
//             </div>
//           )}

//           {selectedModule === "History Log" && (
//             <div>
//               <p>Track previous consultations and records.</p>
//             </div>
//           )}

//           {selectedModule === "Notifications" && (
//             <div>
//               <p>View appointment alerts and reminders.</p>
//             </div>
//           )}

//           {selectedModule === "Admin Module" && (
//             <div>
//               <p>Manage users, doctors and platform settings.</p>
//             </div>
//           )}

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Dashboard;





import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- IMPORT MODULES ---------- */
import BookAppointment from "./dashboardModules.jsx/BookAppointment";
import PreCallCheck from "./dashboardModules.jsx/PreCallCheck";
import VideoInterface from "./dashboardModules.jsx/VideoInterface";
import SymptomInput from "./dashboardModules.jsx/SymptomInput";
import PrescriptionForm from "./dashboardModules.jsx/PrescriptionForm";
import DoctorNotes from "./dashboardModules.jsx/DoctorNotes";
import PDFPrescription from "./dashboardModules.jsx/PDFPrescription";
import PostCallSummary from "./dashboardModules.jsx/PostCallSummary";
import HistoryLog from "./dashboardModules.jsx/HistoryLog";
import Notifications from "./dashboardModules.jsx/Notifications";
import AdminModule from "./dashboardModules.jsx/AdminModule";
import MyAppointments from "./dashboardModules.jsx/MyAppointments";

const Dashboard = () => {

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("telemed_current_user") || "null"));
  const role = currentUser?.role || "patient";
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("telemed_current_user") || "null");
    setCurrentUser(storedUser);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("telemed_current_user") || "null");
      setCurrentUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const clearAllStoredData = () => {
    localStorage.removeItem("telemed_logged_in");
    localStorage.removeItem("telemed_current_user");
    localStorage.removeItem("telemed_appointments");
    localStorage.removeItem("telemed_users");
  };

  const handleLogout = () => {
    localStorage.removeItem("telemed_logged_in");
    localStorage.removeItem("telemed_current_user");
    navigate("/", { replace: true });
  };

  const roleModules = {
    patient: [
      "Book Appointment",
      "My Appointments",
      "Symptom Input",
      "Pre-Call Check",
      "Video Consultation",
      "Notifications",
    ],
    doctor: [
      "Today’s Appointments",
      "Video Interface",
      "Doctor Notes",
      "Prescription Form",
      "Post-Call Summary",
      "Notifications",
      "History",
    ],
    admin: [
      "User Management",
      "Doctor Management",
      "Appointment Overview",
      "Reports / Analytics",
      "Notifications",
      "System Settings",
    ],
  };

  const modules = roleModules[role] || roleModules.patient;

  const [selectedModule, setSelectedModule] = useState(modules[0] || "Book Appointment");

  useEffect(() => {
    setSelectedModule(modules[0] || "Book Appointment");
  }, [role]);

  /* ---------- RENDER MODULE ---------- */

  const renderModule = () => {

    switch (selectedModule) {

      case "Book Appointment":
        return <BookAppointment />;

      case "My Appointments":
      case "Today’s Appointments":
        return <MyAppointments viewMode={selectedModule} />;

      case "Pre-Call Check":
        return <PreCallCheck />;

      case "Video Interface":
      case "Video Consultation":
        return <VideoInterface />;

      case "Symptom Input":
        return <SymptomInput />;

      case "Prescription Form":
        return <PrescriptionForm />;

      case "Doctor Notes":
      case "Patient Notes":
        return <DoctorNotes />;

      case "PDF Prescription":
        return <PDFPrescription />;

      case "Post-Call Summary":
        return <PostCallSummary />;

      case "History Log":
      case "Appointment Overview":
      case "Reports / Analytics":
        return <HistoryLog />;

      case "Notifications":
        return <Notifications />;

      case "Admin Module":
      case "User Management":
      case "Doctor Management":
      case "System Settings":
        return <AdminModule />;

      default:
        return <PreCallCheck />;
    }
  };

  return (

    <div className="dashboard-container">

      {/* ---------- SIDEBAR ---------- */}

      <div className="sidebar">

        <div className="sidebar-menu">

          {modules.map((module, index) => (

            <div
              key={index}
              className={`menu-item ${
                selectedModule === module ? "active" : ""
              }`}
              onClick={() => setSelectedModule(module)}
            >
              {index + 1}. {module}
            </div>

          ))}

        </div>

      </div>

      {/* ---------- MAIN ---------- */}

      <div className="dashboard-main">

        {/* ---------- TOPBAR ---------- */}

        <div className="topbar">

          <h1>
            👋 Welcome back,
            {currentUser?.name ? ` ${currentUser.name}` : " User"}
            {currentUser?.role ? ` (${roleLabel})` : ""}
          </h1>

          <div className="topbar-actions">
            <button
              className="ghost-btn"
              onClick={clearAllStoredData}
              type="button"
            >
              Clear Data
            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

        </div>

        {/* ---------- DYNAMIC MODULE CONTENT ---------- */}

        <div className="module-content">

          <h2>{selectedModule}</h2>

          {renderModule()}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;