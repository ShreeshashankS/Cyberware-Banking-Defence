'use server';

import { getAiRiskRecommendations } from '@/ai/flows/ai-risk-recommendations';
import type { AiRiskRecommendationsInput } from '@/ai/flows/ai-risk-recommendations';
import { z } from 'zod';

const inputSchema = z.object({
  threatLandscape: z.string().min(10, 'Please describe the threat landscape in more detail.'),
  infrastructureConfiguration: z.string().min(10, 'Please describe the infrastructure in more detail.'),
  vulnerabilities: z.string().min(10, 'Please describe the vulnerabilities in more detail.'),
});


export async function generateRecommendationsAction(prevState: any, formData: FormData) {
  const rawFormData = {
    threatLandscape: formData.get('threatLandscape'),
    infrastructureConfiguration: formData.get('infrastructureConfiguration'),
    vulnerabilities: formData.get('vulnerabilities'),
  }

  const validatedFields = inputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const result = await getAiRiskRecommendations(validatedFields.data as AiRiskRecommendationsInput);
    if (!result || !result.recommendations) {
      return { success: false, error: 'Failed to get recommendations from AI.' };
    }
    return { success: true, data: result.recommendations };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}
