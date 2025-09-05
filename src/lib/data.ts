import type { AlertCircle, Terminal, Shield, Server, FileText, Bot, Users } from 'lucide-react';

export const dashboardStats = {
  threatLevel: 78,
  alertsTriggered: 12,
  vulnerabilitiesDetected: 5,
  systemsAffected: 3,
};

export const recentAlerts = [
  { id: 'ALERT-001', severity: 'Critical', description: 'Unusual login activity from new IP', timestamp: '2023-10-27T10:00:00Z', status: 'Active' },
  { id: 'ALERT-002', severity: 'High', description: 'Potential SQL injection attempt', timestamp: '2023-10-27T09:45:12Z', status: 'Active' },
  { id: 'ALERT-003', severity: 'Medium', description: 'Port scan detected on server Alpha', timestamp: '2023-10-27T09:30:50Z', status: 'Resolved' },
  { id: 'ALERT-004', severity: 'Low', description: 'Multiple failed login attempts for user "admin"', timestamp: '2023-10-27T09:15:22Z', status: 'Resolved' },
  { id: 'ALERT-005', severity: 'Critical', description: 'Malware signature detected in file upload', timestamp: '2023-10-27T08:55:03Z', status: 'Active' },
];

export const eventsByType = [
  { name: 'Malware', value: 42, fill: 'hsl(var(--destructive))' },
  { name: 'Intrusion', value: 28, fill: 'hsl(var(--warning))' },
  { name: 'Policy Violation', value: 15, fill: 'hsl(var(--info))' },
  { name: 'Anomalous Activity', value: 78, fill: 'hsl(var(--primary))' },
];

export const systemStatus = [
  { name: 'Firewall', status: 'Operational' },
  { name: 'Auth Service', status: 'Operational' },
  { name: 'Database', status: 'Degraded' },
  { name: 'Web Server', status: 'Offline' },
  { name: 'Log Collector', status: 'Operational' },
];

export const logEntries = [
  { id: 1, timestamp: '2023-10-27 10:05:12', severity: 'INFO', source: 'WebApp', message: 'User admin logged in successfully from 192.168.1.1' },
  { id: 2, timestamp: '2023-10-27 10:05:10', severity: 'WARN', source: 'DB', message: 'Query execution time exceeded 500ms' },
  { id: 3, timestamp: '2023-10-27 10:04:55', severity: 'CRITICAL', source: 'AuthSvc', message: 'Failed login attempt for user guest from IP 10.0.0.5' },
  { id: 4, timestamp: '2023-10-27 10:03:41', severity: 'INFO', source: 'Firewall', message: 'Blocked incoming connection from 203.0.113.15 to port 22' },
  { id: 5, timestamp: '2023-10-27 10:02:19', severity: 'DEBUG', source: 'WebApp', message: 'API request to /users/1 completed' },
  { id: 6, timestamp: '2023-10-27 10:01:03', severity: 'CRITICAL', source: 'IDS', message: 'Potential SQL injection detected: SELECT * FROM users' },
  { id: 7, timestamp: '2023-10-27 09:59:58', severity: 'INFO', source: 'WebApp', message: 'User john.doe logged out' },
  { id: 8, timestamp: '2023-10-27 09:58:34', severity: 'WARN', source: 'System', message: 'Disk space on /var/log is at 85%' },
];

export const alertRules = [
    { id: 'rule-001', name: 'Brute Force Attempts', condition: '5 failed logins in 1 minute from same IP', severity: 'High', enabled: true },
    { id: 'rule-002', name: 'SQL Injection Signature', condition: 'Log message contains SQL keywords', severity: 'Critical', enabled: true },
    { id: 'rule-003', name: 'Anomalous Port Access', condition: 'Access to non-standard ports', severity: 'Medium', enabled: true },
    { id: 'rule-004', name: 'High CPU Usage', condition: 'CPU > 90% for 5 minutes', severity: 'Medium', enabled: false },
];
