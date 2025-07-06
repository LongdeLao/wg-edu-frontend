'use client';

import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

export default function ApiHealthStatus() {
  const [healthData, setHealthData] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const data = await checkHealth();
      setHealthData(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error fetching health data:', error);
      setHealthData({ status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();

    const intervalId = setInterval(() => {
      fetchHealthData();
    }, refreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(Number(e.target.value));
  };

  const handleManualRefresh = () => {
    fetchHealthData();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">API Health Status</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <button 
          onClick={handleManualRefresh} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Now'}
        </button>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="refreshInterval" className="text-sm text-gray-600">
            Refresh every:
          </label>
          <select
            id="refreshInterval"
            value={refreshInterval}
            onChange={handleRefreshIntervalChange}
            className="border rounded p-1 text-sm"
          >
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="30">30s</option>
            <option value="60">1m</option>
            <option value="300">5m</option>
          </select>
        </div>
      </div>

      {lastChecked && (
        <p className="text-xs text-gray-500 mb-4">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : healthData ? (
        <div className="border rounded-md p-4">
          <div className="flex items-center mb-2">
            <div 
              className={`w-3 h-3 rounded-full mr-2 ${
                healthData.status === 'ok' || healthData.status === 'UP' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}
            ></div>
            <span className="font-medium">
              Status: {healthData.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No health data available
        </div>
      )}
    </div>
  );
} 