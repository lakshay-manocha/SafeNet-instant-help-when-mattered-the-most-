import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

import { useSOSStore, SOSAlert } from "@/store/sosStore";

// ✅ Heatmap Layer Component (handles lifecycle safely)
const HeatmapLayer = ({ points }: { points: [number, number, number?][] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      minOpacity: 0.4,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

const VolunteerDashboard = () => {
  const [isActive, setIsActive] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const [showModal, setShowModal] = useState(false);

  const alerts = useSOSStore((state) => state.alerts);

  // ✅ Derived data
  const completedMissions = alerts.filter((a) => a.status === "completed");
  const recentAlerts = alerts.filter(
    (a) => a.status === "pending" || a.status === "accepted"
  );

  // ✅ Dynamic Stats
  const stats = [
    {
      label: "Emergencies Helped",
      value: completedMissions.length.toString(),
      icon: Heart,
      color: "text-primary",
    },
    { label: "Response Time", value: "3.2m", icon: Clock, color: "text-secondary" },
    { label: "Success Rate", value: "96%", icon: Award, color: "text-success" },
    { label: "Active Hours", value: "48h", icon: TrendingUp, color: "text-accent" },
  ];

  // ✅ Actions
  const onAcceptMission = (id: number) => {
    useSOSStore.getState().updateAlert(id, { status: "accepted" as const });
  };

  const onViewDetails = (alert: SOSAlert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const onCompleteMission = (id: number) => {
    useSOSStore.getState().completeAlert(id);
  };

  // ✅ Prepare heatmap points
  const heatPoints: [number, number, number?][] = alerts.map((a) => [
    a.coordinates.lat,
    a.coordinates.lng,
    0.6,
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-semibold">Volunteer Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Offline"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🔥 Heat Map Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              SOS Alert Heat Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden">
              <MapContainer
                center={[28.6139, 77.209]} // Default center (Delhi)
                zoom={12}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <HeatmapLayer points={heatPoints} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Nearby Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-muted/50 rounded-xl p-4 border border-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold mb-1">{alert.type}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </div>
                      </div>
                      <Badge
                        variant={
                          alert.status === "pending" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {alert.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {alert.time}
                      </div>
                      <div className="text-primary font-medium">
                        {alert.distance} away
                      </div>
                    </div>

                    {alert.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => onAcceptMission(alert.id)}
                        >
                          Accept Mission
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewDetails(alert)}
                        >
                          View Details
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Link to="/map" className="flex-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Navigate to Location
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => onCompleteMission(alert.id)}
                        >
                          Complete Mission
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {recentAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active alerts nearby. You'll be notified when help is
                    needed.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed Missions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Completed Missions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedMissions.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-6">
                    No missions completed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedMissions.map((mission) => (
                      <div
                        key={mission.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">
                            {mission.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {mission.location} • {mission.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-success mb-1">
                            {mission.distance}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal for Alert Details */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 space-y-4">
            <h2 className="text-xl font-semibold">{selectedAlert.type}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedAlert.description || "No additional details."}
            </p>
            <p className="text-sm">
              <strong>Location:</strong> {selectedAlert.location}
            </p>
            {selectedAlert.contactPhone && (
              <p className="text-sm">
                <strong>Contact:</strong> {selectedAlert.contactPhone}
              </p>
            )}
            {selectedAlert.peopleAffected && (
              <p className="text-sm">
                <strong>People Affected:</strong> {selectedAlert.peopleAffected}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
