export type AssetType = 'Core Banking' | 'Payment Gateway' | 'Trading System' | 'Customer Portal' | 'Database';

export interface NetworkAsset {
  id: string;
  name: string;
  type: AssetType;
  criticality: number; // 0-100
  securityLevel: number; // 0-100 (defense strength)
  vulnerabilities: number; // 0-100
  value: number; // in millions
}

export type AttackType = 'Ransomware' | 'DDoS' | 'Data Breach' | 'Insider Threat';

export interface Incident {
  id: string;
  assetId: string;
  assetName: string;
  attackType: AttackType;
  startTime: number; // timestamp
  resolved: boolean;
  cost: number;
}

export type LogEntry = {
  id: number;
  timestamp: number;
  message: string;
  type: 'info' | 'attack' | 'defense' | 'incident' | 'error' | 'game';
};

export type Recommendation = {
  control: string;
  rationale: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedCost: 'Low' | 'Medium' | 'High';
  expectedImpact: string;
};
