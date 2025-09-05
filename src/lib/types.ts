export type Alert = {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
};

export type LogEntry = {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARN' | 'INFO' | 'DEBUG';
  source: string;
  message: string;
};

export type AlertRule = {
    id: string;
    name: string;
    condition: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    enabled: boolean;
};

export type SystemStatus = {
  name: string;
  status: 'Operational' | 'Degraded' | 'Offline';
};
