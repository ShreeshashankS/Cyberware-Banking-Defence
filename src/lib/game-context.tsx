'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import type { NetworkAsset, Incident, LogEntry, AttackType } from '@/lib/types';
import { INITIAL_ASSETS } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';

const INITIAL_BUDGET = 1000000;
const GAME_TICK_MS = 5000; // 5 seconds
const INCIDENT_DAMAGE_PER_TICK = 0.5; // Security level decrease
const VULNERABILITY_INCREASE_PER_TICK = 0.2;
const COST_PER_DEFEND = 50000;
const COST_PER_RESPONSE = 75000;

interface GameState {
  assets: NetworkAsset[];
  incidents: Incident[];
  logs: LogEntry[];
  score: number;
  scoreChange: number;
  budget: number;
  gameOver: boolean;
  gameTime: number;
  handleAttack: (assetId: string, attackType: AttackType) => void;
  handleDefend: (assetId: string) => void;
  respondToIncident: (incidentId: string) => void;
  restartGame: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

const calculateScore = (assets: NetworkAsset[], budget: number): number => {
  if (assets.length === 0) return 0;

  const totalWeightedSecurity = assets.reduce((acc, asset) => acc + (asset.securityLevel * asset.criticality), 0);
  const totalWeightedVulnerability = assets.reduce((acc, asset) => acc + (asset.vulnerabilities * asset.criticality), 0);
  const totalCriticality = assets.reduce((acc, asset) => acc + asset.criticality, 0);

  if (totalCriticality === 0) return 0;

  const avgSecurity = totalWeightedSecurity / totalCriticality;
  const avgVulnerability = totalWeightedVulnerability / totalCriticality;
  
  const assetScore = ((avgSecurity * 1.5) + (100 - avgVulnerability)) / 2.5;
  
  const budgetBonus = Math.max(0, budget / INITIAL_BUDGET) * 50;

  const rawScore = (assetScore * 0.95) + (budgetBonus * 0.05);

  const finalScore = Math.max(0, Math.min(1000, Math.round(rawScore * 10)));
  
  return finalScore;
};


export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<NetworkAsset[]>(INITIAL_ASSETS);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [budget, setBudget] = useState(INITIAL_BUDGET);
  const [gameOver, setGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  const [score, setScore] = useState(() => calculateScore(INITIAL_ASSETS, INITIAL_BUDGET));
  const [scoreChange, setScoreChange] = useState(0);
  const previousScoreRef = useRef(score);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    setLogs(prevLogs => [
      { id: Date.now() + Math.random(), timestamp: Date.now(), message, type },
      ...prevLogs
    ].slice(0, 50));
  }, []);

  const restartGame = useCallback(() => {
    setLogs( (prev) => [{ id: Date.now() + Math.random(), message: 'New simulation started.', type: 'game', timestamp: Date.now() }]);
    setAssets(INITIAL_ASSETS);
    setIncidents([]);
    setBudget(INITIAL_BUDGET);
    setScore(calculateScore(INITIAL_ASSETS, INITIAL_BUDGET));
    previousScoreRef.current = calculateScore(INITIAL_ASSETS, INITIAL_BUDGET);
    setScoreChange(0);
    setGameTime(0);
    setGameOver(false);
  }, []);

  // Game Loop
  useEffect(() => {
    if (gameOver) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setGameTime(t => t + GAME_TICK_MS / 1000);
      let budgetLossFromIncidents = 0;
      
      setAssets(currentAssets => {
        const activeIncidents = incidents.filter(i => !i.resolved);
        if (activeIncidents.length === 0) return currentAssets;

        return currentAssets.map(asset => {
          const relevantIncidents = activeIncidents.filter(i => i.assetId === asset.id);
          if (relevantIncidents.length > 0) {
            const damage = INCIDENT_DAMAGE_PER_TICK * relevantIncidents.length;
            const vulnIncrease = VULNERABILITY_INCREASE_PER_TICK * relevantIncidents.length;
            
            budgetLossFromIncidents += 1000 * relevantIncidents.length;

            const newSecurityLevel = Math.max(0, asset.securityLevel - damage);
            
            if (newSecurityLevel <= 0 && asset.criticality > 80) {
               setGameOver(true);
               addLog(`GAME OVER: Critical asset ${asset.name} has been compromised!`, 'error');
               toast({ title: 'Game Over!', description: `Critical asset ${asset.name} was compromised.`, variant: 'destructive' });
            }

            return {
              ...asset,
              securityLevel: newSecurityLevel,
              vulnerabilities: Math.min(100, asset.vulnerabilities + vulnIncrease),
            };
          }
          return asset;
        });
      });

      setBudget(b => Math.max(0, b - budgetLossFromIncidents));

    }, GAME_TICK_MS);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [incidents, gameOver, addLog, toast]);

  // Score Calculation and Game Over Check
  useEffect(() => {
    if (gameOver) return;

    const newScore = calculateScore(assets, budget);
    const prevScore = previousScoreRef.current;
    
    if (newScore !== score) {
      setScore(newScore);
      if (prevScore > 0 && prevScore !== newScore) {
          const change = ((newScore - prevScore) / prevScore) * 100;
          setScoreChange(change);
      }
      previousScoreRef.current = newScore;
    }

    if (budget <= 0 && !gameOver) {
      setGameOver(true);
      addLog('GAME OVER: You have run out of budget!', 'error');
      toast({ title: 'Game Over!', description: 'You have exhausted your budget.', variant: 'destructive' });
    }

  }, [assets, budget, score, gameOver, toast, addLog]);

  useEffect(() => {
    restartGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAttack = useCallback((assetId: string, attackType: AttackType) => {
    if (gameOver) return;
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      assetId,
      assetName: asset.name,
      attackType,
      startTime: Date.now(),
      resolved: false,
      cost: 0,
    };
    setIncidents(prev => [newIncident, ...prev]);
    addLog(`Attack: ${attackType} on ${asset.name}`, 'attack');

    setAssets(prevAssets => prevAssets.map(a => a.id === assetId ? { ...a, securityLevel: Math.max(0, a.securityLevel - 15), vulnerabilities: Math.min(100, a.vulnerabilities + 20) } : a));

    toast({
      title: 'Attack Detected',
      description: `${attackType} attack on ${asset.name}. Incident created.`,
      variant: 'destructive',
    });
  }, [assets, gameOver, addLog, toast]);

  const handleDefend = useCallback((assetId: string) => {
    if (gameOver || budget < COST_PER_DEFEND) {
        toast({ title: 'Action Failed', description: 'Not enough budget to defend.', variant: 'destructive'});
        return;
    };

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    setBudget(b => b - COST_PER_DEFEND);
    addLog(`Defense: Hardening ${asset.name} for $${COST_PER_DEFEND.toLocaleString()}`, 'defense');
    setAssets(prevAssets => prevAssets.map(a => a.id === assetId ? { ...a, securityLevel: Math.min(100, a.securityLevel + 10), vulnerabilities: Math.max(0, a.vulnerabilities - 5) } : a));

    toast({
      title: 'Defense Implemented',
      description: `Security measures for ${asset.name} enhanced.`,
    });
  }, [assets, gameOver, budget, addLog, toast]);

  const respondToIncident = useCallback((incidentId: string) => {
    if (gameOver || budget < COST_PER_RESPONSE) {
      toast({ title: 'Action Failed', description: 'Not enough budget to respond.', variant: 'destructive'});
      return;
    }
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident || incident.resolved) return;

    const resolutionCost = COST_PER_RESPONSE + Math.floor((Date.now() - incident.startTime) / 60000) * 1000;
    setBudget(b => b - resolutionCost);
    
    setIncidents(prev => prev.filter(i => i.id !== incidentId));
    addLog(`Response: Mitigated ${incident.attackType} on ${incident.assetName} for $${resolutionCost.toLocaleString()}`, 'defense');
    
    setAssets(prevAssets => prevAssets.map(a => a.id === incident.assetId ? { ...a, securityLevel: Math.min(100, a.securityLevel + 5) } : a));

    toast({
      title: 'Incident Responded',
      description: `Threat from ${incident.attackType} on ${incident.assetName} has been mitigated.`,
    });
  }, [incidents, gameOver, budget, addLog, toast]);


  const value = { assets, incidents, logs, score, scoreChange, budget, gameOver, gameTime, handleAttack, handleDefend, respondToIncident, restartGame };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
