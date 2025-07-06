import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  ChevronRight,
  Coins,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { Vault } from '../types';
import { useWallet } from '../hooks/useWallet';

interface VaultCardProps {
  vault: Vault;
  oraclePrice: number;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault, oraclePrice }) => {
  const [isManaging, setIsManaging] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { walletState, sendTransaction } = useWallet();

  const isOwner = walletState.isConnected && walletState.address === vault.owner;

  const getHealthColor = (ratio: number) => {
    if (ratio < 150) return 'text-red-400';
    if (ratio < 200) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getHealthBg = (ratio: number) => {
    if (ratio < 150) return 'bg-red-900/20 border-red-600/30';
    if (ratio < 200) return 'bg-yellow-800/10 border-yellow-500/20';
    return 'bg-blue-800/20 border-blue-500/20';
  };

  const handleManage = async () => {
    if (!walletState.isConnected) return;

    setIsManaging(true);
    try {
      await sendTransaction('deposit', 100, 'MAS');
    } catch (error) {
      console.error('Failed to manage vault:', error);
    } finally {
      setIsManaging(false);
    }
  };

  const handleRepay = async () => {
    if (!walletState.isConnected) return;

    setIsManaging(true);
    try {
      await sendTransaction('repay', vault.debtAmount * 0.1, 'zMASD');
    } catch (error) {
      console.error('Failed to repay debt:', error);
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all backdrop-blur-md ${getHealthBg(vault.collateralRatio)}`}>
      {/* Header */}
      <div className="p-4 border-b border-blue-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Vault #{vault.id.split('-')[1]}</span>
              {isOwner && (
                <div className="text-xs bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-100 px-2 py-0.5 rounded-full mt-1 inline-block border border-indigo-400/20">
                  Your Vault
                </div>
              )}
            </div>
          </div>

          {vault.isLiquidatable && (
            <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs font-medium text-red-400">At Risk</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <InfoCard
            icon={Coins}
            label="Collateral"
            value={`${vault.collateralAmount.toFixed(2)} MAS`}
            sub={`≈ $${(vault.collateralAmount * oraclePrice).toFixed(0)}`}
            iconColor="text-yellow-300"
          />
          <InfoCard
            icon={DollarSign}
            label="Debt"
            value={`${vault.debtAmount.toFixed(2)} zMASD`}
            sub={`≈ $${vault.debtAmount.toFixed(0)}`}
            iconColor="text-green-300"
          />
        </div>

        {/* Health Ratio */}
        <div className="bg-blue-900/20 rounded-xl p-3 mb-4 border border-blue-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-blue-300">Health Ratio</span>
            <span className={`text-sm font-bold ${getHealthColor(vault.collateralRatio)}`}>
              {vault.collateralRatio.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-blue-800 h-2 rounded-full mb-2">
            <div
              className={`h-2 rounded-full transition-all ${
                vault.collateralRatio < 150
                  ? 'bg-red-500'
                  : vault.collateralRatio < 200
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(vault.collateralRatio / 3, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-blue-400">
            <span>150%</span>
            <span>Safe Zone</span>
          </div>
        </div>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex justify-between items-center text-blue-300 text-sm mb-4 hover:text-white transition-colors"
        >
          <span>Details</span>
          <ChevronRight
            className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`}
          />
        </button>

        {showDetails && (
          <div className="space-y-2 mb-4 text-sm bg-blue-900/20 rounded-xl p-3 border border-blue-700/30">
            <DetailItem label="Liquidation Price" value={`$${vault.liquidationPrice.toFixed(2)}`} />
            <DetailItem label="Value at Risk" value={`$${(vault.collateralAmount * oraclePrice * 0.13).toFixed(2)}`} />
            <DetailItem label="Interest Rate" value="2.5% APR" />
            <DetailItem label="Created" value={vault.createdAt.toLocaleDateString()} />
          </div>
        )}

        {/* Wallet Interaction */}
        {!walletState.isConnected ? (
          <div className="text-center text-blue-300 text-sm py-3 bg-blue-900/20 rounded-xl border border-blue-700/30">
            Connect wallet to interact
          </div>
        ) : isOwner ? (
          <div className="grid grid-cols-2 gap-3">
            <ActionButton
              onClick={handleManage}
              label="Manage"
              loading={isManaging}
              gradientFrom="from-indigo-600"
              gradientTo="to-indigo-500"
            />
            <ActionButton
              onClick={handleRepay}
              label="Repay"
              loading={isManaging}
              gradientFrom="from-yellow-400"
              gradientTo="to-amber-300"
              textColor="text-amber-900"
            />
          </div>
        ) : (
          <div className="text-center text-blue-300 text-sm py-3 bg-blue-900/20 rounded-xl border border-blue-700/30">
            Not your vault
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponents remain the same

const InfoCard = ({
  icon: Icon,
  label,
  value,
  sub,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  iconColor: string;
}) => (
  <div className="bg-blue-900/20 rounded-xl p-3 border border-blue-700/30">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span className="text-xs text-blue-300">{label}</span>
    </div>
    <div className="text-sm font-bold text-white">{value}</div>
    <div className="text-xs text-blue-400">{sub}</div>
  </div>
);

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-blue-300">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

const ActionButton = ({
  onClick,
  label,
  loading,
  gradientFrom,
  gradientTo,
  textColor = 'text-white',
}: {
  onClick: () => void;
  label: string;
  loading: boolean;
  gradientFrom: string;
  gradientTo: string;
  textColor?: string;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`${gradientFrom} ${gradientTo} hover:brightness-110 active:scale-95 disabled:opacity-50 ${textColor} py-3 px-4 rounded-xl text-sm font-bold flex justify-center items-center gap-2 shadow`}
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    <span>{label}</span>
  </button>
);
