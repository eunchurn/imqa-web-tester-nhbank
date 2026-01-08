'use client';

import { useState } from 'react';
import { IMQAProvider } from '@/components/imqa-provider';
import { IMQAStatus } from '@/components/imqa-status';
import { UserEventController } from '@/components/user-event-controller';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Globe,
  RefreshCw,
  FileJson,
  Upload,
  Download,
  Check,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RequestResult {
  id: string;
  method: string;
  url: string;
  status: number;
  success: boolean;
  time: number;
  size?: number;
}

export default function NetworkTestPage() {
  const [requests, setRequests] = useState<RequestResult[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const makeRequest = async (method: string, url: string) => {
    const id = Date.now().toString();
    const requestKey = `${method}-${new URL(url).hostname}`;

    setLoading((prev) => ({ ...prev, [requestKey]: true }));

    const startTime = performance.now();

    try {
      const response = await fetch(url, { method });
      const endTime = performance.now();
      const blob = await response.blob();

      const newRequest: RequestResult = {
        id,
        method,
        url,
        status: response.status,
        success: response.ok,
        time: Math.round(endTime - startTime),
        size: blob.size,
      };

      setRequests((prev) => [newRequest, ...prev].slice(0, 10));

      toast({
        title: `${method} Request Complete`,
        description: `Status: ${response.status} in ${Math.round(endTime - startTime)}ms`,
        variant: response.ok ? 'default' : 'destructive',
      });
    } catch (error) {
      const endTime = performance.now();

      const newRequest: RequestResult = {
        id,
        method,
        url,
        status: 0,
        success: false,
        time: Math.round(endTime - startTime),
      };

      setRequests((prev) => [newRequest, ...prev].slice(0, 10));

      toast({
        title: `${method} Request Failed`,
        description: `Error: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, [requestKey]: false }));
    }
  };

  return (
    <IMQAProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Network Testing</h1>
          <p className="text-muted-foreground">
            Make different network requests to test IMQA network tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Network Request Tester
                </CardTitle>
                <CardDescription>
                  Click buttons to make different types of network requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="fetch">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="fetch">Fetch API</TabsTrigger>
                    <TabsTrigger value="xhr">XMLHttpRequest</TabsTrigger>
                  </TabsList>

                  <TabsContent value="fetch" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() =>
                          makeRequest(
                            'GET',
                            'https://jsonplaceholder.typicode.com/todos/1',
                          )
                        }
                        disabled={loading['GET-jsonplaceholder.typicode.com']}
                      >
                        {loading['GET-jsonplaceholder.typicode.com'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileJson className="h-4 w-4" />
                        )}
                        GET JSON Data
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() =>
                          makeRequest(
                            'GET',
                            'https://jsonplaceholder.typicode.com/users',
                          )
                        }
                        disabled={loading['GET-jsonplaceholder.typicode.com']}
                      >
                        {loading['GET-jsonplaceholder.typicode.com'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileJson className="h-4 w-4" />
                        )}
                        GET Large JSON
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() =>
                          makeRequest(
                            'POST',
                            'https://jsonplaceholder.typicode.com/posts',
                          )
                        }
                        disabled={loading['POST-jsonplaceholder.typicode.com']}
                      >
                        {loading['POST-jsonplaceholder.typicode.com'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        POST Data
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() =>
                          makeRequest('GET', 'https://picsum.photos/200/300')
                        }
                        disabled={loading['GET-picsum.photos']}
                      >
                        {loading['GET-picsum.photos'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        GET Image
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() =>
                          makeRequest(
                            'PUT',
                            'https://jsonplaceholder.typicode.com/posts/1',
                          )
                        }
                        disabled={loading['PUT-jsonplaceholder.typicode.com']}
                      >
                        {loading['PUT-jsonplaceholder.typicode.com'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        PUT Data
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() =>
                          makeRequest(
                            'DELETE',
                            'https://jsonplaceholder.typicode.com/posts/1',
                          )
                        }
                        disabled={
                          loading['DELETE-jsonplaceholder.typicode.com']
                        }
                      >
                        {loading['DELETE-jsonplaceholder.typicode.com'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        DELETE Data
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() =>
                          makeRequest(
                            'GET',
                            'https://jsonplaceholder.typicode.com/toodos/1',
                          )
                        }
                        disabled={loading['GET-jsonplaceholder.typicode.com']}
                      >
                        {loading['GET-jsonplaceholder.typicode.com'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileJson className="h-4 w-4" />
                        )}
                        GET Data (error)
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="xhr" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() => {
                          const xhr = new XMLHttpRequest();
                          xhr.open(
                            'GET',
                            'https://jsonplaceholder.typicode.com/todos/1',
                          );
                          xhr.send();
                          toast({
                            title: 'XHR Request Sent',
                            description: 'GET request to /todos/1',
                          });
                        }}
                      >
                        <FileJson className="h-4 w-4" />
                        XHR GET Request
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() => {
                          const xhr = new XMLHttpRequest();
                          xhr.open(
                            'POST',
                            'https://jsonplaceholder.typicode.com/posts',
                          );
                          xhr.setRequestHeader(
                            'Content-Type',
                            'application/json',
                          );
                          xhr.send(
                            JSON.stringify({
                              title: 'foo',
                              body: 'bar',
                              userId: 1,
                            }),
                          );
                          toast({
                            title: 'XHR Request Sent',
                            description: 'POST request to /posts',
                          });
                        }}
                      >
                        <Upload className="h-4 w-4" />
                        XHR POST Request
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() => {
                          const xhr = new XMLHttpRequest();
                          xhr.open(
                            'PUT',
                            'https://jsonplaceholder.typicode.com/posts/1',
                          );
                          xhr.setRequestHeader(
                            'Content-Type',
                            'application/json',
                          );
                          xhr.send(
                            JSON.stringify({
                              id: 1,
                              title: 'foo',
                              body: 'bar',
                              userId: 1,
                            }),
                          );
                          toast({
                            title: 'XHR Request Sent',
                            description: 'PUT request to /posts/1',
                          });
                        }}
                      >
                        <Upload className="h-4 w-4" />
                        XHR PUT Request
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() => {
                          const xhr = new XMLHttpRequest();
                          xhr.open(
                            'DELETE',
                            'https://jsonplaceholder.typicode.com/posts/1',
                          );
                          xhr.send();
                          toast({
                            title: 'XHR Request Sent',
                            description: 'DELETE request to /posts/1',
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                        XHR DELETE Request
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>
                  History of recent network requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    No requests made yet. Try clicking the buttons above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {request.success ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{request.method}</Badge>
                              <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                {new URL(request.url).pathname}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new URL(request.url).hostname}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              request.status >= 200 && request.status < 300
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {request.status || 'Error'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {request.time}ms{' '}
                            {request.size
                              ? `• ${Math.round(request.size / 1024)}KB`
                              : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {requests.length > 0 && (
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setRequests([])}
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
    </IMQAProvider>
  );
}
