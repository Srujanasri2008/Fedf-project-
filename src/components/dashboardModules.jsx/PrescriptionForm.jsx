import React, { useState } from "react";
import "./PrescriptionForm.css";

const PrescriptionForm = () => {
  const currentUser = JSON.parse(localStorage.getItem("telemed_current_user") || "{}");
  const appointment = JSON.parse(localStorage.getItem("telemed_appointments") || "[]")[0] || null;

  const [form, setForm] = useState({
    pharmaceuticalName: "",
    dosageUnit: "",
    frequency: "",
    timingRule: "",
    duration: "",
  });

  const [prescriptions, setPrescriptions] = useState([]);
  const [message, setMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddPrescription = () => {
    if (
      form.pharmaceuticalName &&
      form.dosageUnit &&
      form.frequency &&
      form.timingRule &&
      form.duration
    ) {
      if (editingIndex !== null) {
        // Update existing prescription
        const updatedPrescriptions = [...prescriptions];
        updatedPrescriptions[editingIndex] = form;
        setPrescriptions(updatedPrescriptions);
        setEditingIndex(null);
        setMessage("Prescription updated successfully!");
      } else {
        // Add new prescription
        setPrescriptions([...prescriptions, form]);
        setMessage("Prescription added to list!");
      }
      setForm({
        pharmaceuticalName: "",
        dosageUnit: "",
        frequency: "",
        timingRule: "",
        duration: "",
      });
    } else {
      setMessage("Please fill in all fields before adding a prescription.");
    }
  };

  const handleEditPrescription = (index) => {
    setForm(prescriptions[index]);
    setEditingIndex(index);
  };

  const handleDeletePrescription = (index) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updatedPrescriptions);
    setMessage("Prescription deleted successfully!");
  };

  const handleGeneratePrescription = () => {
    if (prescriptions.length > 0) {
      setMessage(
        `Prescription prepared for ${appointment?.patientName || currentUser.name || "the patient"} with ${prescriptions.length} medicine(s).`
      );
    } else {
      setMessage("Please add at least one prescription before generating.");
    }
  };

  return (
    <div className="prescription-form-container">
      <div className="module-box">
        <h2>Create Digital Prescription</h2>
        <p>Create a digital prescription for the patient.</p>
        <p className="success-message">
          Active case:{" "}
          {appointment
            ? `${appointment.patientName} • ${appointment.doctor}`
            : "No appointment selected"}
        </p>

        <div className="form-section">
          <h3>Add Medicine Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Pharmaceutical Dosage Name</label>
              <input
                name="pharmaceuticalName"
                value={form.pharmaceuticalName}
                onChange={handleChange}
                type="text"
                placeholder="e.g., Aspirin, Ibuprofen"
              />
            </div>

            <div className="form-group">
              <label>Dosage Unit</label>
              <select
                name="dosageUnit"
                value={form.dosageUnit}
                onChange={handleChange}
              >
                <option value="">Select Unit</option>
                <option value="mg">mg (milligram)</option>
                <option value="g">g (gram)</option>
                <option value="ml">ml (milliliter)</option>
                <option value="mcg">mcg (microgram)</option>
                <option value="unit">unit</option>
                <option value="IU">IU (International Unit)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Frequency</label>
              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
              >
                <option value="">Select Frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="Every 4 hours">Every 4 hours</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="Every 12 hours">Every 12 hours</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Timing Rule</label>
              <select
                name="timingRule"
                value={form.timingRule}
                onChange={handleChange}
              >
                <option value="">Select Timing</option>
                <option value="Before meals">Before meals</option>
                <option value="With meals">With meals</option>
                <option value="After meals">After meals</option>
                <option value="Before bedtime">Before bedtime</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="At night">At night</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                type="text"
                placeholder="e.g., 7 days, 2 weeks, 1 month"
              />
            </div>
          </div>

          <button
            className="btn-add"
            onClick={handleAddPrescription}
          >
            {editingIndex !== null ? "Update Prescription" : "Add Prescription"}
          </button>

          {editingIndex !== null && (
            <button
              className="btn-cancel"
              onClick={() => {
                setEditingIndex(null);
                setForm({
                  pharmaceuticalName: "",
                  dosageUnit: "",
                  frequency: "",
                  timingRule: "",
                  duration: "",
                });
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {message && <p className="success-message">{message}</p>}

        {prescriptions.length > 0 && (
          <div className="table-section">
            <h3>Prescriptions Added</h3>
            <table className="prescriptions-table">
              <thead>
                <tr>
                  <th>Pharmaceutical Name</th>
                  <th>Dosage Unit</th>
                  <th>Frequency</th>
                  <th>Timing Rule</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription, index) => (
                  <tr key={index}>
                    <td>{prescription.pharmaceuticalName}</td>
                    <td>{prescription.dosageUnit}</td>
                    <td>{prescription.frequency}</td>
                    <td>{prescription.timingRule}</td>
                    <td>{prescription.duration}</td>
                    <td className="action-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditPrescription(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePrescription(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="btn-generate"
              onClick={handleGeneratePrescription}
            >
              Generate Prescription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionForm;