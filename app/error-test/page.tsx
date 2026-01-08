/* eslint-disable @typescript-eslint/ban-ts-comment */
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
} from '@/components/ui/card';
import { AlertCircle, AlertTriangle, BugPlay } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ErrorTestPage() {
  const [errorCount, setErrorCount] = useState(0);
  const { toast } = useToast();

  const generateError = (type: string) => {
    setErrorCount((prev) => prev + 1);

    switch (type) {
      case 'reference':
        // @ts-ignore
        console.log(nonExistentVariable);
        toast({
          title: 'Reference Error',
          description: 'A reference error was generated',
        });
        break;

      case 'type':
        // eslint-disable-next-line no-case-declarations
        const obj: any = null;
        obj.method();
        toast({
          title: 'Type Error',
          description: 'A type error was generated',
        });
        break;

      case 'syntax':
        // eslint-disable-next-line no-eval
        eval('if (true) {');
        toast({
          title: 'Syntax Error',
          description: 'A syntax error was generated',
        });
        break;

      case 'range':
        // eslint-disable-next-line no-case-declarations
        const arr = new Array(-1);
        toast({
          title: 'Range Error',
          description: 'A range error was generated',
        });
        break;

      case 'promise':
        new Promise((resolve, reject) => {
          reject(new Error('Uncaught promise rejection'));
        });

        toast({
          title: 'Promise Rejection',
          description: 'An uncaught promise rejection was generated',
        });
        break;

      case 'custom':
        console.log('Generating a custom error...');
        throw new Error('Custom error message for testing');
        toast({
          title: 'Custom Error',
          description: 'A custom error was generated',
        });
        break;

      case 'console':
        console.error('This is a test console error message');

        toast({
          title: 'Console Error',
          description: 'A console error was logged',
        });
        break;

      case 'async-reference':
        (async () => {
          try {
            // @ts-ignore
            await Promise.resolve(nonExistentAsyncVariable);
          } catch (error) {
            console.error('Async reference error:', error);
          }
        })();

        toast({
          title: 'Async Reference Error',
          description: 'An async reference error was generated',
        });
        break;
    }
  };

  return (
    <IMQAProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Error Testing</h1>
          <p className="text-muted-foreground">
            Generate various types of errors to test IMQA error tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BugPlay className="h-5 w-5" />
                  Error Generator
                </CardTitle>
                <CardDescription>
                  Click buttons to generate different types of errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => generateError('reference')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Reference Error
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => generateError('type')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Type Error
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => generateError('syntax')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Syntax Error
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => generateError('range')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Range Error
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => generateError('promise')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Promise Rejection
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => generateError('custom')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Custom Error
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => generateError('console')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Console Error
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => generateError('async-reference')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Async Reference Error
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex items-center gap-2 justify-start sm:col-span-2 md:col-span-1"
                    onClick={() => {
                      const obj: any = null;
                      obj.nonExistentMethod();
                    }}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Uncaught Error
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Error Summary</h3>
                  <p className="text-sm">Errors generated: {errorCount}</p>
                </div>
              </CardContent>
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
