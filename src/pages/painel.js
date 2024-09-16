import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Chart from 'chart.js/auto';

const formatCurrency = (amount) => {
  return amount
    .toFixed(2) // Garante duas casas decimais
    .replace('.', ',') // Substitui o ponto por vírgula para o formato brasileiro
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona os pontos para separação dos milhares
};

const Painel = () => {
  const [balance, setBalance] = useState(0);
  const [recentReceitas, setRecentReceitas] = useState([]);
  const [recentDespesas, setRecentDespesas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const receitas = JSON.parse(localStorage.getItem('receitas')) || [];
    const despesas = JSON.parse(localStorage.getItem('despesas')) || [];

    // Calcula o saldo total
    const totalReceitas = receitas.reduce((acc, receita) => acc + parseFloat(receita.amount), 0);
    const totalDespesas = despesas.reduce((acc, despesa) => acc + parseFloat(despesa.amount), 0);
    setBalance(totalReceitas - totalDespesas);

    // Mostra as últimas 5 receitas e despesas
    setRecentReceitas(receitas.slice(-5));
    setRecentDespesas(despesas.slice(-5));

    // Gera gráficos após carregar os dados
    generateCharts(receitas, despesas);
  }, []);

  // Função para gerar gráficos com Chart.js
  const generateCharts = (receitas, despesas) => {
    const ctxReceitas = document.getElementById('receitasChart').getContext('2d');
    const ctxDespesas = document.getElementById('despesasChart').getContext('2d');

    // Destrói gráficos antigos se existirem
    if (ctxReceitas.chart) ctxReceitas.chart.destroy();
    if (ctxDespesas.chart) ctxDespesas.chart.destroy();

    // Cria um novo gráfico de pizza para receitas
    ctxReceitas.chart = new Chart(ctxReceitas, {
      type: 'pie',
      data: {
        labels: ['Salário', 'Freelance', 'Investimento', 'Outros'],
        datasets: [
          {
            label: 'Receitas por Categoria',
            data: [
              receitas.filter(r => r.category === 'Salário').reduce((acc, r) => acc + parseFloat(r.amount), 0),
              receitas.filter(r => r.category === 'Freelance').reduce((acc, r) => acc + parseFloat(r.amount), 0),
              receitas.filter(r => r.category === 'Investimento').reduce((acc, r) => acc + parseFloat(r.amount), 0),
              receitas.filter(r => r.category === 'Outros').reduce((acc, r) => acc + parseFloat(r.amount), 0),
            ],
            backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384', '#4bc0c0'],
          },
        ],
      },
    });

    // Cria um novo gráfico de linha para despesas
    ctxDespesas.chart = new Chart(ctxDespesas, {
      type: 'line',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        datasets: [
          {
            label: 'Fluxo de Caixa Mensal',
            data: [1000, 1200, 800, 1500, 2000, 1800],
            borderColor: '#ff6384',
            fill: false,
          },
        ],
      },
    });
  };

  const goToPage = (path) => {
    router.push(path);
  };

  return (
    <div className="painel-container">
      <header className="header">
        <h1>Painel Principal</h1>
        <p>Visão geral das suas finanças</p>
      </header>

      <section className="overview">
        <div className="balance">
          <h2>Saldo Atual</h2>
          <p>R$ {formatCurrency(balance)}</p>
        </div>

        <div className="recent-transactions">
          <h3>Receitas Recentes</h3>
          <ul>
            {recentReceitas.map((receita, index) => (
              <li key={index}>
                {receita.category} - R$ {formatCurrency(parseFloat(receita.amount))}
              </li>
            ))}
          </ul>

          <h3>Despesas Recentes</h3>
          <ul>
            {recentDespesas.map((despesa, index) => (
              <li key={index}>
                {despesa.category} - R$ {formatCurrency(parseFloat(despesa.amount))}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="charts">
        <div className="chart-container">
          <h3>Distribuição de Receitas</h3>
          <canvas id="receitasChart"></canvas>
        </div>
        <div className="chart-container">
          <h3>Fluxo de Caixa Mensal</h3>
          <canvas id="despesasChart"></canvas>
        </div>
      </section>

      <section className="navigation-buttons">
        <button onClick={() => goToPage('/receitas')}>Gerenciar Receitas</button>
        <button onClick={() => goToPage('/despesas')}>Gerenciar Despesas</button>
        <button onClick={() => goToPage('/relatorios')}>Gerar Relatórios</button>
      </section>
    </div>
  );
};

export default Painel;
