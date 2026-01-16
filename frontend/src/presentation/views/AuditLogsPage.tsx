import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AuditLogViewModel } from '../viewmodels/audit-log.view-model';
import { useAuthStore } from '../../application/usecases/auth.store';
import './AuditLogsPage.css';

/**
 * Página de administração para visualizar logs de auditoria
 * Apenas usuários Admin podem acessar esta página
 */
const AuditLogsPage: React.FC = observer(() => {
  const authStore = useAuthStore();
  const [viewModel] = useState(() => new AuditLogViewModel());

  // Verifica se usuário é admin
  const isAdmin = authStore.user?.role === 'ADMIN';

  useEffect(() => {
    if (isAdmin) {
      viewModel.loadAuditLogs();
    }
  }, [isAdmin, viewModel]);

  // Se não for admin, mostra mensagem de acesso negado
  if (!isAdmin) {
    return (
      <div className="audit-logs-page">
        <div className="access-denied">
          <h2>Acesso Negado</h2>
          <p>Apenas administradores podem visualizar os logs de auditoria.</p>
        </div>
      </div>
    );
  }

  const handleFilterChange = (filterName: keyof typeof viewModel.filters, value: string) => {
    viewModel.setFilter(filterName, value);
  };

  const handleApplyFilters = () => {
    viewModel.setPage(1); // Volta para primeira página ao aplicar filtros
    viewModel.loadAuditLogs();
  };

  const handleClearFilters = () => {
    viewModel.clearFilters();
    viewModel.loadAuditLogs();
  };

  const handleLoadRecent = () => {
    viewModel.loadRecentLogs();
  };

  const handlePageChange = (page: number) => {
    viewModel.setPage(page);
    viewModel.loadAuditLogs();
  };

  return (
    <div className="audit-logs-page">
      <div className="page-header">
        <h1>Logs de Auditoria</h1>
        <p>Rastreamento de todas as ações críticas realizadas no sistema</p>
      </div>

      {/* Controles */}
      <div className="controls-section">
        <button
          onClick={handleLoadRecent}
          className="recent-btn"
          disabled={viewModel.isLoading}
        >
          Ver Logs Recentes (24h)
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <h3>Filtros</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Ação:</label>
            <select
              value={viewModel.filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">Todas</option>
              {viewModel.availableActions.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tipo de Entidade:</label>
            <select
              value={viewModel.filters.entityType}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
            >
              <option value="">Todos</option>
              {viewModel.availableEntityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>ID da Entidade:</label>
            <input
              type="text"
              value={viewModel.filters.entityId}
              onChange={(e) => handleFilterChange('entityId', e.target.value)}
              placeholder="Digite o ID da entidade"
            />
          </div>

          <div className="filter-group">
            <label>Data Inicial:</label>
            <input
              type="date"
              value={viewModel.filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Data Final:</label>
            <input
              type="date"
              value={viewModel.filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} disabled={viewModel.isLoading}>
            Aplicar Filtros
          </button>
          <button onClick={handleClearFilters} disabled={viewModel.isLoading}>
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Lista de logs */}
      <div className="logs-section">
        {viewModel.error && (
          <div className="error-message">
            {viewModel.error}
          </div>
        )}

        {viewModel.isLoading ? (
          <div className="loading">Carregando logs...</div>
        ) : (
          <>
            <div className="logs-header">
              <h3>Logs Encontrados: {viewModel.total}</h3>
            </div>

            {viewModel.logs.length === 0 ? (
              <div className="no-logs">
                Nenhum log encontrado com os filtros aplicados.
              </div>
            ) : (
              <div className="logs-list">
                {viewModel.logs.map((item) => (
                  <div key={item.log.id} className="log-item">
                    <div className="log-header">
                      <div className="log-action">
                        {viewModel.formatAction(item.log.action)}
                      </div>
                      <div className="log-date">
                        {viewModel.formatDate(item.log.createdAt)}
                      </div>
                    </div>

                    <div className="log-details">
                      <div className="log-user">
                        <strong>Usuário:</strong> {item.user.name} ({viewModel.formatRole(item.user.role)})
                      </div>
                      <div className="log-entity">
                        <strong>Entidade:</strong> {item.log.entityType} - {item.log.entityId}
                      </div>
                      {item.log.details && (
                        <div className="log-extra-details">
                          <strong>Detalhes:</strong>
                          <pre>{JSON.stringify(item.log.details, null, 2)}</pre>
                        </div>
                      )}
                      {item.log.ipAddress && (
                        <div className="log-ip">
                          <strong>IP:</strong> {item.log.ipAddress}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {viewModel.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(viewModel.page - 1)}
                  disabled={viewModel.page <= 1 || viewModel.isLoading}
                >
                  Anterior
                </button>

                <span>
                  Página {viewModel.page} de {viewModel.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(viewModel.page + 1)}
                  disabled={viewModel.page >= viewModel.totalPages || viewModel.isLoading}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default AuditLogsPage;




