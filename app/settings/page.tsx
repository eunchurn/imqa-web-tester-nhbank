"use client";

import { IMQAProvider } from '@/components/imqa-provider';
import { ConfigForm } from '@/components/config-form';
import { FeatureToggles } from '@/components/feature-toggles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <IMQAProvider>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure the IMQA Web Agent and toggle features
        </p>

        <Tabs defaultValue="config">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>IMQA Configuration</CardTitle>
                <CardDescription>
                  Set up the core IMQA Web Agent parameters
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
                  Enable or disable IMQA Web Agent features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureToggles />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </IMQAProvider>
  );
}
