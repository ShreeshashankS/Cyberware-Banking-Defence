"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ShieldCheck,
  Target,
  FileClock,
  CircleHelp,
  Siren,
  Shield,
  Frown,
  Banknote,
  Repeat,
} from 'lucide-react';
import { Logo } from './icons';
import { useSidebar } from './ui/sidebar';
import { useGame } from '@/lib/game-context';
import { HelpDialog } from './help-dialog';
import { formatDistanceToNow } from 'date-fns';

export function SidebarItems() {
  const { setOpenMobile } = useSidebar();
  const { incidents, logs, respondToIncident, score, scoreChange, budget, gameOver, restartGame } = useGame();
  const [helpOpen, setHelpOpen] = useState(false);

  const activeIncidents = incidents.filter(i => !i.resolved);

  return (
    <>
      <div className="flex h-full flex-col text-sidebar-foreground">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Logo className="h-6 w-6" />
          <h1 className="text-lg font-semibold">BankSafe</h1>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4">
            {/* Score Card */}
            <Card className="bg-sidebar-accent">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center justify-between text-base">
                  Performance Score
                  <Target className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-4xl font-bold text-sidebar-primary">{score}</div>
                <p className="text-xs text-muted-foreground">
                  {scoreChange.toFixed(1) === '0.0' || scoreChange.toFixed(1) === '-0.0' ? (
                    <span>Score is stable</span>
                  ) : (
                    <span
                      className={
                        scoreChange > 0 ? 'text-chart-2' : 'text-destructive'
                      }
                    >
                      {scoreChange > 0 ? '▲' : '▼'} {Math.abs(scoreChange).toFixed(1)}% since last event
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

             {/* Budget Card */}
            <Card className="bg-sidebar-accent">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center justify-between text-base">
                  Operating Budget
                  <Banknote className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-sidebar-primary">${budget.toLocaleString()}</div>
                 <p className="text-xs text-muted-foreground">
                  { budget < 200000 ? 'Budget is critically low' : 'Available funds for security ops' }
                </p>
              </CardContent>
            </Card>

            {/* Incidents Card */}
            <Card className="bg-sidebar-accent">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center justify-between text-base">
                  Active Incidents
                  <Siren className="h-5 w-5 text-destructive" />
                </CardTitle>
                <CardDescription className="text-xs">
                  Threats requiring immediate attention.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                {activeIncidents.map((incident) => (
                  <div key={incident.id} className="group flex items-start gap-3">
                    <div className="mt-1">
                      <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-tight">
                        {incident.attackType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        on {incident.assetName}
                      </p>
                       <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(incident.startTime, { addSuffix: true })}
                      </p>
                    </div>
                    <Button size="xs" variant="destructive" disabled={gameOver} onClick={() => {
                      respondToIncident(incident.id);
                      if (window.innerWidth < 768) {
                        setOpenMobile(false)
                      }
                    }}>
                      Respond
                    </Button>
                  </div>
                ))}
                {activeIncidents.length === 0 && (
                  <div className="flex flex-col items-center justify-center space-y-2 py-4 text-center">
                      <ShieldCheck className="h-8 w-8 text-green-500" />
                      <p className="text-sm font-medium">All Clear</p>
                      <p className="text-xs text-muted-foreground">No active incidents.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Log Card */}
            <Card className="bg-sidebar-accent">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center justify-between text-base">
                  Event Log
                  <FileClock className="h-5 w-5" />
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time stream of game events.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-48 overflow-y-auto p-4 pt-0">
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        <Shield className="h-4 w-4 text-sidebar-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight">
                          {log.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && (
                       <div className="flex flex-col items-center justify-center space-y-2 py-4 text-center">
                          <Frown className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">No Events</p>
                          <p className="text-xs text-muted-foreground">The simulation has not started.</p>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <div className="mt-auto border-t border-sidebar-border p-4 space-y-2">
           <Button variant="ghost" className="w-full justify-start gap-2" onClick={restartGame}>
            <Repeat className="h-4 w-4" />
            New Simulation
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setHelpOpen(true)}>
            <CircleHelp className="h-4 w-4" />
            Help & Tutorial
          </Button>
        </div>
      </div>
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}
