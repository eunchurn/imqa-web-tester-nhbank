"use client";

import { useState } from "react";
import { IMQAProvider } from '@/components/imqa-provider';
import { IMQAStatus } from '@/components/imqa-status';
import { UserEventController } from '@/components/user-event-controller';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Download,
  FileCode,
  FileText,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  Component
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoadedResource {
  id: string;
  type: 'image' | 'script' | 'css' | 'component';
  url?: string;
  status: 'loading' | 'success' | 'error';
  time: number;
  size?: number;
}

const DynamicComponent = () => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-medium mb-2">Dynamic Component</h3>
      <p>This component was loaded after the initial page load.</p>
      <img
        src="https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=300"
        alt="Dynamic component image"
        className="mt-4 rounded-lg"
      />
    </div>
  );
};

export default function ResourceTestPage() {
  const [loadedResources, setLoadedResources] = useState<LoadedResource[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [showDynamicComponent, setShowDynamicComponent] = useState(false);
  const { toast } = useToast();

  const addLoadedResource = (resource: LoadedResource) => {
    setLoadedResources(prev => [resource, ...prev].slice(0, 10));
  };

  const loadImage = (url: string) => {
    const id = Date.now().toString();
    const startTime = performance.now();

    setLoading(prev => ({ ...prev, image: true }));
    addLoadedResource({
      id,
      type: 'image',
      url,
      status: 'loading',
      time: 0
    });

    const img = new Image();
    img.onload = () => {
      const endTime = performance.now();
      setLoadedResources(prev =>
        prev.map(resource =>
          resource.id === id
            ? {
                ...resource,
                status: 'success',
                time: Math.round(endTime - startTime),
                size: img.width * img.height * 4
              }
            : resource
        )
      );
      setLoading(prev => ({ ...prev, image: false }));
      toast({
        title: "Image loaded",
        description: `Loaded in ${Math.round(endTime - startTime)}ms`,
      });
    };
    img.onerror = () => {
      const endTime = performance.now();
      setLoadedResources(prev =>
        prev.map(resource =>
          resource.id === id
            ? {
                ...resource,
                status: 'error',
                time: Math.round(endTime - startTime)
              }
            : resource
        )
      );
      setLoading(prev => ({ ...prev, image: false }));
      toast({
        title: "Image failed to load",
        description: "The image could not be loaded",
        variant: "destructive"
      });
    };
    img.src = url;
  };

  const loadScript = (url: string) => {
    const id = Date.now().toString();
    const startTime = performance.now();

    setLoading(prev => ({ ...prev, script: true }));
    addLoadedResource({
      id,
      type: 'script',
      url,
      status: 'loading',
      time: 0
    });

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = () => {
      const endTime = performance.now();
      setLoadedResources(prev =>
        prev.map(resource =>
          resource.id === id
            ? {
                ...resource,
                status: 'success',
                time: Math.round(endTime - startTime)
              }
            : resource
        )
      );
      setLoading(prev => ({ ...prev, script: false }));
      toast({
        title: "Script loaded",
        description: `Loaded in ${Math.round(endTime - startTime)}ms`,
      });
    };

    script.onerror = () => {
      const endTime = performance.now();
      setLoadedResources(prev =>
        prev.map(resource =>
          resource.id === id
            ? {
                ...resource,
                status: 'error',
                time: Math.round(endTime - startTime)
              }
            : resource
        )
      );
      setLoading(prev => ({ ...prev, script: false }));
      toast({
        title: "Script failed to load",
        description: "The script could not be loaded",
        variant: "destructive"
      });
    };

    document.head.appendChild(script);
  };

  const loadStylesheet = (url: string) => {
    const id = Date.now().toString();
    const startTime = performance.now();

    setLoading(prev => ({ ...prev, css: true }));
    addLoadedResource({
      id,
      type: 'css',
      url,
      status: 'loading',
      time: 0
    });

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    link.onload = () => {
      const endTime = performance.now();
      setLoadedResources(prev =>
        prev.map(resource =>
          resource.id === id
            ? {
                ...resource,
                status: 'success',
                time: Math.round(endTime - startTime)
              }
            : resource
        )
      );
      setLoading(prev => ({ ...prev, css: false }));
      toast({
        title: "Stylesheet loaded",
        description: `Loaded in ${Math.round(endTime - startTime)}ms`,
      });
    };

    link.onerror = () => {
      const endTime = performance.now();
      setLoadedResources(prev =>
        prev.map(resource =>
          resource.id === id
            ? {
                ...resource,
                status: 'error',
                time: Math.round(endTime - startTime)
              }
            : resource
        )
      );
      setLoading(prev => ({ ...prev, css: false }));
      toast({
        title: "Stylesheet failed to load",
        description: "The stylesheet could not be loaded",
        variant: "destructive"
      });
    };

    document.head.appendChild(link);
  };

  const loadMultipleResources = () => {
    const resources = [
      {
        type: 'image' as const,
        url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        type: 'script' as const,
        url: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js'
      },
      {
        type: 'css' as const,
        url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
      }
    ];

    setLoading(prev => ({ ...prev, multiple: true }));

    resources.forEach(resource => {
      switch (resource.type) {
        case 'image':
          loadImage(resource.url);
          break;
        case 'script':
          loadScript(resource.url);
          break;
        case 'css':
          loadStylesheet(resource.url);
          break;
      }
    });

    setTimeout(() => {
      setLoading(prev => ({ ...prev, multiple: false }));
    }, 100);
  };

  const toggleDynamicComponent = () => {
    const id = Date.now().toString();
    const startTime = performance.now();

    setLoading(prev => ({ ...prev, component: true }));
    addLoadedResource({
      id,
      type: 'component',
      status: 'loading',
      time: 0
    });

    setTimeout(() => {
      setShowDynamicComponent(prev => !prev);
      const endTime = performance.now();

      setLoadedResources(prev =>
        prev.map(resource =>
          resource.id === id
            ? {
                ...resource,
                status: 'success',
                time: Math.round(endTime - startTime)
              }
            : resource
        )
      );

      setLoading(prev => ({ ...prev, component: false }));
      toast({
        title: "Component updated",
        description: `Updated in ${Math.round(endTime - startTime)}ms`,
      });
    }, 500);
  };

  return (
    <IMQAProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Resource Loading Test</h1>
          <p className="text-muted-foreground">
            Test post-document load resource tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Resource Loader
                </CardTitle>
                <CardDescription>
                  Load different types of resources after initial page load
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="single">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Single Resources</TabsTrigger>
                    <TabsTrigger value="multiple">Multiple Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() => loadImage('https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300')}
                        disabled={loading.image}
                      >
                        {loading.image ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                        Load Image
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js')}
                        disabled={loading.script}
                      >
                        {loading.script ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileCode className="h-4 w-4" />
                        )}
                        Load Script
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() => loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css')}
                        disabled={loading.css}
                      >
                        {loading.css ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        Load Stylesheet
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={toggleDynamicComponent}
                        disabled={loading.component}
                      >
                        {loading.component ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Component className="h-4 w-4" />
                        )}
                        Toggle Component
                      </Button>
                    </div>

                    {showDynamicComponent && (
                      <div className="mt-4">
                        <DynamicComponent />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="multiple">
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2 justify-center"
                        onClick={loadMultipleResources}
                        disabled={loading.multiple}
                      >
                        {loading.multiple ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Layers className="h-4 w-4" />
                        )}
                        Load Multiple Resources
                      </Button>

                      <p className="text-sm text-muted-foreground">
                        This will load an image, script, and stylesheet simultaneously
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resource History</CardTitle>
                <CardDescription>
                  History of loaded resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadedResources.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    No resources loaded yet. Try loading some resources above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {loadedResources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {resource.type === 'image' && <ImageIcon className="h-4 w-4" />}
                          {resource.type === 'script' && <FileCode className="h-4 w-4" />}
                          {resource.type === 'css' && <FileText className="h-4 w-4" />}
                          {resource.type === 'component' && <Component className="h-4 w-4" />}
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                              </Badge>
                              {resource.url && (
                                <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                  {new URL(resource.url).pathname}
                                </span>
                              )}
                            </div>
                            {resource.url && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {new URL(resource.url).hostname}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              resource.status === 'success'
                                ? "default"
                                : resource.status === 'loading'
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {resource.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {resource.time}ms
                            {resource.size && ` • ${Math.round(resource.size / 1024)}KB`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {loadedResources.length > 0 && (
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setLoadedResources([])}
                  >
                    Clear History
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
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

            <UserEventController />
          </div>
        </div>
      </div>
    </IMQAProvider>
  );
}
