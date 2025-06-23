import React, { useState } from 'react';
import { Plus, Download, Upload, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { SiteCard } from './components/SiteCard';
import { SiteForm } from './components/SiteForm';
import { SecurityWarning } from './components/SecurityWarning';
import { FloatingMenu } from './components/FloatingMenu';
import { useLoginSites } from './hooks/useLoginSites';
import { useLocalStorage } from './hooks/useLocalStorage';
import { exportScript, exportConfig } from './utils/tampermonkey';
import { LoginSite, AutoLoginSettings } from './types';

function App() {
  const [showSecurityWarning, setShowSecurityWarning] = useLocalStorage('security-accepted', true);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    sites,
    selectedSite,
    setSelectedSite,
    addSite,
    updateSite,
    deleteSite,
    toggleSite,
    openSite
  } = useLoginSites();

  const [settings] = useLocalStorage<AutoLoginSettings>('autologin-settings', {
    enableFloatingButton: true,
    floatingButtonPosition: 'bottom-left',
    keyboardShortcut: 'Ctrl+Q',
    autoCloseMenu: true,
    showNotifications: true,
    delayBetweenFields: 100
  });

  const handleAddSite = () => {
    setSelectedSite(null);
    setShowSiteForm(true);
  };

  const handleEditSite = (site: LoginSite) => {
    setSelectedSite(site);
    setShowSiteForm(true);
  };

  const handleSaveSite = (siteData: Omit<LoginSite, 'id'>) => {
    if (selectedSite) {
      updateSite(selectedSite.id, siteData);
    } else {
      addSite(siteData);
    }
    setShowSiteForm(false);
    setSelectedSite(null);
  };

  const handleExport = () => {
    const choice = window.confirm(
      "Exportar como:\n\nOK = Script Tampermonkey (.js)\nCancelar = Configuração JSON (.json)"
    );
    
    if (choice) {
      exportScript(sites);
    } else {
      exportConfig(sites);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const config = JSON.parse(e.target.result);
            if (config.sites && Array.isArray(config.sites)) {
              // Implementar importação
              window.alert('Funcionalidade de importação será implementada em breve!');
            }
          } catch (error) {
            window.alert('Erro ao importar arquivo: formato inválido');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (showSecurityWarning) {
    return <SecurityWarning onAccept={() => setShowSecurityWarning(false)} />;
  }

  const activeSites = sites.filter(site => site.enabled);
  const inactiveSites = sites.filter(site => !site.enabled);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header
        onSettingsClick={() => setShowSettings(true)}
        onExportClick={handleExport}
        onImportClick={handleImport}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sites Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeSites.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Sites</p>
                <p className="text-2xl font-bold text-blue-600">{sites.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sites Inativos</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveSites.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meus Sites</h2>
            <p className="text-gray-600">Gerencie seus logins automáticos</p>
          </div>
          <button
            onClick={handleAddSite}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Adicionar Site</span>
          </button>
        </div>

        {/* Sites Grid */}
        {sites.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum site configurado</h3>
            <p className="text-gray-500 mb-6">Adicione seu primeiro site para começar a usar o AutoLogin</p>
            <button
              onClick={handleAddSite}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Adicionar Primeiro Site
            </button>
          </div>
        ) : (
          <>
            {activeSites.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sites Ativos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSites.map((site) => (
                    <SiteCard
                      key={site.id}
                      site={site}
                      onEdit={handleEditSite}
                      onDelete={deleteSite}
                      onToggle={toggleSite}
                      onOpen={openSite}
                    />
                  ))}
                </div>
              </div>
            )}

            {inactiveSites.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sites Inativos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inactiveSites.map((site) => (
                    <SiteCard
                      key={site.id}
                      site={site}
                      onEdit={handleEditSite}
                      onDelete={deleteSite}
                      onToggle={toggleSite}
                      onOpen={openSite}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Menu */}
      {settings.enableFloatingButton && (
        <FloatingMenu
          sites={sites}
          onOpenSite={openSite}
          position={settings.floatingButtonPosition}
        />
      )}

      {/* Modals */}
      {showSiteForm && (
        <SiteForm
          site={selectedSite}
          onSave={handleSaveSite}
          onCancel={() => {
            setShowSiteForm(false);
            setSelectedSite(null);
          }}
        />
      )}
    </div>
  );
}

export default App;