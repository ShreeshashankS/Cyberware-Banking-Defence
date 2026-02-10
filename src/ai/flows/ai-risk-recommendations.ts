// ai-risk-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that provides AI-driven risk recommendations for security control improvements.
 *
 * The flow analyzes threats, vulnerabilities, and the current infrastructure configuration to suggest
 * relevant security enhancements. It exports:
 * - `getAiRiskRecommendations`: A function to trigger the risk recommendation flow.
 * - `AiRiskRecommendationsInput`: The input type for the risk recommendation function.
 * - `AiRiskRecommendationsOutput`: The return type for the risk recommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const AiRiskRecommendationsInputSchema = z.object({
  threatLandscape: z.string().describe('A description of the current threat landscape.'),
  infrastructureConfiguration: z.string().describe('A description of the current infrastructure configuration.'),
  vulnerabilities: z.string().describe('A description of known vulnerabilities.'),
});
export type AiRiskRecommendationsInput = z.infer<typeof AiRiskRecommendationsInputSchema>;

// Define the output schema
const AiRiskRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      control: z.string().describe('The recommended security control.'),
      rationale: z.string().describe('The rationale for implementing the control.'),
      priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of implementing the control.'),
      estimatedCost: z.enum(['Low', 'Medium', 'High']).describe('The estimated cost of implementation (Low, Medium, High).'),
      expectedImpact: z.string().describe('The expected impact on security posture after implementation.'),
    })
  ).describe('A list of AI-driven security control recommendations.'),
});
export type AiRiskRecommendationsOutput = z.infer<typeof AiRiskRecommendationsOutputSchema>;

// Define the prompt
const aiRiskRecommendationsPrompt = ai.definePrompt({
  name: 'aiRiskRecommendationsPrompt',
  input: {schema: AiRiskRecommendationsInputSchema},
  output: {schema: AiRiskRecommendationsOutputSchema},
  prompt: `You are an AI-powered cybersecurity advisor providing recommendations to a Bank CISO.

  Analyze the provided threat landscape, infrastructure configuration, and vulnerabilities to suggest security control improvements.
  Use your expertise to recommend the most relevant and effective security controls.

  For each recommendation, provide:
  1.  **Control**: The specific security control to implement.
  2.  **Rationale**: A clear explanation of why this control is necessary based on the provided context.
  3.  **Priority**: The urgency of implementation (High, Medium, or Low).
  4.  **Estimated Cost**: A rough estimate of the resource and financial cost (Low, Medium, or High).
  5.  **Expected Impact**: A brief description of the positive effect this control will have on the security posture.

  Threat Landscape: {{{threatLandscape}}}
  Infrastructure Configuration: {{{infrastructureConfiguration}}}
  Vulnerabilities: {{{vulnerabilities}}}

  Based on this information, provide a list of security control recommendations.
  Ensure that the recommendations are actionable and relevant to the provided context.

  Format your response as a JSON object conforming to the output schema.`,
});

export async function getAiRiskRecommendations(
  input: AiRiskRecommendationsInput
): Promise<AiRiskRecommendationsOutput> {
  return aiRiskRecommendationsFlow(input);
}

const aiRiskRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiRiskRecommendationsFlow',
    inputSchema: AiRiskRecommendationsInputSchema,
    outputSchema: AiRiskRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await aiRiskRecommendationsPrompt(input);
    if (!output) {
      throw new Error('The model did not return an output.');
    }
    return output;
  }
);
