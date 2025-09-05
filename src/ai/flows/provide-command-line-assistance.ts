'use server';

/**
 * @fileOverview Provides command-line assistance with a hacker vibe.
 *
 * - provideCommandLineAssistance - A function that provides command-line assistance.
 * - ProvideCommandLineAssistanceInput - The input type for the provideCommandLineAssistance function.
 * - ProvideCommandLineAssistanceOutput - The return type for the provideCommandLineAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideCommandLineAssistanceInputSchema = z.object({
  command: z.string().describe('The command to execute.'),
});
export type ProvideCommandLineAssistanceInput = z.infer<typeof ProvideCommandLineAssistanceInputSchema>;

const ProvideCommandLineAssistanceOutputSchema = z.object({
  response: z.string().describe('The response from the command.'),
});
export type ProvideCommandLineAssistanceOutput = z.infer<typeof ProvideCommandLineAssistanceOutputSchema>;

export async function provideCommandLineAssistance(input: ProvideCommandLineAssistanceInput): Promise<ProvideCommandLineAssistanceOutput> {
  return provideCommandLineAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideCommandLineAssistancePrompt',
  input: {schema: ProvideCommandLineAssistanceInputSchema},
  output: {schema: ProvideCommandLineAssistanceOutputSchema},
  prompt: `You are a command-line interface that provides assistance with a hacker vibe.

  You will take the command and respond in a hacker-like style.
  - Use a dark green background, bright green text, and a monospace font for your responses if possible (e.g. using HTML spans with inline styles).
  - Incorporate ASCII art where appropriate to enhance the hacker theme.
  - Your entire response should be a single block of pre-formatted text.
  - When you need to show code or commands, wrap them in \`<code>\` tags.

  Command: {{{command}}}`,
});

const provideCommandLineAssistanceFlow = ai.defineFlow(
  {
    name: 'provideCommandLineAssistanceFlow',
    inputSchema: ProvideCommandLineAssistanceInputSchema,
    outputSchema: ProvideCommandLineAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
