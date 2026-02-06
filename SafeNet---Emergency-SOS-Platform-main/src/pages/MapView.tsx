import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertCircle, Clock, Users, ArrowLeft, Filter, Info } from "lucide-react";
import { Link } from "react-router-dom";
import LeafletMap from "@/components/LeafletMap";
import { useSOSStore, SOSAlert } from "@/store/sosStore";

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

const MapView = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const alerts = useSOSStore((s) => s.alerts);
  const updateAlert = useSOSStore((s) => s.updateAlert);

  // Filter options
  const filters: FilterOption[] = [
    { id: "all", label: "All Alerts", count: alerts.length },
    { id: "medical", label: "Medical", count: alerts.filter(a => a.type === "medical").length },
    { id: "accident", label: "Accident", count: alerts.filter(a => a.type === "accident").length },
    { id: "fire", label: "Fire", count: alerts.filter(a => a.type === "fire").length },
  ];

  const filteredAlerts =
    selectedFilter === "all" ? alerts : alerts.filter(a => a.type === selectedFilter);

  // Respond to alert
  const onRespondToAlert = (alert: SOSAlert) => {
    updateAlert(alert.id, { status: "responding" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-semibold">Live Emergency Map</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Left Section: Map + Stats */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className="flex-shrink-0"
              >
                {filter.label}
                <Badge variant="secondary" className="ml-2">{filter.count}</Badge>
              </Button>
            ))}
          </div>

          {/* Map */}
          <div className="bg-card rounded-2xl shadow-medium overflow-hidden h-[600px]">
            <LeafletMap alerts={filteredAlerts} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <div className="text-2xl font-bold text-primary mb-1">{alerts.length}</div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <div className="text-2xl font-bold text-secondary mb-1">
                {alerts.reduce((sum, a) => sum + a.responders, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Responders Active</div>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <div className="text-2xl font-bold text-success mb-1">2.5m</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </div>
        </div>

        {/* Right Section: Alert List + Details */}
        <div className="w-96 flex flex-col gap-4">
          <h3 className="font-semibold text-lg">Active Emergencies</h3>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[700px]">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-card rounded-xl p-4 shadow-soft hover:shadow-medium transition-shadow border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant={alert.status === "pending" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {alert.type}
                  </Badge>
                  <Badge variant="outline" className="capitalize">{alert.status}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{alert.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {alert.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {alert.responders} responding
                    </div>
                  </div>

                  <div className="text-sm font-medium text-primary">{alert.distance} away</div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1"
                    onClick={() => onRespondToAlert(alert)}
                    disabled={alert.status !== "pending"}
                  >
                    Respond
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <Info className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}

            <Link to="/sos">
              <Button
                size="lg"
                className="w-full gradient-emergency border-0 shadow-glow mt-2"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Send New Alert
              </Button>
            </Link>
          </div>

          {/* Side Panel: Alert Details */}
          {selectedAlert && (
            <div className="bg-card rounded-2xl p-6 shadow-lg mt-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Alert Details</h2>
                <Button size="sm" variant="ghost" onClick={() => setSelectedAlert(null)}>
                  Close
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>Type:</strong> {selectedAlert.type}</div>
                <div><strong>Status:</strong> {selectedAlert.status}</div>
                <div><strong>Location:</strong> {selectedAlert.location}</div>
                <div><strong>Time:</strong> {selectedAlert.time}</div>
                <div><strong>Responders:</strong> {selectedAlert.responders}</div>
                <div><strong>Distance:</strong> {selectedAlert.distance}</div>
                {selectedAlert.description && <div><strong>Description:</strong> {selectedAlert.description}</div>}
                {selectedAlert.contactPhone && <div><strong>Contact:</strong> {selectedAlert.contactPhone}</div>}
                {selectedAlert.peopleAffected !== undefined && <div><strong>People Affected:</strong> {selectedAlert.peopleAffected}</div>}
                <div><strong>Coordinates:</strong> {`Lat: ${selectedAlert.coordinates.lat}, Lng: ${selectedAlert.coordinates.lng}`}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
