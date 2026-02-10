"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  Server,
  Database,
  Network,
  Banknote,
  Terminal,
} from 'lucide-react';
import type { NetworkAsset, AttackType, AssetType } from '@/lib/types';
import { AiRecommendationsCard } from '@/components/ai-recommendations-card';
import { GameOverDialog } from '@/components/game-over-dialog';
import { useSidebar } from '@/components/ui/sidebar';
import { useGame } from '@/lib/game-context';

const assetIcons: Record<AssetType, React.ElementType> = {
  'Core Banking': Banknote,
  'Payment Gateway': ArrowRight,
  'Trading System': Terminal,
  'Customer Portal': Network,
  'Database': Database,
};

const AssetCard: React.FC<{
  asset: NetworkAsset;
  onAttack: (assetId: string, attackType: AttackType) => void;
  onDefend: (assetId: string) => void;
  disabled: boolean;
}> = ({ asset, onAttack, onDefend, disabled }) => {
  const Icon = assetIcons[asset.type] || Server;
  const securityColor =
    asset.securityLevel > 75
      ? 'bg-chart-2'
      : asset.securityLevel > 50
      ? 'bg-chart-4'
      : 'bg-chart-1';

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <div className="flex-1">
          <CardTitle className="text-lg font-bold">{asset.name}</CardTitle>
          <CardDescription>{asset.type}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between">
        <div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span>Security Level</span>
                <span>{asset.securityLevel.toFixed(1)}%</span>
              </div>
              <Progress value={asset.securityLevel} className="h-2" indicatorClassName={securityColor} />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Vulnerabilities</span>
                <span>{asset.vulnerabilities.toFixed(1)}%</span>
              </div>
              <Progress value={asset.vulnerabilities} className="h-2" indicatorClassName="bg-destructive" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <Badge variant="outline">Criticality: {asset.criticality}</Badge>
            <span className="font-semibold">${asset.value}M</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button variant="destructive" size="sm" onClick={() => onAttack(asset.id, 'Ransomware')} disabled={disabled}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Attack
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDefend(asset.id)} disabled={disabled}>
            <Shield className="mr-2 h-4 w-4" /> Defend
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const { setOpenMobile, isMobile } = useSidebar();
  const { assets, handleAttack, handleDefend, gameOver } = useGame();

  const onAttack = (assetId: string, attackType: AttackType) => {
    handleAttack(assetId, attackType);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const onDefend = (assetId: string) => {
    handleDefend(assetId);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <div className="space-y-6">
      <GameOverDialog />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CISO Dashboard</h1>
        <p className="text-muted-foreground">Monitor assets, respond to threats, and enhance security.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} onAttack={onAttack} onDefend={onDefend} disabled={gameOver} />
        ))}
      </div>
      
      <AiRecommendationsCard />
    </div>
  );
};
