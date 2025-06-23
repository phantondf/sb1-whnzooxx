import React, { useState, useEffect } from 'react';
import { X, Save, Globe, User, Lock, Settings, FileText, Target } from 'lucide-react';
import { LoginSite } from '../types';
import { FieldDetector } from './FieldDetector';

interface SiteFormProps {
  site?: LoginSite;
  onSave: (site: Omit<LoginSite, 'id'>) => void;
  onCancel: () => void;
}

export function SiteForm({ site, onSave, onCancel }: SiteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    username: '',
    password: '',
    enabled: true,
    loginType: 'single' as const,
    userSelector: '',
    passwordSelector: '',
    submitSelector: '',
    notes: '',
    favicon: '🌐'
  });

  const [showFieldDetector, setShowFieldDetector] = useState(false);

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name,
        url: site.url,
        username: site.username,
        password: site.password,
        enabled: site.enabled,
        loginType: site.loginType,
        userSelector: site.userSelector || '',
        passwordSelector: site.passwordSelector || '',
        submitSelector: site.submitSelector || '',
        notes: site.notes || '',
        favicon: site.favicon || '🌐'
      });
    }
  }, [site]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFieldDetected = (selector: string, fieldType: 'username' | 'password' | 'submit') => {
    setFormData(prev => ({
      ...prev,
      [`${fieldType === 'username' ? 'user' : fieldType}Selector`]: selector
    }));
  };

  const emojis = ['🌐', '🏢', '📱', '🎓', '🔗', '💼', '🏦', '🛒', '📧', '🎮', '📺', '☁️'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {site ? 'Editar Site' : 'Adicionar Novo Site'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4 inline mr-1" />
                Nome do Site
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Gmail, Facebook, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <div className="flex flex-wrap gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, favicon: emoji })}
                    className={`p-2 text-xl rounded-lg border-2 transition-colors ${
                      formData.favicon === emoji
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Site
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://exemplo.com/login"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Usuário/Email
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="h-4 w-4 inline mr-1" />
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Settings className="h-4 w-4 inline mr-1" />
              Tipo de Login
            </label>
            <select
              value={formData.loginType}
              onChange={(e) => setFormData({ ...formData, loginType: e.target.value as 'single' | 'multi-page' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="single">Página única (usuário e senha na mesma página)</option>
              <option value="multi-page">Multi-página (usuário e senha em páginas separadas)</option>
            </select>
          </div>

          {/* Detector Automático de Campos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Seletores de Campos</h3>
              <button
                type="button"
                onClick={() => setShowFieldDetector(!showFieldDetector)}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                <Target className="h-4 w-4" />
                <span>{showFieldDetector ? 'Ocultar' : 'Mostrar'} Detector</span>
              </button>
            </div>

            {showFieldDetector && (
              <div className="mb-4">
                <FieldDetector
                  onFieldDetected={handleFieldDetected}
                  targetUrl={formData.url}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seletor do Campo Usuário
                </label>
                <input
                  type="text"
                  value={formData.userSelector}
                  onChange={(e) => setFormData({ ...formData, userSelector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="input[type='email']"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe vazio para detecção automática
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seletor do Campo Senha
                </label>
                <input
                  type="text"
                  value={formData.passwordSelector}
                  onChange={(e) => setFormData({ ...formData, passwordSelector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="input[type='password']"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe vazio para detecção automática
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seletor do Botão Submit
                </label>
                <input
                  type="text"
                  value={formData.submitSelector}
                  onChange={(e) => setFormData({ ...formData, submitSelector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="button[type='submit']"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe vazio para detecção automática
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Notas (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações sobre este site..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="enabled" className="ml-2 text-sm text-gray-700">
              Site ativo (habilitado para uso)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{site ? 'Atualizar' : 'Adicionar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}