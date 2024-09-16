import { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  // Alterna entre login e cadastro
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  // Valida o formulário
  const validateForm = () => {
    if (!email.includes('@')) {
      return 'Por favor, insira um email válido.';
    }
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (!isLogin && !/^\d{11}$/.test(cpf)) {
      return 'Por favor, insira um CPF válido (11 dígitos).';
    }
    if (!isLogin && name.length === 0) {
      return 'O nome é obrigatório para o cadastro.';
    }
    return null;
  };

  const registerUser = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = { name, cpf, phone, email, password };

    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return 'Esse email já está cadastrado.';
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return null;
  };

  const loginUser = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
      return 'Email ou senha incorretos.';
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
    } else {
      let response;
      if (isLogin) {
        response = loginUser();
      } else {
        response = registerUser();
      }

      if (response) {
        setError(response);
      } else {
        alert(isLogin ? 'Login bem-sucedido!' : 'Cadastro realizado com sucesso!');
        setName('');
        setCpf('');
        setPhone('');
        setEmail('');
        setPassword('');
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="input-group">
              <label>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>
            <div className="input-group">
              <label>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Digite seu CPF"
              />
            </div>
            <div className="input-group">
              <label>Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Digite seu número de telefone"
              />
            </div>
          </>
        )}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>

        <div className="input-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="auth-button">
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <p className="toggle-text">
        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
        <span onClick={toggleForm} className="toggle-link">
          {isLogin ? 'Cadastre-se' : 'Faça Login'}
        </span>
      </p>

      {/* Botão para voltar para a página inicial */}
      <button onClick={() => router.push('/')} className="home-button">
        Voltar para a Home
      </button>
    </div>
  );
};

export default Login;