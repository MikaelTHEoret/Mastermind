import React from 'react';
import { Database, Plus, Settings } from 'lucide-react';
import { HolographicPanel } from './ui/HolographicPanel';
import { GlowingText } from './ui/GlowingText';
import { DatabaseConfig, DatabaseType } from '../types';

interface DatabasePanelProps {
  onConnect: (type: DatabaseType, config: DatabaseConfig) => Promise<boolean>;
  onDisconnect: (type: DatabaseType) => Promise<void>;
}

export default function DatabasePanel({ onConnect, onDisconnect }: DatabasePanelProps) {
  const [configs, setConfigs] = React.useState<Map<DatabaseType, DatabaseConfig>>(new Map());
  const [selectedType, setSelectedType] = React.useState<DatabaseType | null>(null);
  const [configForm, setConfigForm] = React.useState<DatabaseConfig>({
    url: '',
    path: '',
  });

  const handleConnect = async () => {
    if (selectedType) {
      const success = await onConnect(selectedType, configForm);
      if (success) {
        setConfigs(new Map(configs.set(selectedType, configForm)));
      }
    }
  };

  const handleDisconnect = async (type: DatabaseType) => {
    await onDisconnect(type);
    const newConfigs = new Map(configs);
    newConfigs.delete(type);
    setConfigs(newConfigs);
  };

  return (
    <HolographicPanel className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          <GlowingText className="text-lg">Database Configuration</GlowingText>
        </div>
        <button
          onClick={() => setSelectedType(null)}
          className="p-2 rounded hover:bg-purple-500/20"
        >
          <Plus className="w-4 h-4 text-purple-400" />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {Array.from(configs.entries()).map(([type, config]) => (
          <div
            key={type}
            className="p-4 rounded-lg border border-purple-500/20 bg-black/20"
          >
            <div className="flex items-center justify-between">
              <GlowingText className="text-lg capitalize">{type}</GlowingText>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedType(type)}
                  className="p-2 rounded hover:bg-purple-500/20"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                </button>
                <button
                  onClick={() => handleDisconnect(type)}
                  className="p-2 rounded hover:bg-red-500/20"
                >
                  <Database className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {config.url || config.path}
            </div>
          </div>
        ))}

        {selectedType && (
          <div className="p-4 rounded-lg border border-purple-500/20 bg-black/20">
            <GlowingText className="text-lg mb-4">Configure {selectedType}</GlowingText>
            <div className="space-y-4">
              {selectedType !== 'sqlite' && (
                <input
                  type="text"
                  value={configForm.url}
                  onChange={(e) => setConfigForm({ ...configForm, url: e.target.value })}
                  placeholder="Connection URL"
                  className="w-full p-2 bg-black/20 border border-purple-500/20 rounded"
                />
              )}
              {selectedType === 'sqlite' && (
                <input
                  type="text"
                  value={configForm.path}
                  onChange={(e) => setConfigForm({ ...configForm, path: e.target.value })}
                  placeholder="Database Path"
                  className="w-full p-2 bg-black/20 border border-purple-500/20 rounded"
                />
              )}
              <button
                onClick={handleConnect}
                className="w-full p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded"
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </div>
    </HolographicPanel>
  );
}