import React from 'react';
import { ExternalLink, Edit, Trash2, Power, Globe, Calendar } from 'lucide-react';
import { LoginSite } from '../types';

interface SiteCardProps {
  site: LoginSite;
  onEdit: (site: LoginSite) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onOpen: (site: LoginSite) => void;
}

export function SiteCard({ site, onEdit, onDelete, onToggle, onOpen }: SiteCardProps) {
  const formatDate = (date?: Date) => {
    if (!date) return 'Nunca usado';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      site.enabled ? 'border-green-200 hover:border-green-300' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{site.favicon || '🌐'}</div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{site.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Globe className="h-3 w-3" />
                <span className="truncate max-w-xs">{new URL(site.url).hostname}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onToggle(site.id)}
              className={`p-2 rounded-lg transition-colors ${
                site.enabled 
                  ? 'text-green-600 hover:bg-green-50' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
              title={site.enabled ? 'Desativar' : 'Ativar'}
            >
              <Power className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(site)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(site.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Usuário:</span>
            <span className="font-mono text-gray-700 truncate max-w-xs">{site.username}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Tipo:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              site.loginType === 'single' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {site.loginType === 'single' ? 'Página única' : 'Multi-página'}
            </span>
          </div>
          {site.lastUsed && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Último uso:</span>
              </span>
              <span className="text-gray-700">{formatDate(site.lastUsed)}</span>
            </div>
          )}
        </div>

        {site.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">{site.notes}</p>
          </div>
        )}

        <button
          onClick={() => onOpen(site)}
          disabled={!site.enabled}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            site.enabled
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ExternalLink className="h-4 w-4" />
          <span>Fazer Login</span>
        </button>
      </div>
    </div>
  );
}