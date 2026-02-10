'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGame } from '@/lib/game-context';

export function GameOverDialog() {
  const { gameOver, score, gameTime, restartGame } = useGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  }

  return (
    <AlertDialog open={gameOver}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Simulation Over</AlertDialogTitle>
          <AlertDialogDescription>
            Your performance as CISO has been evaluated. Review your results below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Final Score</span>
                <span className="text-2xl font-bold text-primary">{score}</span>
            </div>
             <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Simulation Time</span>
                <span className="text-lg font-semibold">{formatTime(gameTime)}</span>
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={restartGame}>
            Run New Simulation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
