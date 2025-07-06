export interface Vault {
  id: string;
  owner: string;
  collateralAmount: number;
  debtAmount: number;
  collateralRatio: number;
  liquidationPrice: number;
  isLiquidatable: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

export interface OraclePrice {
  pair: string;
  price: number;
  timestamp: Date;
  confidence: number;
}

export interface LiquidationEvent {
  id: string;
  vaultId: string;
  liquidator: string;
  collateralLiquidated: number;
  debtRepaid: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface KeeperStats {
  totalLiquidations: number;
  totalCollateralLiquidated: number;
  averageGasUsed: number;
  successRate: number;
  activeKeepers: number;
}

export interface ProtocolStats {
  totalVaults: number;
  totalCollateral: number;
  totalDebt: number;
  collateralizationRatio: number;
  stabilityFee: number;
  liquidationThreshold: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  network: string;
  provider: string | null;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'mint' | 'repay' | 'liquidate';
  amount: number;
  asset: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  timestamp: Date;
  gasUsed?: number;
}