import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LoginSite } from '../types';

const defaultSites: LoginSite[] = [
  {
    id: '1',
    name: 'Ambito ABRAs',
    url: 'https://codex.ambito.com.br/Login.aspx',
    username: 'Jefferson Correa',
    password: 'Brabb@2022',
    enabled: true,
    loginType: 'single',
    favicon: '🏢'
  },
  {
    id: '2',
    name: 'PMovel',
    url: 'https://app.pmovel.com.br/',
    username: '30688771807',
    password: 'Brabb@2022',
    enabled: true,
    loginType: 'single',
    favicon: '📱'
  },
  {
    id: '3',
    name: 'Anhanguera',
    url: 'https://login.anhanguera.com/',
    username: '30688771807',
    password: 'freakers',
    enabled: true,
    loginType: 'single',
    favicon: '🎓'
  },
  {
    id: '4',
    name: 'Multipex',
    url: 'https://keycloak.api.gmprod.multipex.com.br/auth/realms/epibrasil/protocol/openid-connect/auth?client_id=web-client&redirect_uri=https%3A%2F%2Fepibrasil.vue.multpex.com.br%2F&state=5317a76d-9c56-404b-8245-53cb539ff966&response_mode=fragment&response_type=code&scope=openid&nonce=1be5c11e-10f1-419d-98f3-39cd8b28386e',
    username: '56000953',
    password: 'Brabb@2022',
    enabled: true,
    loginType: 'single',
    favicon: '🔗'
  }
];

export function useLoginSites() {
  const [sites, setSites] = useLocalStorage<LoginSite[]>('autologin-sites', defaultSites);
  const [selectedSite, setSelectedSite] = useState<LoginSite | null>(null);

  const addSite = (site: Omit<LoginSite, 'id'>) => {
    const newSite: LoginSite = {
      ...site,
      id: Date.now().toString(),
    };
    setSites(prev => [...prev, newSite]);
  };

  const updateSite = (id: string, updates: Partial<LoginSite>) => {
    setSites(prev => prev.map(site => 
      site.id === id ? { ...site, ...updates } : site
    ));
  };

  const deleteSite = (id: string) => {
    setSites(prev => prev.filter(site => site.id !== id));
    if (selectedSite?.id === id) {
      setSelectedSite(null);
    }
  };

  const toggleSite = (id: string) => {
    updateSite(id, { enabled: !sites.find(s => s.id === id)?.enabled });
  };

  const openSite = (site: LoginSite) => {
    updateSite(site.id, { lastUsed: new Date() });
    const url = `${site.url}#autologin_user=${encodeURIComponent(site.username)}&autologin_pass=${encodeURIComponent(site.password)}`;
    window.open(url, '_blank');
  };

  return {
    sites,
    selectedSite,
    setSelectedSite,
    addSite,
    updateSite,
    deleteSite,
    toggleSite,
    openSite
  };
}