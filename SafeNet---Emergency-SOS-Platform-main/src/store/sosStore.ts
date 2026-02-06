import { create } from "zustand";

export type AlertStatus = "pending" | "accepted" | "responding" | "completed" | "spam";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SOSAlert {
  id: number;
  type: string;
  description?: string;
  peopleAffected?: number;
  contactPhone?: string;
  location: string;
  time: string; // HH:mm format
  distance: string; // placeholder for response time
  status: AlertStatus;
  responders: number;
  coordinates: Coordinates;
}

export interface VolunteerStats {
  activeVolunteers: number;
  successRate: number; // 0-100
  avgResponseTime: number; // minutes
}

export interface AnalyticsStats {
  totalAlertsToday: number;
  alertsByType: Record<string, number>;
  timeDistribution: Record<string, number>; // 6-hour slots
  topLocations: {
    area: string;
    alerts: number;
    responseTime: string;
    coordinates: Coordinates;
  }[];
}

interface SOSStore {
  alerts: SOSAlert[];
  stats: VolunteerStats;
  analytics: AnalyticsStats;

  addAlert: (alert: SOSAlert) => void;
  updateAlert: (id: number, updated: Partial<SOSAlert>) => void;
  completeAlert: (id: number) => void;
  getAlertById: (id: number) => SOSAlert | undefined;
  updateStats: (updated: Partial<VolunteerStats>) => void;
}

// --- Verification function ---
const allowedTypes = ["fire", "medical", "accident", "crime"];
const verifySOS = (alert: SOSAlert, existingAlerts: SOSAlert[]): "Legitimate" | "Spam" => {
  if (!alert.type || !allowedTypes.includes(alert.type)) return "Spam";
  if (!alert.location || !alert.coordinates) return "Spam";
  if (alert.peopleAffected && alert.peopleAffected <= 0) return "Spam";

  // Frequency check: max 3 alerts per user per current hour
  const nowHour = parseInt(alert.time.split(":")[0]);
  const recentAlerts = existingAlerts.filter(
    (a) => a.id !== alert.id && a.id === alert.id && parseInt(a.time.split(":")[0]) === nowHour
  );
  if (recentAlerts.length >= 3) return "Spam";

  if (isNaN(parseFloat(alert.distance))) return "Spam";

  return "Legitimate";
};

// --- Store ---
export const useSOSStore = create<SOSStore>((set, get) => {
  const calculateAnalytics = (alerts: SOSAlert[]): AnalyticsStats => {
    const totalAlertsToday = alerts.length;

    const alertsByType: Record<string, number> = {};
    alerts.forEach((a) => {
      alertsByType[a.type] = (alertsByType[a.type] || 0) + 1;
    });

    const timeDistribution: Record<string, number> = {
      "00-06": 0,
      "06-12": 0,
      "12-18": 0,
      "18-24": 0,
    };
    alerts.forEach((a) => {
      const hour = parseInt(a.time.split(":")[0]);
      if (hour >= 0 && hour < 6) timeDistribution["00-06"]++;
      else if (hour >= 6 && hour < 12) timeDistribution["06-12"]++;
      else if (hour >= 12 && hour < 18) timeDistribution["12-18"]++;
      else timeDistribution["18-24"]++;
    });

    const locationMap: Record<string, { count: number; coords: Coordinates; totalResponse: number }> = {};
    alerts.forEach((a) => {
      if (!locationMap[a.location]) {
        locationMap[a.location] = { count: 0, coords: a.coordinates, totalResponse: 0 };
      }
      locationMap[a.location].count += 1;
      locationMap[a.location].totalResponse += parseFloat(a.distance) || 0;
    });

    const topLocations = Object.entries(locationMap)
      .map(([area, data]) => ({
        area,
        alerts: data.count,
        responseTime: (data.totalResponse / data.count).toFixed(1) + "m",
        coordinates: data.coords,
      }))
      .sort((a, b) => b.alerts - a.alerts)
      .slice(0, 5);

    return {
      totalAlertsToday,
      alertsByType,
      timeDistribution,
      topLocations,
    };
  };

  return {
    alerts: [],
    stats: { activeVolunteers: 0, successRate: 0, avgResponseTime: 0 },
    analytics: calculateAnalytics([]),

    addAlert: (alert: SOSAlert) => {
      const status = verifySOS(alert, get().alerts);
      const verifiedAlert: SOSAlert = { ...alert, status: status === "Legitimate" ? "pending" : "spam" as AlertStatus };

      const updatedAlerts = [...get().alerts, verifiedAlert];
      set({
        alerts: updatedAlerts,
        analytics: calculateAnalytics(updatedAlerts),
      });
    },

    updateAlert: (id, updated) => {
      const updatedAlerts: SOSAlert[] = get().alerts.map((a) =>
        a.id === id ? { ...a, ...updated } : a
      ) as SOSAlert[];
      set({
        alerts: updatedAlerts,
        analytics: calculateAnalytics(updatedAlerts),
      });
    },

    completeAlert: (id) => {
      const updatedAlerts: SOSAlert[] = get().alerts.map((a) =>
        a.id === id ? { ...a, status: "completed" as AlertStatus } : a
      ) as SOSAlert[];
      set({
        alerts: updatedAlerts,
        analytics: calculateAnalytics(updatedAlerts),
      });
    },

    getAlertById: (id) => get().alerts.find((a) => a.id === id),

    updateStats: (updated) => {
      set({ stats: { ...get().stats, ...updated } });
    },
  };
});
