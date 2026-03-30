import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword as forgotPasswordAPI } from '../../service/authApi';
import { validateEmail } from '../../utils/validators';
import logo from '../../assets/logo.png';
import './auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Informe um email válido');
      return;
    }

    setLoading(true);

    try {
      const message = await forgotPasswordAPI(email);
      toast.success(message || 'Email de recuperação enviado');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Não foi possível enviar o email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="ABCAA Logo" className="auth-logo" />
        <div className="auth-header">
          <h1>Recuperar Senha</h1>
          <p>Informe seu email para receber o link de redefinição</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Lembrou sua senha? <Link to="/login">Voltar para login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
