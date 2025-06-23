import React, { useState } from 'react';
import { Key, X } from 'lucide-react';
import { LoginSite } from '../types';

interface FloatingMenuProps {
  sites: LoginSite[];
  onOpenSite: (site: LoginSite) => void;
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export function FloatingMenu({ sites, onOpenSite, position }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeSites = sites.filter(site => site.enabled);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
    }
  };

  const getMenuClasses = () => {
    const base = 'absolute mb-2 min-w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden';
    switch (position) {
      case 'bottom-left':
      case 'bottom-right':
        return `${base} bottom-full`;
      case 'top-left':
      case 'top-right':
        return `${base} top-full mt-2`;
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {isOpen && (
        <div className={getMenuClasses()}>
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">🔐 AutoLogin</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {activeSites.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">
                Nenhum site ativo
              </div>
            ) : (
              activeSites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => {
                    onOpenSite(site);
                    setIsOpen(false);
                  }}
                  className="w-full p-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{site.favicon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{site.name}</div>
                      <div className="text-xs text-gray-500">{site.username}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Menu AutoLogin (Ctrl+Q)"
      >
        <Key className="h-5 w-5" />
      </button>
    </div>
  );
}