
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUserId } from '@/hooks/use-user-id';
import { collection, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Upload } from 'lucide-react';

// Basic validation for a log entry
function isValidLog(log: any) {
  return (
    typeof log === 'object' &&
    log !== null &&
    typeof log.timestamp === 'string' &&
    typeof log.severity === 'string' &&
    typeof log.source === 'string' &&
    typeof log.message === 'string'
  );
}

export default function IngestionPage() {
  const userId = useUserId();
  const [jsonInput, setJsonInput] = useState('');
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User ID not found. Cannot import logs.',
      });
      return;
    }
    if (!jsonInput.trim()) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Input cannot be empty.',
        });
        return;
    }

    setRunning(true);
    try {
      const logs = JSON.parse(jsonInput);
      if (!Array.isArray(logs)) {
        throw new Error('Input must be a JSON array of log objects.');
      }
      
      const validLogs = logs.filter(isValidLog);
      
      if (validLogs.length !== logs.length) {
          toast({
              variant: 'destructive',
              title: 'Warning',
              description: `Some log entries were invalid and have been skipped. Imported ${validLogs.length} of ${logs.length}.`
          });
      }

      if (validLogs.length === 0) {
        throw new Error("No valid log entries found to import.");
      }

      // Use a batch write for efficiency
      const batch = writeBatch(db);
      const logsCollection = collection(db, 'users', userId, 'logs');
      validLogs.forEach(log => {
        const docRef = collection(logsCollection).doc();
        batch.set(docRef, log);
      });
      await batch.commit();

      toast({
        title: 'Import Successful',
        description: `Successfully imported ${validLogs.length} log entries.`,
      });
      setJsonInput('');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message || 'Please check the JSON format.',
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold tracking-wider">Log Ingestion</h1>
        <p className="text-muted-foreground">
          Manually import log files by pasting JSON content.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Import Logs</CardTitle>
          <CardDescription>
            Paste the JSON output from your log collection script. The data should be an array of log objects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Label htmlFor="log-input">Log Data (JSON Array)</Label>
            <Textarea
                id="log-input"
                className="font-mono min-h-[300px]"
                placeholder={`[
  {
    "timestamp": "2024-01-01T12:00:00Z",
    "severity": "INFO",
    "source": "YourApp",
    "message": "User logged in"
  }
]`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
                Each object must contain: `timestamp` (string), `severity` (string), `source` (string), and `message` (string).
            </p>
        </CardContent>
        <CardFooter>
            <Button onClick={handleImport} disabled={running || !userId}>
                {running ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Upload className="mr-2 h-4 w-4" />
                )}
                {userId ? 'Import Logs' : 'Initializing...'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
