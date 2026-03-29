import { API_BASE_URL } from '../utils/constants';

const authAPI = `${API_BASE_URL}/auth`;

/**
 * Faz login do usuário
 * @param {Object} credentials - Credenciais de login
 * @param {string} credentials.email - Email do usuário
 * @param {string} credentials.password - Senha do usuário
 * @returns {Promise<Object>} Dados do usuário e token
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${authAPI}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Credenciais inválidas');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

/**
 * Registra um novo usuário
 * @param {Object} userData - Dados do novo usuário
 * @param {string} userData.name - Nome do usuário
 * @param {string} userData.email - Email do usuário
 * @param {string} userData.password - Senha do usuário
 * @param {number} userData.departmentId - ID do departamento
 * @returns {Promise<Object>} Dados do usuário criado e token
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${authAPI}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao registrar usuário');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

/**
 * Solicita o envio do email de recuperação de senha
 * @param {string} email - Email do usuário
 * @returns {Promise<string>} Mensagem de sucesso
 */
export const forgotPassword = async (email) => {
  try {
    const body = new URLSearchParams({ email });

    const response = await fetch(`${authAPI}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || 'Erro ao solicitar recuperação de senha');
    }

    return responseText;
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    throw error;
  }
};

/**
 * Redefine a senha do usuário a partir de um token
 * @param {Object} data - Dados para redefinição
 * @param {string} data.token - Token de recuperação
 * @param {string} data.password - Nova senha
 * @returns {Promise<string>} Mensagem de sucesso
 */
export const resetPassword = async ({ token, password }) => {
  try {
    const body = new URLSearchParams({ token, password });

    const response = await fetch(`${authAPI}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || 'Erro ao redefinir senha');
    }

    return responseText;
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    throw error;
  }
};
