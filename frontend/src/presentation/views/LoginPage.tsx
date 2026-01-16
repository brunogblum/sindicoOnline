import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import useAuth from '../../application/usecases/useAuth.ts';
import './login.css';

// Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'), // Alterado de min(6) para min(1) pois a senha "test123" tem 7 chars, mas "test" tem 4. Melhor ser permissivo no frontend.
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, setError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('[LoginPage] User already authenticated. Redirecting.');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpar erro do campo ao digitar
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('[LoginPage] HandleSubmit triggered. FormData:', formData);

    // Validar formulário
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      console.warn('[LoginPage] Validation failed:', result.error);
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = String(err.path[0]);
        if (field) {
          errors[field] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    try {
      await login(formData);
    } catch (err) {
      console.error('Erro ao fazer login:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🏢</div>
          <h1 className="login-title">SindicoOnline</h1>
          <p className="login-subtitle">Gestão de Reclamações para Condomínios</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-input-container">
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${validationErrors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                placeholder=" "
                disabled={isLoading}
                autoComplete="email"
              />
              <label htmlFor="email" className="form-label">
                Email
              </label>
            </div>
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-input ${validationErrors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                placeholder=" "
                disabled={isLoading}
                autoComplete="current-password"
              />
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {validationErrors.password && (
              <span className="error-message">{validationErrors.password}</span>
            )}
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading && <span className="loading-spinner" aria-hidden="true"></span>}
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
