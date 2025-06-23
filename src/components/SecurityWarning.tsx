import React from 'react';
import { AlertTriangle, Shield, Lock, Eye, EyeOff } from 'lucide-react';

interface SecurityWarningProps {
  onAccept: () => void;
}

export function SecurityWarning({ onAccept }: SecurityWarningProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Aviso de Segurança</h2>
              <p className="text-sm text-gray-500">Importante: Leia antes de continuar</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Segurança das Credenciais
              </h3>
              <p className="text-sm text-amber-700">
                Suas credenciais são armazenadas localmente no seu navegador e nunca são enviadas 
                para servidores externos. No entanto, tenha cuidado ao usar este tipo de ferramenta.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Recomendações de Segurança
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use apenas em computadores pessoais e confiáveis</li>
                <li>• Evite usar com contas bancárias ou financeiras críticas</li>
                <li>• Mantenha seu navegador atualizado</li>
                <li>• Use senhas fortes e únicas para cada site</li>
              </ul>
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showDetails ? 'Ocultar' : 'Ver'} detalhes técnicos</span>
            </button>

            {showDetails && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Como Funciona</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Os dados são armazenados no localStorage do navegador</li>
                  <li>• O script Tampermonkey é executado localmente</li>
                  <li>• Não há comunicação com servidores externos</li>
                  <li>• Os dados podem ser exportados/importados manualmente</li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onAccept}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Entendi e Aceito os Riscos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}