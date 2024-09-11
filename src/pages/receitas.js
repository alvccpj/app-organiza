import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Receitas = () => {
  const [form, setForm] = useState({
    category: '',
    date: '',
    amount: '',
    description: ''
  });
  const [records, setRecords] = useState([]);
  const router = useRouter();

  // Carrega os registros do localStorage quando a página é carregada
  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem('receitas')) || [];
    setRecords(savedRecords);
  }, []);

  // Atualiza os valores dos campos de entrada
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submete o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.date || !form.amount || !form.description) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Adiciona o novo registro
    const newRecords = [...records, form];
    setRecords(newRecords);

    // Salva os registros no localStorage
    localStorage.setItem('receitas', JSON.stringify(newRecords));

    // Limpa o formulário
    setForm({
      category: '',
      date: '',
      amount: '',
      description: ''
    });
  };

  // Deleta um registro específico
  const handleDelete = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);

    // Atualiza o localStorage
    localStorage.setItem('receitas', JSON.stringify(updatedRecords));
  };

  // Navega para a página inicial
  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="container">
      <h1>Registro de Receitas</h1>

      <button onClick={goHome} className="home-button">Voltar para Home</button>

      <form onSubmit={handleSubmit} className="record-form">
        <div className="input-group">
          <label>Categoria</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Selecione uma categoria</option>
            <option value="Salário">Salário</option>
            <option value="Freelance">Freelance</option>
            <option value="Investimento">Investimento</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div className="input-group">
          <label>Data</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Valor (R$)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Digite o valor"
          />
        </div>

        <div className="input-group">
          <label>Descrição</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Adicione uma descrição"
          />
        </div>

        <button type="submit" className="submit-button">Adicionar Receita</button>
      </form>

      <h2>Registros de Receitas</h2>
      <ul className="record-list">
        {records.length === 0 ? (
          <p>Nenhuma receita registrada.</p>
        ) : (
          records.map((record, index) => (
            <li key={index}>
              <strong>{record.category}</strong> - {record.date} - R${record.amount} <br />
              {record.description}
              <button onClick={() => handleDelete(index)} className="delete-button">Excluir</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Receitas;
