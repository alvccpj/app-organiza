import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  // Função para redirecionar para uma página específica
  const navigateTo = (path) => {
    router.push(path);
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Bem-vindo ao Organiza</h1>
        <p>Controle e gerencie suas receitas, despesas e investimentos de forma eficiente.</p>
      </header>

      <section className="features">
      <button className="feature" onClick={() => navigateTo('/login')}>
          <h2>Cadastro de Usuários</h2>
          <p>Aqui você deve cadastrar-se ou fazer login.</p>
        </button>
        <button className="feature" onClick={() => navigateTo('/receitas')}>
          <h2>Receitas e Despesas</h2>
          <p>Acompanhe suas fontes de receita.</p>
        </button>
        <button className="feature" onClick={() => navigateTo('/painel')}>
          <h2>Painel Principal</h2>
          <p>Visão geral das finanças, saldo atual, receitas e despesas recentes.</p>
        </button>
        <button className="feature" onClick={() => navigateTo('/investimentos')}>
          <h2>Investimentos</h2>
          <p>Veja o progresso dos seus investimentos.</p>
        </button>
        <button className="feature" onClick={() => navigateTo('/orcamento')}>
          <h2>Orçamento</h2>
          <p>Defina e acompanhe seu orçamento mensal e anual.</p>
        </button>
        <button className="feature" onClick={() => navigateTo('/notificacoes')}>
          <h2>Notificações</h2>
          <p>Receba alertas e notificações financeiras importantes.</p>
        </button>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Organiza. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;