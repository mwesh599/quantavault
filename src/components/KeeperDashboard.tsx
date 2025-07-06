import React from 'react';
import { Bot, Zap, TrendingUp, Users, Activity, Shield } from 'lucide-react';
import { KeeperStats } from '../types';

interface KeeperDashboardProps {
  stats: KeeperStats;
}

export const KeeperDashboard: React.FC<KeeperDashboardProps> = ({ stats }) => {
  const statsData = [
    {
      icon: Zap,
      label: 'Liquidations',
      value: stats.totalLiquidations.toString(),
      color: 'text-yellow-400',
      bgColor: 'bg-gradient-to-br from-[#1a1f38] via-[#1e2542] to-[#1c2238]',
      borderColor: 'border-blue-700/40',
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      color: 'text-green-400',
      bgColor: 'bg-gradient-to-br from-[#1a1f38] via-[#1e2542] to-[#1c2238]',
      borderColor: 'border-blue-700/40',
    },
    {
      icon: Users,
      label: 'Active Keepers',
      value: stats.activeKeepers.toString(),
      color: 'text-blue-400',
      bgColor: 'bg-gradient-to-br from-[#1a1f38] via-[#1e2542] to-[#1c2238]',
      borderColor: 'border-blue-700/40',
    },
    {
      icon: Activity,
      label: 'Avg Gas',
      value: `${(stats.averageGasUsed / 1000).toFixed(0)}K`,
      color: 'text-purple-400',
      bgColor: 'bg-gradient-to-br from-[#1a1f38] via-[#1e2542] to-[#1c2238]',
      borderColor: 'border-blue-700/40',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] border border-indigo-800/40 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-indigo-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Keeper Network</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-indigo-300 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {statsData.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-4`}>
              <div className="flex items-center space-x-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-indigo-300 font-medium">{stat.label}</span>
              </div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Health Indicator */}
        <div className="bg-[#1a1a2e]/70 rounded-2xl p-4 border border-indigo-700/30 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-bold text-white">Network Health</span>
            </div>
            <span className="text-green-400 font-bold text-sm">Excellent</span>
          </div>
          <div className="w-full bg-indigo-900/40 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all" 
              style={{ width: `${stats.successRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-indigo-300 mt-2">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
