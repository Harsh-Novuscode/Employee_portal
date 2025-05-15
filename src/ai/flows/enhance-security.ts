// This is an auto-generated file from Firebase Studio.
'use server';

/**
 * @fileOverview Implements an AI-powered security enhancement flow for analyzing login attempts and triggering extra security measures.
 *
 * - enhanceSecurity - A function that analyzes login attempts and determines if extra security measures are needed.
 * - EnhanceSecurityInput - The input type for the enhanceSecurity function.
 * - EnhanceSecurityOutput - The return type for the enhanceSecurity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceSecurityInputSchema = z.object({
  username: z.string().describe('The username of the user attempting to log in.'),
  ipAddress: z.string().describe('The IP address from which the login attempt originates.'),
  loginTimestamp: z.string().describe('The timestamp of the login attempt.'),
  userAgent: z.string().describe('The user agent string of the browser or application used for the login attempt.'),
  loginFailuresInLastHour: z
    .number()
    .describe('The number of failed login attempts for this user in the last hour.'),
});
export type EnhanceSecurityInput = z.infer<typeof EnhanceSecurityInputSchema>;

const EnhanceSecurityOutputSchema = z.object({
  isSuspicious: z
    .boolean()
    .describe(
      'Whether the login attempt is considered suspicious based on the input data. If true, extra security measures should be triggered.'
    ),
  reason: z
    .string()
    .describe('The reason why the login attempt is considered suspicious, if applicable.'),
});
export type EnhanceSecurityOutput = z.infer<typeof EnhanceSecurityOutputSchema>;

export async function enhanceSecurity(input: EnhanceSecurityInput): Promise<EnhanceSecurityOutput> {
  return enhanceSecurityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceSecurityPrompt',
  input: {schema: EnhanceSecurityInputSchema},
  output: {schema: EnhanceSecurityOutputSchema},
  prompt: `You are a security expert analyzing login attempts to identify suspicious activity.

  Based on the following information, determine if the login attempt is suspicious and requires extra security measures.

  Username: {{{username}}}
  IP Address: {{{ipAddress}}}
  Login Timestamp: {{{loginTimestamp}}}
  User Agent: {{{userAgent}}}
  Login Failures in Last Hour: {{{loginFailuresInLastHour}}}

  Consider factors such as unusual IP addresses, rapid login failures, and unusual user agents.

  Return a JSON object with the following format:
  {
    "isSuspicious": true/false, // true if the login attempt is suspicious, false otherwise
    "reason": "reason for suspicion" // a brief explanation of why the login attempt is suspicious, if applicable
  }

  If the login attempt does not appear suspicious, isSuspicious should be false and the reason should be an empty string.
`,
});

const enhanceSecurityFlow = ai.defineFlow(
  {
    name: 'enhanceSecurityFlow',
    inputSchema: EnhanceSecurityInputSchema,
    outputSchema: EnhanceSecurityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

