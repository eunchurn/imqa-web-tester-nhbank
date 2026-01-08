"use client";

import Link from "next/link";
import { IMQAProvider } from '@/components/imqa-provider';
import { IMQAStatus } from '@/components/imqa-status';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ArrowRight, RefreshCw } from "lucide-react";

export default function RouteTestPage1() {
  return (
    <IMQAProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Route Test - Page 1</h1>
          <p className="text-muted-foreground">
            Testing route change tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Route Change Testing</CardTitle>
                <CardDescription>
                  Navigate between pages to test route change tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This is Page 1 of the route test. IMQA should track the navigation between different routes.
                  Click the buttons below to navigate to different routes and observe the tracking in IMQA.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/route-test-2">
                    <Button className="flex items-center gap-2">
                      Go to Page 2
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/network-test">
                    <Button variant="outline" className="flex items-center gap-2">
                      Go to Network Test
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/error-test">
                    <Button variant="outline" className="flex items-center gap-2">
                      Go to Error Test
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button variant="outline" className="flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Reload Page
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>IMQA Status</CardTitle>
                <CardDescription>
                  Current agent status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IMQAStatus />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </IMQAProvider>
  );
}
