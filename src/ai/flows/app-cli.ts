'use server';
/**
 * @fileOverview A flow that acts as a command-line interpreter for the application.
 * It uses tools to perform actions based on user commands.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateSecurityReport } from './generate-security-report';
import { recentAlerts } from '@/lib/data';

// Tool to list recent security alerts
const listAlertsTool = ai.defineTool(
  {
    name: 'listAlerts',
    description: 'Lists recent security alerts. Can filter by severity.',
    inputSchema: z.object({
      severity: z.enum(['Critical', 'High', 'Medium', 'Low']).optional().describe('Filter alerts by severity level.'),
    }),
    outputSchema: z.string().describe('A formatted string of the alerts, suitable for terminal display.'),
  },
  async ({ severity }) => {
    let alerts = recentAlerts;
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }
    
    if (alerts.length === 0) {
        return "No alerts found with the specified criteria.";
    }

    // Format as a simple table
    const header = "Severity\tStatus  \tDescription\n" + "-".repeat(80);
    const rows = alerts.map(a => `${a.severity.padEnd(10)}\t${a.status.padEnd(8)}\t${a.description}`).join('\n');
    return `${header}\n${rows}`;
  }
);

// Tool to generate a security report
const generateReportTool = ai.defineTool(
  {
    name: 'generateReport',
    description: 'Generates a security report based on provided parameters.',
    inputSchema: z.object({
      title: z.string().describe('The title for the new report.'),
      range: z.enum(['24h', '7d', '30d', '90d']).optional().describe('The date range for the report (e.g., 24h, 7d). Defaults to 7d.'),
    }),
    outputSchema: z.string().describe('The generated security report in Markdown format.'),
  },
  async ({ title, range }) => {
    const dateRangeMap = {
      '24h': 'Last 24 hours',
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 90 days',
    };
    const dateRange = range ? dateRangeMap[range] : 'Last 7 days';

    const report = await generateSecurityReport({
      reportTitle: title,
      dateRange: dateRange,
      selectedParameters: ['Number of alerts', 'Types of threats detected', 'System vulnerabilities'],
    });

    return `Report generated successfully:\n\n---\n${report.reportContent}`;
  }
);


const AppCliInputSchema = z.object({
  command: z.string().describe('The command typed by the user in the terminal.'),
});
export type AppCliInput = z.infer<typeof AppCliInputSchema>;

const AppCliOutputSchema = z.object({
  response: z.string().describe('The output from the command execution, formatted for the terminal.'),
});
export type AppCliOutput = z.infer<typeof AppCliOutputSchema>;

export async function appCli(input: AppCliInput): Promise<AppCliOutput> {
  return appCliFlow(input);
}

const appCliFlow = ai.defineFlow(
  {
    name: 'appCliFlow',
    inputSchema: AppCliInputSchema,
    outputSchema: AppCliOutputSchema,
  },
  async ({ command }) => {
    const llmResponse = await ai.generate({
      prompt: `You are a command-line interface for a security application. Execute the user's command using the available tools. Command: ${command}`,
      tools: [listAlertsTool, generateReportTool],
    });

    const toolResponse = llmResponse.toolRequest?.tool?.output;
    if (toolResponse) {
       return { response: String(toolResponse) };
    }

    return { response: llmResponse.text };
  }
);
