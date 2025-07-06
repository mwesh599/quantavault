import React from 'react';
import { TrendingUp, Shield, DollarSign, Activity, Coins } from 'lucide-react';
import { ProtocolStats as ProtocolStatsType } from '../types';

interface ProtocolStatsProps {
  stats: ProtocolStatsType;
  oraclePrice: number;
}

export const ProtocolStats: React.FC<ProtocolStatsProps> = ({ stats, oraclePrice }) => {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const statsData = [
    {
      icon: Shield,
      label: 'Total Vaults',
      value: stats.totalVaults.toString(),
      subtext: '+12% from last week',
      color: 'text-cyan-300',
      bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20',
      borderColor: 'border-cyan-600/20',
    },
    {
      icon: Coins,
      label: 'Total Collateral',
      value: `${formatNumber(stats.totalCollateral)} MAS`,
      subtext: `≈ $${formatNumber(stats.totalCollateral * oraclePrice)}`,
      color: 'text-yellow-300',
      bgColor: 'bg-gradient-to-br from-yellow-800/30 to-yellow-600/20',
      borderColor: 'border-yellow-500/20',
    },
    {
      icon: DollarSign,
      label: 'Total Debt',
      value: `${formatNumber(stats.totalDebt)} zMASD`,
      subtext: `Stability Fee: ${stats.stabilityFee}%`,
      color: 'text-green-300',
      bgColor: 'bg-gradient-to-br from-green-800/30 to-green-600/20',
      borderColor: 'border-green-500/20',
    },
    {
      icon: Activity,
      label: 'Global C-Ratio',
      value: `${stats.collateralizationRatio.toFixed(0)}%`,
      subtext: `Threshold: ${stats.liquidationThreshold}%`,
      color: 'text-orange-300',
      bgColor: 'bg-gradient-to-br from-orange-800/30 to-red-600/20',
      borderColor: 'border-orange-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`rounded-2xl p-4 border ${stat.borderColor} ${stat.bgColor} backdrop-blur-md shadow-sm`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs">$</span>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
          <div className="text-xs text-slate-300">{stat.label}</div>
          <div className="text-xs text-slate-400">{stat.subtext}</div>
        </div>
      ))}
    </div>
  );
};
