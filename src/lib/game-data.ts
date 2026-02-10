import type { NetworkAsset } from '@/lib/types';

export const INITIAL_ASSETS: NetworkAsset[] = [
  { id: 'cbs-01', name: 'Core Banking System', type: 'Core Banking', criticality: 95, securityLevel: 70, vulnerabilities: 20, value: 50 },
  { id: 'pg-01', name: 'Payment Gateway', type: 'Payment Gateway', criticality: 90, securityLevel: 65, vulnerabilities: 35, value: 40 },
  { id: 'ts-01', name: 'Securities Trading Platform', type: 'Trading System', criticality: 85, securityLevel: 60, vulnerabilities: 40, value: 35 },
  { id: 'cp-01', name: 'Online Banking Portal', type: 'Customer Portal', criticality: 75, securityLevel: 50, vulnerabilities: 60, value: 20 },
  { id: 'db-01', name: 'Customer Data Warehouse', type: 'Database', criticality: 80, securityLevel: 55, vulnerabilities: 50, value: 30 },
];
