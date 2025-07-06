import { useState, useEffect } from 'react';
import { Vault, OraclePrice, LiquidationEvent, KeeperStats, ProtocolStats } from '../types';

// Enhanced mock data generation with more realistic values
const generateMockVaults = (): Vault[] => {
  const vaults: Vault[] = [];
  const addresses = [
    '0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2', '0xm3n4o5p6', 
    '0xq7r8s9t0', '0xu1v2w3x4', '0xy5z6a7b8', '0xc9d0e1f2'
  ];
  
  for (let i = 0; i < 15; i++) {
    const collateralAmount = Math.random() * 2000 + 500; // 500-2500 MAS
    const debtAmount = Math.random() * 800 + 200; // 200-1000 zMASD
    const collateralRatio = (collateralAmount * 45.23) / debtAmount; // Using current MAS price
    const liquidationPrice = (debtAmount * 1.5) / collateralAmount;
    
    vaults.push({
      id: `vault-${String(i + 1).padStart(3, '0')}`,
      owner: addresses[Math.floor(Math.random() * addresses.length)],
      collateralAmount,
      debtAmount,
      collateralRatio,
      liquidationPrice,
      isLiquidatable: collateralRatio < 150,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 60), // Last 60 days
      lastUpdated: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
    });
  }
  return vaults.sort((a, b) => b.collateralAmount - a.collateralAmount);
};

// Generate realistic liquidation events
const generateLiquidationEvents = (): LiquidationEvent[] => {
  const events: LiquidationEvent[] = [];
  const statuses: Array<'pending' | 'completed' | 'failed'> = ['pending', 'completed', 'completed', 'completed', 'failed'];
  
  for (let i = 0; i < 8; i++) {
    const collateralLiquidated = Math.random() * 200 + 50;
    const debtRepaid = collateralLiquidated * 0.6; // Typical liquidation ratio
    
    events.push({
      id: `liquidation-${String(i + 1).padStart(3, '0')}`,
      vaultId: `vault-${String(Math.floor(Math.random() * 15) + 1).padStart(3, '0')}`,
      liquidator: `0x${Math.random().toString(16).substr(2, 8)}`,
      collateralLiquidated,
      debtRepaid,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 2), // Last 2 days
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const useProtocolData = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [oraclePrice, setOraclePrice] = useState<OraclePrice>({
    pair: 'MAS/USD',
    price: 45.23,
    timestamp: new Date(),
    confidence: 0.995,
  });
  const [liquidationEvents, setLiquidationEvents] = useState<LiquidationEvent[]>([]);
  const [keeperStats, setKeeperStats] = useState<KeeperStats>({
    totalLiquidations: 1247,
    totalCollateralLiquidated: 89420.5,
    averageGasUsed: 145000,
    successRate: 98.7,
    activeKeepers: 34,
  });
  const [protocolStats, setProtocolStats] = useState<ProtocolStats>({
    totalVaults: 0,
    totalCollateral: 0,
    totalDebt: 0,
    collateralizationRatio: 0,
    stabilityFee: 2.5,
    liquidationThreshold: 150,
  });

  // Initialize data
  useEffect(() => {
    const mockVaults = generateMockVaults();
    const mockEvents = generateLiquidationEvents();
    
    setVaults(mockVaults);
    setLiquidationEvents(mockEvents);

    // Calculate realistic protocol stats
    const totalCollateral = mockVaults.reduce((sum, vault) => sum + vault.collateralAmount, 0);
    const totalDebt = mockVaults.reduce((sum, vault) => sum + vault.debtAmount, 0);
    const collateralizationRatio = (totalCollateral * oraclePrice.price) / totalDebt;

    setProtocolStats({
      totalVaults: mockVaults.length,
      totalCollateral,
      totalDebt,
      collateralizationRatio,
      stabilityFee: 2.5,
      liquidationThreshold: 150,
    });
  }, [oraclePrice.price]);

  // Simulate realistic price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOraclePrice(prev => {
        const change = (Math.random() - 0.5) * 0.8; // ±0.4 max change
        const newPrice = Math.max(40, Math.min(50, prev.price + change)); // Keep between $40-50
        
        return {
          ...prev,
          price: newPrice,
          timestamp: new Date(),
          confidence: 0.99 + Math.random() * 0.009, // 99-99.9% confidence
        };
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate new liquidation events
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        const newEvent: LiquidationEvent = {
          id: `liquidation-${Date.now()}`,
          vaultId: `vault-${String(Math.floor(Math.random() * 15) + 1).padStart(3, '0')}`,
          liquidator: `0x${Math.random().toString(16).substr(2, 8)}`,
          collateralLiquidated: Math.random() * 150 + 25,
          debtRepaid: Math.random() * 400 + 100,
          timestamp: new Date(),
          status: 'pending',
        };
        
        setLiquidationEvents(prev => [newEvent, ...prev.slice(0, 7)]);
        
        // Update to completed after 3 seconds
        setTimeout(() => {
          setLiquidationEvents(prev => 
            prev.map(event => 
              event.id === newEvent.id 
                ? { ...event, status: Math.random() > 0.1 ? 'completed' : 'failed' as const }
                : event
            )
          );
        }, 3000);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Update keeper stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setKeeperStats(prev => ({
        ...prev,
        totalLiquidations: prev.totalLiquidations + Math.floor(Math.random() * 3),
        totalCollateralLiquidated: prev.totalCollateralLiquidated + Math.random() * 100,
        successRate: Math.max(95, Math.min(99.9, prev.successRate + (Math.random() - 0.5) * 0.2)),
        activeKeepers: Math.max(20, Math.min(50, prev.activeKeepers + Math.floor((Math.random() - 0.5) * 4))),
      }));
    }, 20000); // Update every 20 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    vaults,
    oraclePrice,
    liquidationEvents,
    keeperStats,
    protocolStats,
  };
};