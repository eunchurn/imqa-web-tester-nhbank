"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIMQA } from "@/components/imqa-provider";
import { IMQAProvider } from "@/components/imqa-provider";
import { IMQAStatus } from "@/components/imqa-status";
import Link from "next/link";
import { ArrowRight, Play, Square, Trash2, Eye, Upload } from "lucide-react";

export default function UserEventTestPage() {
  return (
    <IMQAProvider>
      <UserEventTestContent />
    </IMQAProvider>
  );
}

function UserEventTestContent() {
  const { isInitialized } = useIMQA();
  const { toast } = useToast();

  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("button-click-test");
  const [customAttributes, setCustomAttributes] = useState('{"page": "user-event-test", "test_type": "manual"}');
  const [endAttributes, setEndAttributes] = useState('{"result": "success"}');

  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [loadedResourcesCount, setLoadedResourcesCount] = useState(0);

  const getIMQA = async () => {
    try {
      const IMQAModule = await import('@imqa/web-agent');
      return IMQAModule.default;
    } catch (error) {
      console.error('Failed to import IMQA:', error);
      return null;
    }
  };

  const handleStartUserEvent = async () => {
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

      let attributes = {};
      try {
        attributes = JSON.parse(customAttributes);
      } catch {
        throw new Error("Invalid JSON format in attributes");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eventId = (IMQA as any).userEvent?.start?.(eventName, attributes);
      setActiveEventId(eventId);

      toast({
        title: "User Event Started",
        description: `Event "${eventName}" started with ID: ${eventId?.slice(0, 8)}...`,
      });
    } catch (error) {
      console.error('Failed to start user event:', error);
      toast({
        title: "Start Failed",
        description: error instanceof Error ? error.message : "Failed to start user event",
        variant: "destructive",
      });
    }
  };

  const handleEndUserEvent = async (useActiveId = false) => {
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

      let eventIdToEnd = activeEventId;

      if (useActiveId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const activeEvent = (IMQA as any).userEvent?.getActive?.();
        if (!activeEvent) {
          throw new Error("No active user event found");
        }
        eventIdToEnd = activeEvent.id;
      } else if (!activeEventId) {
        throw new Error("No event ID available");
      }

      let attributes = {};
      try {
        attributes = JSON.parse(endAttributes);
      } catch {
        throw new Error("Invalid JSON format in end attributes");
      }

      if (!eventIdToEnd) {
        throw new Error("No event ID available");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).userEvent?.end?.(eventIdToEnd, attributes);
      setActiveEventId(null);

      toast({
        title: "User Event Ended",
        description: `Event ended successfully with ID: ${eventIdToEnd.slice(0, 8)}...`,
      });
    } catch (error) {
      console.error('Failed to end user event:', error);
      toast({
        title: "End Failed",
        description: error instanceof Error ? error.message : "Failed to end user event",
        variant: "destructive",
      });
    }
  };

  const handleCancelUserEvent = async () => {
    if (!isInitialized || !activeEventId) {
      toast({
        title: "No active event",
        description: "No active user event to cancel",
        variant: "destructive",
      });
      return;
    }

    try {
      const IMQA = await getIMQA();
      if (!IMQA) throw new Error("IMQA not available");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).userEvent?.cancel?.(activeEventId);
      setActiveEventId(null);

      toast({
        title: "User Event Cancelled",
        description: `Event cancelled: ${activeEventId.slice(0, 8)}...`,
      });
    } catch (error) {
      console.error('Failed to cancel user event:', error);
      toast({
        title: "Cancel Failed",
        description: error instanceof Error ? error.message : "Failed to cancel user event",
        variant: "destructive",
      });
    }
  };

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
          description: `ID: ${activeEvent.id.slice(0, 8)}..., Name: ${activeEvent.name}, Duration: ${duration}ms`,
        });
      } else {
        toast({
          title: "No Active Event",
          description: "No user event is currently active",
        });
      }
    } catch (error) {
      console.error('Failed to check active event:', error);
      toast({
        title: "Check Failed",
        description: error instanceof Error ? error.message : "Failed to check active event",
        variant: "destructive",
      });
    }
  };

  const handleLoadResourcesWithUserEvent = async () => {
    if (!isInitialized) {
      toast({
        title: "Agent not active",
        description: "Please activate the IMQA Web Agent first",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingResources(true);
    setLoadedResourcesCount(0);

    try {
      const IMQA = await getIMQA();
      if (!IMQA) throw new Error("IMQA not available");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eventId = (IMQA as any).userEvent?.start?.('resource-loading-test', {
        'test.type': 'multiple_resources',
        'test.page': 'user-event-test',
        'resources.count': 5
      });

      const resourcePromises = [];

      for (let i = 1; i <= 3; i++) {
        const scriptPromise = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js?v=${i}`;
          script.onload = () => {
            setLoadedResourcesCount(prev => prev + 1);
            resolve(`script-${i}`);
          };
          script.onerror = () => reject(`Failed to load script-${i}`);
          document.head.appendChild(script);
        });
        resourcePromises.push(scriptPromise);
      }

      for (let i = 1; i <= 2; i++) {
        const imagePromise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setLoadedResourcesCount(prev => prev + 1);
            resolve(`image-${i}`);
          };
          img.onerror = () => reject(`Failed to load image-${i}`);
          img.src = `https://picsum.photos/100/100?random=${i}`;
        });
        resourcePromises.push(imagePromise);
      }

      await Promise.allSettled(resourcePromises);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).userEvent?.end?.(eventId, {
        'resources.loaded': loadedResourcesCount,
        'test.result': 'completed'
      });

      toast({
        title: "Resource Loading Completed",
        description: `Loaded ${loadedResourcesCount} resources with user event tracking`,
      });

    } catch (error) {
      console.error('Failed to load resources:', error);
      toast({
        title: "Resource Loading Failed",
        description: error instanceof Error ? error.message : "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResources(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">User Event Test</h1>
          <p className="text-muted-foreground">
            Test IMQA User Event functionality with cross-page navigation and resource loading.
          </p>

          {activeEventId && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Active Event ID: {activeEventId.slice(0, 8)}...</Badge>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Badge variant={isInitialized ? "default" : "destructive"}>
              Agent: {isInitialized ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>IMQA Status</CardTitle>
          <CardDescription>Current agent status</CardDescription>
        </CardHeader>
        <CardContent>
          <IMQAStatus />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Event Controls</CardTitle>
            <CardDescription>
              Start, end, or manage user events with custom attributes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customAttributes">Start Attributes (JSON)</Label>
              <Textarea
                id="customAttributes"
                value={customAttributes}
                onChange={(e) => setCustomAttributes(e.target.value)}
                placeholder='{"key": "value"}'
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endAttributes">End Attributes (JSON)</Label>
              <Textarea
                id="endAttributes"
                value={endAttributes}
                onChange={(e) => setEndAttributes(e.target.value)}
                placeholder='{"result": "success"}'
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleStartUserEvent}
                disabled={!!activeEventId || !isInitialized}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Event
              </Button>
              <Button
                onClick={() => handleEndUserEvent(false)}
                disabled={!activeEventId || !isInitialized}
                variant="outline"
                className="w-full"
              >
                <Square className="w-4 h-4 mr-2" />
                End Event
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleEndUserEvent(true)}
                disabled={!isInitialized}
                variant="secondary"
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                End via getActive()
              </Button>
              <Button
                onClick={handleCancelUserEvent}
                disabled={!activeEventId || !isInitialized}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancel Event
              </Button>
            </div>

            <Button
              onClick={handleCheckActiveEvent}
              disabled={!isInitialized}
              variant="outline"
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Check Active Event
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-Page Navigation Test</CardTitle>
            <CardDescription>
              Start an event here and end it on another page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>1. Start a user event above</p>
              <p>2. Navigate to another page using the links below</p>
              <p>3. The event will remain active across pages</p>
              <p>4. End the event on the destination page</p>
            </div>

            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/error-test">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Error Test Page
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/network-test">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Network Test Page
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/resource-test">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Resource Test Page
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resource Loading Test</CardTitle>
            <CardDescription>
              Load multiple scripts and images within a single user event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>This test will:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Start a user event</li>
                <li>Load 3 JavaScript libraries</li>
                <li>Load 2 random images</li>
                <li>Track all resource loading within the same event context</li>
                <li>End the event when all resources are loaded</li>
              </ul>
            </div>

            {loadedResourcesCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Resources Loaded: {loadedResourcesCount}/5
                </Badge>
              </div>
            )}

            <Button
              onClick={handleLoadResourcesWithUserEvent}
              disabled={isLoadingResources || !isInitialized}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoadingResources ? "Loading Resources..." : "Start Resource Loading Test"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
