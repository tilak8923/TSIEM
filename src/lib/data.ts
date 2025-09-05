// This file now contains only static data that is not user-specific
// or data that can be considered as initial/default state.
// User-specific data like alerts, logs, and alertRules are now fetched from Firestore.

export const dashboardStats = {
  threatLevel: 78,
  alertsTriggered: 12,
  vulnerabilitiesDetected: 5,
  systemsAffected: 3,
};

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
