import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSOSStore } from "@/store/sosStore";

const Analytics = () => {
  const { stats, analytics } = useSOSStore();

  // Key metrics cards
  const metrics = [
    {
      label: "Total Alerts Today",
      value: analytics.totalAlertsToday.toString(),
      change: "+12%",
      trend: "up",
      icon: AlertCircle,
    },
    {
      label: "Avg Response Time",
      value: `${stats.avgResponseTime}m`,
      change: "-15%",
      trend: "down",
      icon: Clock,
    },
    {
      label: "Active Volunteers",
      value: stats.activeVolunteers.toString(),
      change: "+8%",
      trend: "up",
      icon: Users,
    },
    {
      label: "Success Rate",
      value: `${stats.successRate.toFixed(1)}%`,
      change: "+2%",
      trend: "up",
      icon: CheckCircle,
    },
  ];

  // Alerts by type
  const alertsByType = Object.entries(analytics.alertsByType).map(([type, count]) => ({
    type,
    count,
    percentage: analytics.totalAlertsToday
      ? Math.round((count / analytics.totalAlertsToday) * 100)
      : 0,
    color:
      type === "Medical"
        ? "bg-primary"
        : type === "Accident"
        ? "bg-destructive"
        : type === "Fire"
        ? "bg-warning"
        : type === "Safety"
        ? "bg-accent"
        : "bg-muted-foreground",
  }));

  // Time distribution chart
  const timeDistribution = Object.entries(analytics.timeDistribution).map(
    ([hour, count]) => ({ hour, count })
  );
  const maxTimeCount = Math.max(...timeDistribution.map((d) => d.count), 1);

  // Heat map position helper
  const getHeatMapPosition = (lat: number, lng: number) => ({
    top: `${Math.min(Math.max((90 - lat) / 180, 0), 1) * 100}%`,
    left: `${Math.min(Math.max((180 + lng) / 360, 0), 1) * 100}%`,
  });

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
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-semibold">Analytics Dashboard</span>
          </div>
          <Badge variant="outline">Last 24 hours</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Emergency Response Analytics</h1>
          <p className="text-muted-foreground">Real-time insights and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-5 h-5 text-primary" />
                  <Badge
                    variant={metric.trend === "up" ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {metric.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Alerts by Emergency Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alertsByType.map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.type}</span>
                      <span className="text-muted-foreground">
                        {item.count} alerts ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Distribution by Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-4 h-48">
                  {timeDistribution.map((slot) => (
                    <div
                      key={slot.hour}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full flex items-end justify-center flex-1">
                        <div
                          className="w-full bg-primary rounded-t-lg transition-all duration-500"
                          style={{ height: `${(slot.count / maxTimeCount) * 100}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold">{slot.count}</div>
                        <div className="text-xs text-muted-foreground">{slot.hour}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Heat Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Emergency Heat Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl overflow-hidden">
                  {analytics.topLocations.map((loc, idx) => {
                    const pos = getHeatMapPosition(loc.coordinates.lat, loc.coordinates.lng);
                    return (
                      <div
                        key={loc.area}
                        className="absolute rounded-full blur-xl"
                        style={{
                          width: `${20 + idx * 8}px`,
                          height: `${20 + idx * 8}px`,
                          top: pos.top,
                          left: pos.left,
                          backgroundColor: "rgba(59, 130, 246, 0.3)",
                        }}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Top Locations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Alert Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.topLocations.map((location, index) => (
                  <div
                    key={location.area}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{location.area}</div>
                      <div className="text-xs text-muted-foreground">
                        {location.alerts} alerts
                      </div>
                    </div>
                    <div className="text-xs font-medium text-secondary">
                      {location.responseTime}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
