"use client";

import { IMQAStatus } from "./imqa-status";
import { ConfigForm } from "./config-form";
import { FeatureToggles } from "./feature-toggles";
import { TestButtons } from "./test-buttons";
import { UserEventController } from "./user-event-controller";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">IMQA Web Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Configure and test the IMQA Web Agent (Environment Variable Mode)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="test">Test Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="config">
              <Card>
                <CardHeader>
                  <CardTitle>IMQA Configuration</CardTitle>
                  <CardDescription>
                    Configuration is loaded from NEXT_PUBLIC_IMQA_* environment
                    variables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConfigForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Toggles</CardTitle>
                  <CardDescription>
                    Enable or disable IMQA features at runtime
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FeatureToggles />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test">
              <Card>
                <CardHeader>
                  <CardTitle>Test Actions</CardTitle>
                  <CardDescription>
                    Test various IMQA tracking features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestButtons />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IMQA Status</CardTitle>
              <CardDescription>Current agent status</CardDescription>
            </CardHeader>
            <CardContent>
              <IMQAStatus />
            </CardContent>
          </Card>

          <UserEventController />
        </div>
      </div>
    </div>
  );
}
