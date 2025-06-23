import { LoginSite } from '../types';

export function generateTampermonkeyScript(sites: LoginSite[]): string {
  const enabledSites = sites.filter(site => site.enabled);
  
  // Create an array of arrays instead of an array of strings
  const sitesArray = enabledSites.map(site => [
    site.name,
    site.url,
    site.username,
    site.password,
    site.loginType,
    site.userSelector || '',
    site.passwordSelector || '',
    site.submitSelector || ''
  ]);

  // Use JSON.stringify to properly embed the array of arrays
  const sitesArrayString = JSON.stringify(sitesArray, null, 8);

  return `// ==UserScript==
// @name         AutoLogin Manager (Gerado automaticamente)
// @namespace    http://autologin.manager/
// @version      3.0
// @description  Script gerado pelo AutoLogin Manager - Login automático otimizado
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const rawSites = ${sitesArrayString};
    const sites = Array.isArray(rawSites) ? rawSites : [];

    function waitForBody(callback) {
        if (document.body) callback();
        else new MutationObserver((_, obs) => {
            if (document.body) {
                obs.disconnect();
                callback();
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    waitForBody(() => {
        // Criar GUI flutuante
        const gui = document.createElement("div");
        gui.id = "autologin-gui";
        Object.assign(gui.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            zIndex: "99999",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            display: "none",
            minWidth: "250px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        });

        const title = document.createElement("div");
        title.innerHTML = "🔐 <strong>AutoLogin Manager</strong>";
        Object.assign(title.style, {
            fontSize: "14px",
            marginBottom: "12px",
            color: "#374151",
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: "8px"
        });
        gui.appendChild(title);

        sites.forEach(([nome, url, user, pass, loginType, userSel, passSel, submitSel]) => {
            const btn = document.createElement("button");
            btn.innerHTML = \`<span style="margin-right: 8px;">🌐</span>\${nome}\`;
            Object.assign(btn.style, {
                display: "block",
                margin: "6px 0",
                width: "100%",
                padding: "10px 12px",
                cursor: "pointer",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#374151",
                transition: "all 0.2s ease"
            });
            
            btn.onmouseover = () => {
                btn.style.background = "#3b82f6";
                btn.style.color = "white";
                btn.style.transform = "translateY(-1px)";
            };
            btn.onmouseout = () => {
                btn.style.background = "#f9fafb";
                btn.style.color = "#374151";
                btn.style.transform = "translateY(0)";
            };

            btn.onclick = () => {
                const targetUrl = \`\${url}#autologin_user=\${encodeURIComponent(user)}&autologin_pass=\${encodeURIComponent(pass)}&autologin_type=\${loginType}&autologin_usersel=\${encodeURIComponent(userSel)}&autologin_passsel=\${encodeURIComponent(passSel)}&autologin_submitsel=\${encodeURIComponent(submitSel)}\`;
                window.open(targetUrl, "_blank");
                gui.style.display = "none";
            };
            gui.appendChild(btn);
        });

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Fechar";
        Object.assign(closeBtn.style, {
            marginTop: "8px",
            width: "100%",
            padding: "8px",
            cursor: "pointer",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#6b7280"
        });
        closeBtn.onclick = () => gui.style.display = "none";
        gui.appendChild(closeBtn);

        document.body.appendChild(gui);

        // Botão flutuante
        const floatBtn = document.createElement("button");
        floatBtn.innerHTML = "🔑";
        floatBtn.title = "AutoLogin Menu (Ctrl+Q)";
        Object.assign(floatBtn.style, {
            position: "fixed",
            bottom: "20px",
            left: "20px",
            zIndex: "10000",
            fontSize: "20px",
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
            transition: "all 0.3s ease"
        });

        floatBtn.onmouseover = () => {
            floatBtn.style.transform = "scale(1.1)";
            floatBtn.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.6)";
        };
        floatBtn.onmouseout = () => {
            floatBtn.style.transform = "scale(1)";
            floatBtn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
        };

        floatBtn.onclick = () => {
            gui.style.display = gui.style.display === "none" ? "block" : "none";
        };
        document.body.appendChild(floatBtn);

        // Atalho de teclado
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "q") {
                e.preventDefault();
                gui.style.display = gui.style.display === "none" ? "block" : "none";
            }
        });

        // Processamento de login automático
        const hash = location.hash;
        if (hash.includes("autologin_user")) {
            const params = new URLSearchParams(hash.substring(1));
            const user = decodeURIComponent(params.get("autologin_user") || "");
            const pass = decodeURIComponent(params.get("autologin_pass") || "");
            const loginType = params.get("autologin_type") || "single";
            const userSelector = decodeURIComponent(params.get("autologin_usersel") || "");
            const passSelector = decodeURIComponent(params.get("autologin_passsel") || "");
            const submitSelector = decodeURIComponent(params.get("autologin_submitsel") || "");

            let tentativas = 0;
            const maxTentativas = 20;

            const interval = setInterval(async () => {
                try {
                    // Seletores customizados ou padrão
                    const userSelectors = userSelector ? [userSelector] : [
                        'input[type="text"]',
                        'input[type="email"]', 
                        'input[name*="user"]',
                        'input[name*="login"]',
                        'input[name*="email"]',
                        'input[id*="user"]',
                        'input[id*="login"]',
                        'input[id*="email"]'
                    ];

                    const passSelectors = passSelector ? [passSelector] : [
                        'input[type="password"]',
                        'input[name*="pass"]',
                        'input[id*="pass"]'
                    ];

                    const submitSelectors = submitSelector ? [submitSelector] : [
                        'button[type="submit"]',
                        'input[type="submit"]',
                        'button[class*="login"]',
                        'button[class*="submit"]',
                        'button[id*="login"]',
                        'button[id*="submit"]',
                        'button:contains("Entrar")',
                        'button:contains("Login")',
                        'button:contains("Sign")'
                    ];

                    let inputUser = null;
                    let inputPass = null;
                    let submitBtn = null;

                    // Encontrar campos
                    for (let selector of userSelectors) {
                        inputUser = document.querySelector(selector);
                        if (inputUser) break;
                    }

                    for (let selector of passSelectors) {
                        inputPass = document.querySelector(selector);
                        if (inputPass) break;
                    }

                    for (let selector of submitSelectors) {
                        submitBtn = document.querySelector(selector);
                        if (submitBtn) break;
                    }

                    if (loginType === "multi-page") {
                        // Login multi-página
                        if (inputUser && !inputPass) {
                            // Primeira página - apenas usuário
                            await fillField(inputUser, user);
                            await new Promise(r => setTimeout(r, 300));
                            
                            if (submitBtn) {
                                submitBtn.click();
                            } else {
                                inputUser.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true }));
                            }
                            
                            console.log("✅ Usuário inserido - aguardando próxima página");
                            clearInterval(interval);
                            
                            // Aguardar próxima página
                            setTimeout(() => {
                                location.hash = hash; // Manter hash para próxima página
                            }, 2000);
                            
                        } else if (inputPass && !inputUser) {
                            // Segunda página - apenas senha
                            await fillField(inputPass, pass);
                            await new Promise(r => setTimeout(r, 300));
                            
                            if (submitBtn) {
                                submitBtn.click();
                            } else {
                                inputPass.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true }));
                            }
                            
                            console.log("✅ Senha inserida e login enviado");
                            clearInterval(interval);
                        }
                    } else {
                        // Login página única
                        if (inputUser && inputPass) {
                            await fillField(inputUser, user);
                            await new Promise(r => setTimeout(r, 200));
                            await fillField(inputPass, pass);
                            await new Promise(r => setTimeout(r, 300));

                            // Tentar submeter
                            if (submitBtn) {
                                submitBtn.click();
                            } else {
                                inputPass.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true }));
                            }

                            console.log("✅ Login automático concluído");
                            clearInterval(interval);
                        }
                    }

                    async function fillField(field, value) {
                        field.focus();
                        field.value = "";
                        
                        // Simular digitação
                        for (let char of value) {
                            field.value += char;
                            field.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
                            field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true }));
                            await new Promise(r => setTimeout(r, 30));
                        }
                        
                        // Eventos adicionais para compatibilidade
                        field.dispatchEvent(new Event('change', { bubbles: true }));
                        field.dispatchEvent(new Event('blur', { bubbles: true }));
                    }

                } catch (error) {
                    console.error("Erro no preenchimento automático:", error);
                }

                if (++tentativas > maxTentativas) {
                    console.log("❌ Timeout: Campos de login não encontrados após " + maxTentativas + " tentativas");
                    clearInterval(interval);
                }
            }, 800);
        }
    });
})();`;
}

export function exportScript(sites: LoginSite[]) {
  const script = generateTampermonkeyScript(sites);
  const blob = new Blob([script], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'autologin-manager.user.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportConfig(sites: LoginSite[]) {
  const config = {
    version: '3.0',
    exportDate: new Date().toISOString(),
    sites: sites
  };
  
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'autologin-config.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}