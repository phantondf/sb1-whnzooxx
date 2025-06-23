import React, { useState, useEffect } from 'react';
import { Target, Eye, EyeOff, Copy, Check } from 'lucide-react';

interface FieldDetectorProps {
  onFieldDetected: (selector: string, fieldType: 'username' | 'password' | 'submit') => void;
  targetUrl: string;
}

export function FieldDetector({ onFieldDetected, targetUrl }: FieldDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedFields, setDetectedFields] = useState<{
    username?: string;
    password?: string;
    submit?: string;
  }>({});
  const [currentFieldType, setCurrentFieldType] = useState<'username' | 'password' | 'submit'>('username');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const startDetection = (fieldType: 'username' | 'password' | 'submit') => {
    setCurrentFieldType(fieldType);
    setIsDetecting(true);
    
    // Abrir a página em uma nova aba com script de detecção
    const detectionScript = `
      (function() {
        let overlay = document.createElement('div');
        overlay.id = 'field-detector-overlay';
        overlay.style.cssText = \`
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999999;
          cursor: crosshair;
        \`;
        
        let tooltip = document.createElement('div');
        tooltip.style.cssText = \`
          position: fixed;
          background: #1f2937;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          pointer-events: none;
          z-index: 1000000;
          display: none;
        \`;
        tooltip.textContent = 'Clique no campo ${fieldType === 'username' ? 'de usuário/email' : fieldType === 'password' ? 'de senha' : 'de submit/login'}';
        
        document.body.appendChild(overlay);
        document.body.appendChild(tooltip);
        
        let highlightedElement = null;
        
        function highlightElement(element) {
          if (highlightedElement) {
            highlightedElement.style.outline = '';
          }
          element.style.outline = '3px solid #3b82f6';
          highlightedElement = element;
        }
        
        function removeHighlight() {
          if (highlightedElement) {
            highlightedElement.style.outline = '';
            highlightedElement = null;
          }
        }
        
        function getSelector(element) {
          if (element.id) {
            return '#' + element.id;
          }
          
          if (element.name) {
            return \`[name="\${element.name}"]\`;
          }
          
          if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim());
            if (classes.length > 0) {
              return '.' + classes.join('.');
            }
          }
          
          let selector = element.tagName.toLowerCase();
          if (element.type) {
            selector += \`[type="\${element.type}"]\`;
          }
          
          return selector;
        }
        
        overlay.addEventListener('mousemove', (e) => {
          tooltip.style.display = 'block';
          tooltip.style.left = (e.clientX + 10) + 'px';
          tooltip.style.top = (e.clientY - 30) + 'px';
          
          let elementBelow = document.elementFromPoint(e.clientX, e.clientY);
          if (elementBelow && elementBelow !== overlay) {
            if (elementBelow.tagName === 'INPUT' || elementBelow.tagName === 'BUTTON') {
              highlightElement(elementBelow);
            } else {
              removeHighlight();
            }
          }
        });
        
        overlay.addEventListener('click', (e) => {
          let elementBelow = document.elementFromPoint(e.clientX, e.clientY);
          if (elementBelow && elementBelow !== overlay) {
            let selector = getSelector(elementBelow);
            
            // Enviar resultado de volta
            window.postMessage({
              type: 'FIELD_DETECTED',
              fieldType: '${fieldType}',
              selector: selector,
              element: {
                tagName: elementBelow.tagName,
                type: elementBelow.type,
                id: elementBelow.id,
                name: elementBelow.name,
                className: elementBelow.className
              }
            }, '*');
            
            // Limpar
            document.body.removeChild(overlay);
            document.body.removeChild(tooltip);
            removeHighlight();
          }
        });
        
        // ESC para cancelar
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.body.removeChild(tooltip);
            removeHighlight();
          }
        });
      })();
    `;
    
    const newWindow = window.open(targetUrl, '_blank');
    
    if (newWindow) {
      // Aguardar a página carregar e injetar o script
      const checkLoaded = setInterval(() => {
        try {
          if (newWindow.document.readyState === 'complete') {
            clearInterval(checkLoaded);
            
            // Injetar script de detecção
            const script = newWindow.document.createElement('script');
            script.textContent = detectionScript;
            newWindow.document.head.appendChild(script);
            
            // Escutar mensagens da janela
            const messageListener = (event: MessageEvent) => {
              if (event.data.type === 'FIELD_DETECTED') {
                const { fieldType, selector } = event.data;
                setDetectedFields(prev => ({ ...prev, [fieldType]: selector }));
                onFieldDetected(selector, fieldType);
                setIsDetecting(false);
                newWindow.close();
                window.removeEventListener('message', messageListener);
              }
            };
            
            window.addEventListener('message', messageListener);
          }
        } catch (e) {
          // Ignorar erros de cross-origin
        }
      }, 500);
      
      // Timeout de 30 segundos
      setTimeout(() => {
        clearInterval(checkLoaded);
        setIsDetecting(false);
      }, 30000);
    }
  };

  const copyToClipboard = async (text: string, fieldType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldType);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Target className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-blue-900">Detector Automático de Campos</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-4">
        Clique nos botões abaixo para detectar automaticamente os seletores dos campos na página do site.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => startDetection('username')}
          disabled={isDetecting || !targetUrl}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isDetecting && currentFieldType === 'username' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Detectando...</span>
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              <span>Campo Usuário</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => startDetection('password')}
          disabled={isDetecting || !targetUrl}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isDetecting && currentFieldType === 'password' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Detectando...</span>
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              <span>Campo Senha</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => startDetection('submit')}
          disabled={isDetecting || !targetUrl}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isDetecting && currentFieldType === 'submit' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Detectando...</span>
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              <span>Botão Submit</span>
            </>
          )}
        </button>
      </div>
      
      {Object.keys(detectedFields).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Campos Detectados:</h4>
          {Object.entries(detectedFields).map(([fieldType, selector]) => (
            <div key={fieldType} className="flex items-center justify-between bg-white rounded p-2 text-sm">
              <div>
                <span className="font-medium capitalize">{fieldType}:</span>
                <code className="ml-2 text-blue-600 bg-blue-50 px-1 rounded">{selector}</code>
              </div>
              <button
                onClick={() => copyToClipboard(selector, fieldType)}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title="Copiar seletor"
              >
                {copiedField === fieldType ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 text-xs text-blue-600">
        💡 Dica: Abra a página do site primeiro, depois clique nos botões para detectar os campos automaticamente.
      </div>
    </div>
  );
}