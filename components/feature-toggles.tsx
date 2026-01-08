"use client";

import { useIMQA } from "./imqa-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export function FeatureToggles() {
  const { config, toggleFeature, updateConfig, isInitialized } = useIMQA();

  return (
    <div className="space-y-6">
      {!isInitialized && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-sm">
          IMQA Agent is not active. Please configure and start the agent first.
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="consoleCapture">Console Capture</Label>
            <p className="text-sm text-muted-foreground">
              Capture console logs (log, warn, error)
            </p>
          </div>
          <Switch
            id="consoleCapture"
            checked={config.consoleCapture}
            onCheckedChange={(checked) =>
              toggleFeature("consoleCapture", checked)
            }
            disabled={!isInitialized}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="advancedNetworkCapture">
              Advanced Network Capture
            </Label>
            <p className="text-sm text-muted-foreground">
              Capture request/response body data
            </p>
          </div>
          <Switch
            id="advancedNetworkCapture"
            checked={config.advancedNetworkCapture}
            onCheckedChange={(checked) =>
              toggleFeature("advancedNetworkCapture", checked)
            }
            disabled={!isInitialized}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="disableReplay">Disable Session Replay</Label>
            <p className="text-sm text-muted-foreground">
              Turn off session recording
            </p>
          </div>
          <Switch
            id="disableReplay"
            checked={config.disableReplay}
            onCheckedChange={(checked) =>
              toggleFeature("disableReplay", checked)
            }
            disabled={!isInitialized}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="captureMetrics">Capture Metrics</Label>
            <p className="text-sm text-muted-foreground">
              Collect performance metrics
            </p>
          </div>
          <Switch
            id="captureMetrics"
            checked={config.captureMetrics}
            onCheckedChange={(checked) =>
              toggleFeature("captureMetrics", checked)
            }
            disabled={!isInitialized}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="debug">Debug Mode</Label>
            <p className="text-sm text-muted-foreground">
              Enable detailed logging
            </p>
          </div>
          <Switch
            id="debug"
            checked={config.debug}
            onCheckedChange={(checked) => toggleFeature("debug", checked)}
            disabled={!isInitialized}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="samplingProbability">
              Sampling Probability: {config.samplingProbability}
            </Label>
          </div>
          <Slider
            id="samplingProbability"
            min={0}
            max={1}
            step={0.1}
            value={[config.samplingProbability]}
            onValueChange={([value]) =>
              updateConfig({ samplingProbability: value })
            }
            disabled={!isInitialized}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Percentage of sessions to track (0 = none, 1 = all)
          </p>
        </div>
      </div>
    </div>
  );
}
