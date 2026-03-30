import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword as resetPasswordAPI } from '../../service/authApi';
import logo from '../../assets/logo.png';
import './auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialToken = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [formData, setFormData] = useState({
    token: initialToken,
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.token.trim()) {
      toast.error('Token de recuperação é obrigatório');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const message = await resetPasswordAPI({
        token: formData.token.trim(),
        password: formData.password
      });

      toast.success(message || 'Senha redefinida com sucesso');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Não foi possível redefinir a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="ABCAA Logo" className="auth-logo" />
        <div className="auth-header">
          <h1>Redefinir Senha</h1>
          <p>Cadastre uma nova senha para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!initialToken && (
            <div className="form-group">
              <label>Token de recuperação</label>
              <input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleChange}
                placeholder="Cole aqui o token recebido"
                required
                autoFocus
              />
            </div>
          )}

          <div className="form-group">
            <label>Nova senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoFocus={Boolean(initialToken)}
            />
            <small>Mínimo de 6 caracteres</small>
          </div>

          <div className="form-group">
            <label>Confirmar nova senha</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Voltar para <Link to="/login">login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
