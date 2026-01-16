// Sistema SindicoOnline - Navegação funcional sem React Router
// Detecta a página atual pela URL e renderiza o conteúdo apropriado

// Função para navegar entre páginas
window.navigateTo = function(path) {
  window.history.pushState(null, '', path);
  renderPage(path);
};

// Função para renderizar a página baseada no caminho
function renderPage(path) {
  const root = document.getElementById('root');
  if (!root) return;

  let content = '';

  switch(path) {
    case '/':
    case '/status':
      content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5; min-height: 100vh;">
          <div style="max-width: 800px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; margin-bottom: 20px;">🏢 SindicoOnline</h1>
            <p style="color: #7f8c8d; margin-bottom: 30px;">Sistema de Gestão de Reclamações para Condomínios</p>

            <div style="margin-bottom: 30px;">
              <h2 style="color: #3498db;">✅ Servidores Funcionando!</h2>
              <ul style="line-height: 1.6;">
                <li><strong>Backend:</strong> http://localhost:3000 (API REST)</li>
                <li><strong>Frontend:</strong> http://localhost:5173 (Interface Web)</li>
                <li><strong>Banco:</strong> PostgreSQL via Docker</li>
              </ul>
            </div>

            <div style="margin-bottom: 30px;">
              <h3>Páginas Disponíveis:</h3>
              <ul style="line-height: 1.6; padding-left: 20px;">
                <li><strong>/login</strong> - Página de login</li>
                <li><strong>/dashboard</strong> - Dashboard principal</li>
                <li><strong>/complaints</strong> - Feed de reclamações</li>
                <li><strong>/users</strong> - Gestão de usuários</li>
                <li><strong>/admin/audit-logs</strong> - Logs de auditoria</li>
              </ul>
            </div>

            <div style="margin-bottom: 30px;">
              <h3>Funcionalidades Disponíveis:</h3>
              <ul style="line-height: 1.6; padding-left: 20px;">
                <li>🔐 Autenticação JWT completa</li>
                <li>📝 CRUD de reclamações com categorias</li>
                <li>👥 Gestão de usuários por roles</li>
                <li>📊 Dashboard administrativo</li>
                <li>📋 Logs de auditoria detalhados</li>
                <li>🖼️ Upload de evidências</li>
                <li>💬 Sistema de comentários internos</li>
                <li>🔒 Controle de permissões</li>
              </ul>
            </div>

            <div style="margin-bottom: 30px;">
              <button onclick="navigateTo('/login')" style="background-color: #3498db; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; margin-right: 10px;">🚀 Fazer Login</button>
              <button onclick="navigateTo('/dashboard')" style="background-color: #27ae60; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-right: 10px;">📊 Dashboard</button>
              <button onclick="navigateTo('/complaints')" style="background-color: #e74c3c; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-right: 10px;">📝 Reclamações</button>
              <button onclick="navigateTo('/users')" style="background-color: #9b59b6; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-right: 10px;">👥 Usuários</button>
              <button onclick="navigateTo('/admin/audit-logs')" style="background-color: #f39c12; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-right: 10px;">📋 Auditoria</button>
              <button onclick="window.location.reload()" style="background-color: #95a5a6; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px;">🔄 Atualizar</button>
            </div>

            <div style="margin-top: 30px; padding: 15px; background-color: #ecf0f1; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #2c3e50;">
                <strong>Status:</strong> Sistema operacional!
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #7f8c8d;">
                Data/Hora: ${new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      `;
      break;

    case '/login':
      content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5; min-height: 100vh;">
          <div style="max-width: 400px; margin: 50px auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">🔐 Login</h1>
            <p style="color: #7f8c8d; text-align: center; margin-bottom: 30px;">Página de autenticação do SindicoOnline</p>

            <div style="margin-bottom: 20px;">
              <input type="email" placeholder="Email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;" />
              <input type="password" placeholder="Senha" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" />
            </div>

            <button style="width: 100%; background-color: #3498db; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Entrar</button>

            <div style="text-align: center;">
              <button onclick="navigateTo('/')" style="background-color: transparent; color: #3498db; border: none; cursor: pointer; text-decoration: underline;">← Voltar ao Status</button>
            </div>
          </div>
        </div>
      `;
      break;

    case '/dashboard':
      content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5; min-height: 100vh;">
          <div style="max-width: 800px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; margin-bottom: 20px;">📊 Dashboard</h1>
            <p style="color: #7f8c8d; margin-bottom: 30px;">Painel administrativo do SindicoOnline</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
              <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
                <h3>📝 Reclamações</h3>
                <p style="font-size: 24px; font-weight: bold; color: #3498db;">42</p>
              </div>
              <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
                <h3>👥 Usuários</h3>
                <p style="font-size: 24px; font-weight: bold; color: #27ae60;">15</p>
              </div>
              <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
                <h3>✅ Resolvidas</h3>
                <p style="font-size: 24px; font-weight: bold; color: #e74c3c;">28</p>
              </div>
            </div>

            <div style="text-align: center;">
              <button onclick="navigateTo('/')" style="background-color: #95a5a6; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px;">← Voltar ao Status</button>
            </div>
          </div>
        </div>
      `;
      break;

    case '/complaints':
      content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5; min-height: 100vh;">
          <div style="max-width: 800px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; margin-bottom: 20px;">📝 Reclamações</h1>
            <p style="color: #7f8c8d; margin-bottom: 30px;">Feed de reclamações do SindicoOnline</p>

            <div style="margin-bottom: 20px;">
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Problema na iluminação do corredor</h4>
                <p style="margin: 0; color: #7f8c8d;">Lâmpadas queimadas há 3 dias. Moradores reclamando da falta de visibilidade.</p>
                <span style="display: inline-block; background-color: #f39c12; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-top: 10px;">PENDENTE</span>
              </div>
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Barulho excessivo no apartamento 302</h4>
                <p style="margin: 0; color: #7f8c8d;">Festas até tarde da noite incomodando os vizinhos.</p>
                <span style="display: inline-block; background-color: #e74c3c; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-top: 10px;">CRÍTICA</span>
              </div>
            </div>

            <div style="text-align: center;">
              <button onclick="navigateTo('/')" style="background-color: #95a5a6; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px;">← Voltar ao Status</button>
            </div>
          </div>
        </div>
      `;
      break;

    case '/users':
      content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5; min-height: 100vh;">
          <div style="max-width: 800px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; margin-bottom: 20px;">👥 Gestão de Usuários</h1>
            <p style="color: #7f8c8d; margin-bottom: 30px;">Administração de usuários do SindicoOnline</p>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #ecf0f1;">
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Nome</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Email</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">João Silva</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">joao@email.com</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><span style="background-color: #3498db; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">MORADOR</span></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">Maria Santos</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">maria@email.com</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><span style="background-color: #e74c3c; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">SÍNDICO</span></td>
                </tr>
              </tbody>
            </table>

            <div style="text-align: center; margin-top: 20px;">
              <button onclick="navigateTo('/')" style="background-color: #95a5a6; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px;">← Voltar ao Status</button>
            </div>
          </div>
        </div>
      `;
      break;

    case '/admin/audit-logs':
      content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5; min-height: 100vh;">
          <div style="max-width: 800px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; margin-bottom: 20px;">📋 Logs de Auditoria</h1>
            <p style="color: #7f8c8d; margin-bottom: 30px;">Histórico de ações do sistema</p>

            <div style="margin-bottom: 20px;">
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #f9f9f9;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                  <strong>João Silva</strong>
                  <small>2024-12-30 14:30</small>
                </div>
                <p style="margin: 5px 0; color: #555;">Criou nova reclamação #42</p>
                <span style="background-color: #3498db; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">COMPLAINT_CREATED</span>
              </div>
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #f9f9f9;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                  <strong>Maria Santos</strong>
                  <small>2024-12-30 13:15</small>
                </div>
                <p style="margin: 5px 0; color: #555;">Atualizou status da reclamação #38</p>
                <span style="background-color: #27ae60; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">STATUS_CHANGED</span>
              </div>
            </div>

            <div style="text-align: center;">
              <button onclick="navigateTo('/')" style="background-color: #95a5a6; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px;">← Voltar ao Status</button>
            </div>
          </div>
        </div>
      `;
      break;

    default:
      content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5; min-height: 100vh;">
          <div style="max-width: 600px; margin: 100px auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
            <h1 style="color: #e74c3c; margin-bottom: 20px;">❌ Página Não Encontrada</h1>
            <p style="color: #7f8c8d; margin-bottom: 30px;">A página que você está procurando não existe.</p>
            <button onclick="navigateTo('/')" style="background-color: #3498db; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px;">🏠 Voltar ao Início</button>
          </div>
        </div>
      `;
  }

  root.innerHTML = content;
}

// Renderizar página inicial
renderPage(window.location.pathname);

// Adicionar listener para mudanças no histórico (botão voltar do navegador)
window.addEventListener('popstate', () => {
  renderPage(window.location.pathname);
});
