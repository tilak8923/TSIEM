'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating customized security reports based on specified parameters.
 *
 * The flow takes in parameters for report generation and outputs a comprehensive security report.
 * It includes:
 *   - generateSecurityReport - A function that generates the security report.
 *   - GenerateSecurityReportInput - The input type for the generateSecurityReport function.
 *   - GenerateSecurityReportOutput - The return type for the generateSecurityReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSecurityReportInputSchema = z.object({
  reportTitle: z.string().describe('Title of the security report.'),
  dateRange: z.string().describe('Date range for the report (e.g., Last 7 days, Last 30 days).'),
  selectedParameters: z
    .array(z.string())
    .describe(
      'Parameters to include in the report (e.g., Number of alerts, Types of threats detected, System vulnerabilities, User activity).'  ),
  additionalNotes: z.string().optional().describe('Any additional notes or context to include in the report.'),
});
export type GenerateSecurityReportInput = z.infer<typeof GenerateSecurityReportInputSchema>;

const GenerateSecurityReportOutputSchema = z.object({
  reportContent: z.string().describe('The generated security report content.'),
});
export type GenerateSecurityReportOutput = z.infer<typeof GenerateSecurityReportOutputSchema>;

export async function generateSecurityReport(input: GenerateSecurityReportInput): Promise<GenerateSecurityReportOutput> {
  return generateSecurityReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSecurityReportPrompt',
  input: {schema: GenerateSecurityReportInputSchema},
  output: {schema: GenerateSecurityReportOutputSchema},
  prompt: `You are a security expert. Generate a comprehensive security report based on the following parameters:

Report Title: {{{reportTitle}}}
Date Range: {{{dateRange}}}
Selected Parameters:
{{#each selectedParameters}}
- {{{this}}}
{{/each}}

{{#if additionalNotes}}
Additional Notes: {{{additionalNotes}}}
{{/if}}

Provide a detailed analysis and insights based on the selected parameters and date range.  The report should be well-structured and easy to understand, suitable for communicating security findings to both technical and non-technical audiences.
`,
});

const generateSecurityReportFlow = ai.defineFlow(
  {
    name: 'generateSecurityReportFlow',
    inputSchema: GenerateSecurityReportInputSchema,
    outputSchema: GenerateSecurityReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
