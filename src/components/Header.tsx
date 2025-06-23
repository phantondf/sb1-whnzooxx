import React from 'react';
import { Shield, Settings, Download, Upload } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onExportClick: () => void;
  onImportClick: () => void;
}

export function Header({ onSettingsClick, onExportClick, onImportClick }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AutoLogin Manager</h1>
              <p className="text-sm text-gray-500">Gerenciador de Login Automático</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onImportClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Importar configurações"
            >
              <Upload className="h-5 w-5" />
            </button>
            <button
              onClick={onExportClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Exportar script Tampermonkey"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Configurações"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}