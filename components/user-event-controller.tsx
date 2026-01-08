"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useIMQA } from "@/components/imqa-provider";
import { Square, Eye, Clock, Database } from "lucide-react";

export function UserEventController() {
  const { isInitialized } = useIMQA();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [storedEvents, setStoredEvents] = useState<
    Array<{ id: string; name?: string; startTime: number }>
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getIMQA = async () => {
    try {
      const IMQAModule = await import("@imqa/web-agent");
      return IMQAModule.default;
    } catch (error) {
      console.error("Failed to import IMQA:", error);
      return null;
    }
  };

  const refreshEventStatus = async () => {
    if (!isInitialized) return;

    setIsRefreshing(true);
    try {
      const IMQA = await getIMQA();
      if (!IMQA) return;

      // Check active event
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentActive = (IMQA as any).userEvent?.getActive?.();
      setActiveEvent(currentActive);

      // Check stored events
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stored = (IMQA as any).userEvent?.getStoredEvents?.() || [];
      setStoredEvents(stored);
    } catch (error) {
      console.error("Failed to refresh event status:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      refreshEventStatus();
    }
  }, [isInitialized]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isInitialized && !isLoading) {
        refreshEventStatus();
      }
    }, 1000); // Refresh every second

    return () => clearInterval(interval);
  }, [isInitialized, isLoading]);

  const handleCheckActiveEvent = async () => {
    if (!isInitialized) {
      toast({
        title: "Agent not active",
        description: "Please activate the IMQA Web Agent first",
        variant: "destructive",
      });
      return;
    }

    try {
      const IMQA = await getIMQA();
      if (!IMQA) throw new Error("IMQA not available");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activeEvent = (IMQA as any).userEvent?.getActive?.();

      if (activeEvent) {
        const duration = Date.now() - activeEvent.startTime;
        toast({
          title: "Active Event Found",
          description: `ID: ${activeEvent.id.slice(0, 8)}..., Name: ${activeEvent.name || "N/A"}, Duration: ${duration}ms`,
        });
      } else {
        toast({
          title: "No Active Event",
          description: "No user event is currently active",
        });
      }
    } catch (error) {
      console.error("Failed to check active event:", error);
      toast({
        title: "Check Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to check active event",
        variant: "destructive",
      });
    }
  };

  const handleEndActiveEvent = async () => {
    if (!isInitialized) {
      toast({
        title: "Agent not active",
        description: "Please activate the IMQA Web Agent first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const IMQA = await getIMQA();
      if (!IMQA) throw new Error("IMQA not available");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activeEvent = (IMQA as any).userEvent?.getActive?.();

      if (!activeEvent) {
        toast({
          title: "No Active Event",
          description: "No user event is currently active to end",
          variant: "destructive",
        });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).userEvent?.end?.(activeEvent.id, {
        "page.ended_from": window.location.pathname,
        "end.timestamp": Date.now(),
        result: "completed_from_controller",
      });

      toast({
        title: "User Event Ended",
        description: `Event ended: ${activeEvent.id.slice(0, 8)}... (${activeEvent.name || "N/A"})`,
      });

      // Refresh immediately after ending
      await refreshEventStatus();
    } catch (error) {
      console.error("Failed to end user event:", error);
      toast({
        title: "End Failed",
        description:
          error instanceof Error ? error.message : "Failed to end user event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndStoredEvent = async (eventId: string, eventName?: string) => {
    if (!isInitialized) return;

    setIsLoading(true);

    try {
      const IMQA = await getIMQA();
      if (!IMQA) throw new Error("IMQA not available");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).userEvent?.end?.(eventId, {
        "page.ended_from": window.location.pathname,
        "end.timestamp": Date.now(),
        result: "completed_from_controller_stored",
        restored_from_storage: true,
      });

      toast({
        title: "Stored Event Ended",
        description: `Event ended: ${eventId.slice(0, 8)}... (${eventName || "N/A"})`,
      });

      // Refresh immediately after ending
      await refreshEventStatus();
    } catch (error) {
      console.error("Failed to end stored event:", error);
      toast({
        title: "End Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to end stored event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (startTime: number) => {
    const duration = Date.now() - startTime;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (!isInitialized) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Event Controller</CardTitle>
          <CardDescription>
            IMQA Agent is not active. Please activate it first.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>User Event Controller</span>
          {isRefreshing && (
            <Clock className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription>
          Manage active and stored user events across page navigation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">
            Current Page:{" "}
            {typeof window !== "undefined" ? window.location.pathname : "N/A"}
          </Badge>
        </div>

        {/* Active Event Section */}
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Active Event
            {activeEvent && (
              <span className="ml-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">LIVE</span>
              </span>
            )}
          </h3>
          {activeEvent ? (
            <div className="p-4 border-2 border-green-500 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-lg animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <p className="font-bold text-green-800 dark:text-green-200 text-lg">
                      {activeEvent.name || "Unnamed Event"}
                    </p>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ID: {activeEvent.id.slice(0, 8)}... • Duration:{" "}
                    {formatDuration(activeEvent.startTime)}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      Running for {formatDuration(activeEvent.startTime)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleEndActiveEvent}
                  disabled={isLoading}
                  size="lg"
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  {isLoading ? "Ending..." : "End Event"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-muted-foreground bg-gray-50 dark:bg-gray-900">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active event in memory</p>
              <p className="text-xs mt-1">Start a user event to see it here</p>
            </div>
          )}
        </div>

        {/* Stored Events Section */}
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Stored Events ({storedEvents.length})
          </h3>
          {storedEvents.length > 0 ? (
            <div className="space-y-2">
              {storedEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {event.name || "Unnamed Event"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {event.id.slice(0, 8)}... • Duration:{" "}
                        {formatDuration(event.startTime)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleEndStoredEvent(event.id, event.name)}
                      disabled={isLoading}
                      size="sm"
                      variant="outline"
                      className="ml-2"
                    >
                      <Square className="w-4 h-4 mr-1" />
                      {isLoading ? "Ending..." : "End"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border rounded-lg text-center text-muted-foreground">
              No stored events found
            </div>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={handleCheckActiveEvent}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Eye className="w-4 h-4 mr-2" />
            Manual Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
