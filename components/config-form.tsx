"use client";

import { useIMQA } from "./imqa-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Play, Square, RefreshCw } from "lucide-react";

export function ConfigForm() {
  const { config, updateConfig, initIMQA, deinitIMQA, isInitialized } =
    useIMQA();
  const { toast } = useToast();

  const handleInit = async () => {
    if (
      !config.collectorUrl ||
      !config.serviceName ||
      !config.serviceVersion ||
      !config.serviceKey
    ) {
      toast({
        title: "Configuration Error",
        description:
          "Please set all required environment variables (NEXT_PUBLIC_IMQA_*)",
        variant: "destructive",
      });
      return;
    }
    await initIMQA();
    toast({
      title: "IMQA Initialized",
      description: "Web Agent is now active",
    });
  };

  const handleDeinit = async () => {
    await deinitIMQA();
    toast({
      title: "IMQA Stopped",
      description: "Web Agent has been deactivated",
    });
  };

  const hasRequiredConfig =
    config.collectorUrl &&
    config.serviceName &&
    config.serviceVersion &&
    config.serviceKey;

  return (
    <div className="space-y-6">
      {!hasRequiredConfig && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-sm">
          <p className="font-medium mb-2">Missing Configuration</p>
          <p>
            Please set the following environment variables in your{" "}
            <code className="bg-muted px-1 rounded">.env.local</code> file:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {!config.collectorUrl && (
              <li>NEXT_PUBLIC_IMQA_COLLECTOR_URL</li>
            )}
            {!config.serviceName && <li>NEXT_PUBLIC_IMQA_SERVICE_NAME</li>}
            {!config.serviceVersion && (
              <li>NEXT_PUBLIC_IMQA_SERVICE_VERSION</li>
            )}
            {!config.serviceKey && <li>NEXT_PUBLIC_IMQA_SERVICE_KEY</li>}
          </ul>
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="collectorUrl">Collector URL</Label>
          <Input
            id="collectorUrl"
            placeholder="Set via NEXT_PUBLIC_IMQA_COLLECTOR_URL"
            value={config.collectorUrl}
            onChange={(e) => updateConfig({ collectorUrl: e.target.value })}
            disabled={isInitialized}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="serviceName">Service Name</Label>
          <Input
            id="serviceName"
            placeholder="Set via NEXT_PUBLIC_IMQA_SERVICE_NAME"
            value={config.serviceName}
            onChange={(e) => updateConfig({ serviceName: e.target.value })}
            disabled={isInitialized}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="serviceVersion">Service Version</Label>
          <Input
            id="serviceVersion"
            placeholder="Set via NEXT_PUBLIC_IMQA_SERVICE_VERSION"
            value={config.serviceVersion}
            onChange={(e) => updateConfig({ serviceVersion: e.target.value })}
            disabled={isInitialized}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="serviceKey">Service Key</Label>
          <Input
            id="serviceKey"
            placeholder="Set via NEXT_PUBLIC_IMQA_SERVICE_KEY"
            value={config.serviceKey}
            onChange={(e) => updateConfig({ serviceKey: e.target.value })}
            disabled={isInitialized}
            type="password"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="serviceNamespace">Service Namespace (Optional)</Label>
          <Input
            id="serviceNamespace"
            placeholder="Set via NEXT_PUBLIC_IMQA_SERVICE_NAMESPACE"
            value={config.serviceNamespace || ""}
            onChange={(e) => updateConfig({ serviceNamespace: e.target.value })}
            disabled={isInitialized}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="deploymentEnvironment">Environment (Optional)</Label>
          <Input
            id="deploymentEnvironment"
            placeholder="Set via NEXT_PUBLIC_IMQA_DEPLOYMENT_ENVIRONMENT"
            value={config.deploymentEnvironment || ""}
            onChange={(e) =>
              updateConfig({ deploymentEnvironment: e.target.value })
            }
            disabled={isInitialized}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {!isInitialized ? (
          <Button
            onClick={handleInit}
            disabled={!hasRequiredConfig}
            className="flex-1"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Agent
          </Button>
        ) : (
          <>
            <Button onClick={handleDeinit} variant="destructive" className="flex-1">
              <Square className="mr-2 h-4 w-4" />
              Stop Agent
            </Button>
            <Button
              onClick={async () => {
                await handleDeinit();
                setTimeout(handleInit, 100);
              }}
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
