"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertCircle, Loader2, DollarSign, ShieldCheck } from 'lucide-react';
import { generateRecommendationsAction } from '@/lib/actions';
import type { Recommendation } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Get AI Recommendations
        </>
      )}
    </Button>
  );
}

const priorityVariant: Record<Recommendation['priority'], 'destructive' | 'default' | 'secondary'> = {
  'High': 'destructive',
  'Medium': 'default',
  'Low': 'secondary',
};

const costVariant: Record<Recommendation['estimatedCost'], 'destructive' | 'default' | 'secondary'> = {
  'High': 'destructive',
  'Medium': 'default',
  'Low': 'secondary',
};


export function AiRecommendationsCard() {
  const initialState = { success: false, data: [], error: undefined, errors: {} };
  const [state, dispatch] = useActionState(generateRecommendationsAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Driven Risk Advisor</CardTitle>
        <CardDescription>
          Describe your environment to receive AI-powered security control recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="threatLandscape">Threat Landscape</Label>
              <Textarea
                id="threatLandscape"
                name="threatLandscape"
                placeholder="e.g., 'Increasing phishing attacks targeting financial employees...'"
                className="min-h-[120px]"
              />
              {state.errors?.threatLandscape && <p className="text-sm text-destructive">{state.errors.threatLandscape[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="infrastructureConfiguration">Infrastructure Config</Label>
              <Textarea
                id="infrastructureConfiguration"
                name="infrastructureConfiguration"
                placeholder="e.g., 'Hybrid cloud with legacy on-prem servers, customer data in...' "
                className="min-h-[120px]"
              />
               {state.errors?.infrastructureConfiguration && <p className="text-sm text-destructive">{state.errors.infrastructureConfiguration[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vulnerabilities">Known Vulnerabilities</Label>
              <Textarea
                id="vulnerabilities"
                name="vulnerabilities"
                placeholder="e.g., 'Unpatched web servers, weak MFA on internal tools...'"
                className="min-h-[120px]"
              />
               {state.errors?.vulnerabilities && <p className="text-sm text-destructive">{state.errors.vulnerabilities[0]}</p>}
            </div>
          </div>
          <SubmitButton />
        </form>

        {state.error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.success && state.data && (
          <div className="mt-6">
             <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <Accordion type="single" collapsible className="w-full">
              {(state.data as Recommendation[]).map((rec, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex flex-wrap items-center gap-4 text-left">
                       <Badge variant={priorityVariant[rec.priority]}>Priority: {rec.priority}</Badge>
                       <span className="flex-1 font-semibold">{rec.control}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 text-muted-foreground">
                    <p>{rec.rationale}</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-foreground"/>
                            <span className="font-medium text-foreground">Cost:</span>
                            <Badge variant={costVariant[rec.estimatedCost]} className="text-xs">{rec.estimatedCost}</Badge>
                        </div>
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-foreground"/>
                            <span className="font-medium text-foreground">Impact:</span>
                            <span>{rec.expectedImpact}</span>
                        </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
