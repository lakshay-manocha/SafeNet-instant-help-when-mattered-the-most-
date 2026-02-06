import React, { useState } from "react";
import { useSOSStore, SOSAlert } from "@/store/sosStore";

const SOSVerification: React.FC = () => {
  const { alerts, addAlert } = useSOSStore();
  const [newAlert, setNewAlert] = useState<Omit<SOSAlert, "id" | "status">>({
    type: "fire",
    description: "",
    peopleAffected: 1,
    contactPhone: "",
    location: "",
    time: new Date().toISOString().slice(11, 16), // HH:mm
    distance: "0",
    responders: 0,
    coordinates: { lat: 0, lng: 0 },
  });

  const handleAddAlert = () => {
    const alert: SOSAlert = {
      ...newAlert,
      id: Math.floor(Math.random() * 1000000),
      status: "pending",
    };
    addAlert(alert);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">SOS Verification Layer</h1>

      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Type (fire/medical/accident/crime)"
          value={newAlert.type}
          onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
          className="border p-1 rounded w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={newAlert.description}
          onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
          className="border p-1 rounded w-full"
        />
        <input
          type="number"
          placeholder="People Affected"
          value={newAlert.peopleAffected}
          onChange={(e) => setNewAlert({ ...newAlert, peopleAffected: Number(e.target.value) })}
          className="border p-1 rounded w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={newAlert.location}
          onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
          className="border p-1 rounded w-full"
        />
        <input
          type="text"
          placeholder="Distance (placeholder)"
          value={newAlert.distance}
          onChange={(e) => setNewAlert({ ...newAlert, distance: e.target.value })}
          className="border p-1 rounded w-full"
        />
        <input
          type="number"
          placeholder="Latitude"
          value={newAlert.coordinates.lat}
          onChange={(e) => setNewAlert({ ...newAlert, coordinates: { ...newAlert.coordinates, lat: Number(e.target.value) } })}
          className="border p-1 rounded w-full"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={newAlert.coordinates.lng}
          onChange={(e) => setNewAlert({ ...newAlert, coordinates: { ...newAlert.coordinates, lng: Number(e.target.value) } })}
          className="border p-1 rounded w-full"
        />
        <button onClick={handleAddAlert} className="bg-blue-500 text-white px-4 py-2 rounded">
          Report SOS
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">All Alerts:</h2>
      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`p-2 border rounded ${
              alert.status === "spam" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <strong>Type:</strong> {alert.type} | <strong>Location:</strong> {alert.location} |{" "}
            <strong>Status:</strong> {alert.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SOSVerification;
