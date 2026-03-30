import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register as registerAPI } from '../../service/authApi';
import { fetchDepartments } from '../../service/departmentApi';
import { validateEmail } from '../../utils/validators';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import './auth.css';

const Register = () => {
  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    departmentId: ''
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Carrega os departamentos ao montar o componente
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
      toast.error('Erro ao carregar setores');
    }
  };

  // Atualiza o state quando um campo muda
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Valida o formulário
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Email inválido');
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

    if (!formData.departmentId) {
      toast.error('Selecione um setor');
      return false;
    }

    return true;
  };

  // Manipula o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valida antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepara dados para envio (sem confirmPassword)
      const { confirmPassword: _confirmPassword, ...userData } = formData;
      userData.departmentId = parseInt(userData.departmentId);

      // Registra na API
      const response = await registerAPI(userData);
      
      // Salva dados no contexto
      login(
        response.userType,
        response.name,
        response.volunteerId,
        response.departmentId,
        response.email,
        response.token
      );
      
      // Mostra mensagem de sucesso
      toast.success('Conta criada com sucesso!');
      
      // Redireciona para dashboard
      navigate('/volunteer/dashboard');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="ABCAA Logo" className="auth-logo" />
        <div className="auth-header">
          <h1>Criar Conta</h1>
          <p>Registre-se no Sistema ABCAA</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="João Silva"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Setor</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um setor</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <small>Mínimo de 6 caracteres</small>
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
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
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
