'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>How to Play BankSafe Simulator</DialogTitle>
          <DialogDescription>
            Welcome, CISO! Your goal is to protect the bank's digital assets from cyber threats while managing your budget.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground">The Goal</h4>
            <p>
              Maintain a high Performance Score by keeping asset security levels high and vulnerabilities low. Avoid running out of budget or letting a critical asset be compromised.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Core Mechanics</h4>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Budget:</strong> You have a starting budget for all security operations. Defending assets and responding to incidents costs money.</li>
              <li><strong>Time:</strong> The simulation runs in real-time. Unresolved incidents will continuously damage assets and drain your score.</li>
               <li><strong>Game Over:</strong> The simulation ends if your budget hits zero or a critical asset's security level falls to zero.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Actions</h4>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Attack:</strong> Simulate an attack to test your defenses. This creates an active incident that you must respond to.</li>
              <li><strong>Defend:</strong> Spend budget to improve an asset's security level and reduce its vulnerabilities.</li>
              <li><strong>Respond:</strong> Spend budget to mitigate an active incident. The longer you wait, the more it costs and the more damage is done.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">AI Advisor</h4>
            <p>
              Feeling stuck? Use the AI-Driven Risk Advisor. Describe your security challenges, and the AI will provide expert recommendations with estimated costs and impacts.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Protect the Bank!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
