import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertCircle,
  MapPin,
  Phone,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSOSStore, SOSAlert as SOSAlertType } from "@/store/sosStore";

// ✅ Validation schema including user-driven verification fields
const sosFormSchema = z.object({
  type: z.string().trim().min(1, "Please select an emergency type"),
  description: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters describing the emergency")
    .max(500, "Description must be less than 500 characters"),
  peopleAffected: z.coerce
    .number()
    .min(1, "At least 1 person must be affected")
    .max(1000, "Please enter a valid number of people"),
  contactPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{10,15}$/.test(val),
      "Please enter a valid phone number with at least 10 digits"
    ),
  frequency: z.coerce
    .number()
    .min(1, "At least 1 alert")
    .max(10, "Frequency too high"),
  locationChange: z.coerce
    .number()
    .min(0, "Location change cannot be negative")
    .max(1000, "Location change too high"),
  unusualTime: z.boolean(),
});

type SOSFormValues = z.infer<typeof sosFormSchema>;

const SOSAlert = () => {
  const [isAlertSent, setIsAlertSent] = useState(false);
  const [alertType, setAlertType] = useState<string | null>(null);
  const { toast } = useToast();
  const addAlert = useSOSStore((s) => s.addAlert);

  const form = useForm<SOSFormValues>({
    resolver: zodResolver(sosFormSchema),
    defaultValues: {
      type: "",
      description: "",
      peopleAffected: 1,
      contactPhone: "",
      frequency: 1,
      locationChange: 0,
      unusualTime: false,
    },
  });

  const emergencyTypes = [
    { id: "medical", label: "Medical Emergency", icon: "🏥" },
    { id: "accident", label: "Accident", icon: "🚗" },
    { id: "fire", label: "Fire", icon: "🔥" },
    { id: "safety", label: "Personal Safety", icon: "🛡️" },
    { id: "disaster", label: "Natural Disaster", icon: "🌪️" },
    { id: "other", label: "Other Emergency", icon: "⚠️" },
  ];

  // ✅ User-driven spam detection
  const isSpam = (data: SOSFormValues) => {
    if (data.frequency > 3) return true;
    if (data.locationChange > 20) return true;
    if (data.unusualTime) return true;
    return false;
  };

  const handleSendSOS = (data: SOSFormValues) => {
    if (isSpam(data)) {
      toast({
        title: "SOS Alert Flagged as Spam",
        description:
          "Your inputs indicate this SOS might be spam. Please verify your alert.",
        variant: "destructive",
      });
      return; // Stop submission
    }

    const newAlert: SOSAlertType = {
      id: Date.now(),
      type: data.type,
      description: data.description,
      peopleAffected: data.peopleAffected,
      contactPhone: data.contactPhone,
      location: "Connaught Place, Delhi",
      time: new Date().toISOString().slice(11, 16),
      distance: "0 km",
      status: "pending",
      responders: 0,
      coordinates: { lat: 28.6315, lng: 77.2167 },
    };

    addAlert(newAlert);

    setIsAlertSent(true);
    toast({
      title: "SOS Alert Sent!",
      description: "Nearby responders have been notified. Help is on the way.",
    });

    setTimeout(() => {
      setIsAlertSent(false);
      setAlertType(null);
      form.reset();
    }, 5000);
  };

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
            <AlertCircle className="w-5 h-5 text-primary" />
            <span className="font-semibold">Emergency SOS</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {!isAlertSent ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendSOS)} className="space-y-8">
              {/* Emergency Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Type</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-4">
                        {emergencyTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => {
                              setAlertType(type.id);
                              field.onChange(type.id);
                            }}
                            className={`p-6 rounded-2xl border-2 transition-all ${alertType === type.id
                                ? "border-primary bg-primary/5 shadow-medium"
                                : "border-border hover:border-primary/50 hover:shadow-soft"
                              }`}
                          >
                            <div className="text-4xl mb-3">{type.icon}</div>
                            <div className="font-semibold text-sm">{type.label}</div>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe emergency..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* People Affected and Contact */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="peopleAffected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>People Affected *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Spam Detection Inputs */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alerts in last hour</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationChange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Significant Location Change (meters)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unusualTime"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 mt-6">
                      <FormControl>
                        <Input
                          type="checkbox"
                          checked={field.value}      // ✅ use checked for boolean
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </FormControl>
                      <FormLabel>Alert during unusual hours (0-4 AM)</FormLabel>
                    </FormItem>
                  )}
                />

              </div>

              {/* Location Info */}
              <div className="bg-card rounded-xl p-6 shadow-soft mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Your Location</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically detected and shared with responders
                    </div>
                    <div className="text-sm font-medium text-primary mt-2">
                      📍 Latitude: 28.6139, Longitude: 77.2090
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-16 text-lg gradient-emergency border-0 shadow-glow animate-pulse-glow"
              >
                <AlertCircle className="w-6 h-6 mr-2" />
                Send Emergency Alert
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Alert Sent Successfully!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Nearby responders have been notified
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSAlert;
