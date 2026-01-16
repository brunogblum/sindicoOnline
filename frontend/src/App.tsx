import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './presentation/views/LoginPage';
import DashboardPage from './presentation/views/DashboardPage';
import UsersPage from './presentation/views/UsersPage';
import ComplaintFeedPage from './presentation/views/ComplaintFeedPage';
import CreateComplaintPage from './presentation/views/CreateComplaintPage';
import ComplaintDetailsPage from './presentation/views/ComplaintDetailsPage';
import AuditLogsPage from './presentation/views/AuditLogsPage';
import PrivateRoute from './presentation/views/components/PrivateRoute';
import { AuthenticatedLayout } from './presentation/views/components/AuthenticatedLayout';
import useAuth from './application/usecases/useAuth';

function StatusPage() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('[App] Received auth:unauthorized event. Logging out.');
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>🏢 SindicoOnline</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
          Sistema de Gestão de Reclamações para Condomínios
        </p>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#3498db' }}>✅ Servidores Funcionando!</h2>
          <ul style={{ lineHeight: '1.6' }}>
            <li>
              <strong>Backend:</strong> http://localhost:3000 (API REST)
            </li>
            <li>
              <strong>Frontend:</strong> http://localhost:5173 (React)
            </li>
            <li>
              <strong>Banco:</strong> PostgreSQL via Docker
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Páginas Disponíveis:</h3>
          <ul style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
            <li>
              <strong>/login</strong> - Página de login
            </li>
            <li>
              <strong>/dashboard</strong> - Dashboard principal (autenticado)
            </li>
            <li>
              <strong>/complaints</strong> - Feed de reclamações (autenticado)
            </li>
            <li>
              <strong>/users</strong> - Gestão de usuários (apenas ADMIN)
            </li>
            <li>
              <strong>/admin/audit-logs</strong> - Logs de auditoria (apenas ADMIN)
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Funcionalidades Disponíveis:</h3>
          <ul style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
            <li>🔐 Autenticação e autorização</li>
            <li>📝 Sistema completo de reclamações</li>
            <li>👥 Gestão de usuários (Moradores, Síndicos, Administradores)</li>
            <li>📊 Dashboard administrativo</li>
            <li>📋 Logs de auditoria completos</li>
            <li>🖼️ Upload de evidências</li>
            <li>💬 Sistema de comentários internos</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => (window.location.href = isAuthenticated ? '/dashboard' : '/login')}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginRight: '10px',
            }}
          >
            🚀 Acessar Sistema
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            🔄 Atualizar Status
          </button>
        </div>

        <div
          style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: '#ecf0f1',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: '0', fontSize: '14px', color: '#2c3e50' }}>
            <strong>Status:</strong> Sistema operacional e pronto para uso!
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#7f8c8d' }}>
            Usuário: {isAuthenticated ? 'Autenticado' : 'Não autenticado'}
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#7f8c8d' }}>
            Data/Hora: {new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { logout } = useAuth();

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  return (
    <Routes>
      {/* Página de status (rota padrão) */}
      <Route path="/status" element={<StatusPage />} />

      {/* Rota pública - Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <DashboardPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      {/* Rota de gerenciamento de usuários - apenas ADMIN */}
      <Route
        path="/users"
        element={
          <PrivateRoute requiredRoles={['ADMIN', 'SINDICO']}>
            <AuthenticatedLayout>
              <UsersPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      {/* Rota de logs de auditoria - apenas ADMIN */}
      <Route
        path="/admin/audit-logs"
        element={
          <PrivateRoute requiredRoles={['ADMIN']}>
            <AuthenticatedLayout>
              <AuditLogsPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      {/* Rota do feed de reclamações - todos os usuários autenticados */}
      <Route
        path="/complaints"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <ComplaintFeedPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/complaints/:id"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <ComplaintDetailsPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/complaints/create"
        element={
          <PrivateRoute requiredRoles={['MORADOR']}>
            <AuthenticatedLayout>
              <CreateComplaintPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      {/* Rota padrão - redireciona para status */}
      <Route path="/" element={<Navigate to="/status" replace />} />

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/status" replace />} />
    </Routes>
  );
}

export default App;
