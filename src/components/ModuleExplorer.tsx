import React from 'react';
import { Folder, File, Plus, RefreshCw } from 'lucide-react';
import { GlowingText } from './ui/GlowingText';
import Editor from '@monaco-editor/react';

interface ModuleExplorerProps {
  nexus: any;
}

export default function ModuleExplorer({ nexus }: ModuleExplorerProps) {
  const [modules, setModules] = React.useState<string[]>([]);
  const [selectedModule, setSelectedModule] = React.useState<string | null>(null);
  const [moduleContent, setModuleContent] = React.useState<string>('');

  const refreshModules = async () => {
    const moduleList = await nexus.listModules();
    setModules(moduleList);
  };

  React.useEffect(() => {
    refreshModules();
  }, []);

  const handleModuleSelect = async (moduleName: string) => {
    setSelectedModule(moduleName);
    const content = await nexus.readModuleContent(moduleName);
    setModuleContent(content);
  };

  const handleSave = async () => {
    if (selectedModule) {
      await nexus.writeModuleContent(selectedModule, moduleContent);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <GlowingText className="text-lg">Module Explorer</GlowingText>
        <div className="flex gap-2">
          <button
            onClick={refreshModules}
            className="p-2 rounded hover:bg-purple-500/20"
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
          </button>
          <button
            onClick={() => nexus.createNewModule()}
            className="p-2 rounded hover:bg-purple-500/20"
          >
            <Plus className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-2">
          {modules.map((module) => (
            <div
              key={module}
              onClick={() => handleModuleSelect(module)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-purple-500/20 ${
                selectedModule === module ? 'bg-purple-500/20' : ''
              }`}
            >
              <File className="w-4 h-4 text-purple-400" />
              <span className="text-gray-200">{module}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedModule && (
        <div className="flex-1 border-t border-purple-500/20">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            theme="vs-dark"
            value={moduleContent}
            onChange={(value) => setModuleContent(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
          <div className="p-2 border-t border-purple-500/20">
            <button
              onClick={handleSave}
              className="w-full p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}