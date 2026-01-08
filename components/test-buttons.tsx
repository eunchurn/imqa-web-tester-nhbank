"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIMQA } from "./imqa-provider";
import {
  Activity,
  FileText,
  User,
  Tag,
  MousePointer,
  AlertCircle,
} from "lucide-react";

export function TestButtons() {
  const { isInitialized } = useIMQA();
  const { toast } = useToast();

  const getIMQA = async () => {
    try {
      const IMQAModule = await import("@imqa/web-agent");
      return IMQAModule.default;
    } catch (error) {
      console.error("Failed to import IMQA:", error);
      return null;
    }
  };

  const handleAddAction = async () => {
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
      if (!IMQA) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).addAction?.("test_action", { testKey: "testValue" });
      toast({
        title: "Action Added",
        description: 'Added action "test_action"',
      });
    } catch (error) {
      console.error("Failed to add action:", error);
    }
  };

  const handleRecordLog = async () => {
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
      if (!IMQA) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).recordLog?.("info", "Test log message from dashboard");
      toast({
        title: "Log Recorded",
        description: "Recorded info log message",
      });
    } catch (error) {
      console.error("Failed to record log:", error);
    }
  };

  const handleSetUserId = async () => {
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
      if (!IMQA) return;

      const userId = `test-user-${Date.now()}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).setUserId?.(userId);
      toast({
        title: "User ID Set",
        description: `Set user ID to: ${userId}`,
      });
    } catch (error) {
      console.error("Failed to set user ID:", error);
    }
  };

  const handleSetAttribute = async () => {
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
      if (!IMQA) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).setGlobalAttributes?.({
        customAttribute: "testValue",
        timestamp: Date.now(),
      });
      toast({
        title: "Attributes Set",
        description: "Set custom global attributes",
      });
    } catch (error) {
      console.error("Failed to set attributes:", error);
    }
  };

  const handleTrackEvent = async () => {
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
      if (!IMQA) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (IMQA as any).trackEvent?.("button_click", {
        buttonName: "test_button",
        page: "dashboard",
      });
      toast({
        title: "Event Tracked",
        description: 'Tracked event "button_click"',
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  };

  const handleTriggerError = () => {
    if (!isInitialized) {
      toast({
        title: "Agent not active",
        description: "Please activate the IMQA Web Agent first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Intentionally throw an error
      throw new Error("Test error from dashboard");
    } catch (error) {
      console.error("Test error:", error);
      toast({
        title: "Error Triggered",
        description: "Generated a test error (check console)",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <Button
        variant="outline"
        onClick={handleAddAction}
        disabled={!isInitialized}
        className="flex items-center gap-2"
      >
        <Activity className="h-4 w-4" />
        Add Action
      </Button>

      <Button
        variant="outline"
        onClick={handleRecordLog}
        disabled={!isInitialized}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Record Log
      </Button>

      <Button
        variant="outline"
        onClick={handleSetUserId}
        disabled={!isInitialized}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        Set User ID
      </Button>

      <Button
        variant="outline"
        onClick={handleSetAttribute}
        disabled={!isInitialized}
        className="flex items-center gap-2"
      >
        <Tag className="h-4 w-4" />
        Set Attribute
      </Button>

      <Button
        variant="outline"
        onClick={handleTrackEvent}
        disabled={!isInitialized}
        className="flex items-center gap-2"
      >
        <MousePointer className="h-4 w-4" />
        Track Event
      </Button>

      <Button
        variant="outline"
        onClick={handleTriggerError}
        disabled={!isInitialized}
        className="flex items-center gap-2"
      >
        <AlertCircle className="h-4 w-4" />
        Trigger Error
      </Button>
    </div>
  );
}
