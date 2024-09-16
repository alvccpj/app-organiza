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
  const [editIndex, setEditIndex] = useState(null); // Índice do registro sendo editado
  const router = useRouter();

  // Carrega os registros do localStorage quando a página é carregada
  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem('receitas')) || [];
    setRecords(savedRecords);
  }, []);

  // Atualiza os valores dos campos de entrada
  const handleChange = (e) => {
    if (e.target.name === 'amount') {
      // Formata o valor com pontos e vírgulas
      const value = e.target.value.replace(/[^\d,]/g, '');
      setForm({
        ...form,
        [e.target.name]: value
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    }
  };

  // Formata o valor para exibição
  const formatValue = (value) => {
    if (!value) return '';
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d)(\d{8})$/, '$1.$2') // Adiciona ponto para milhões
      .replace(/(\d)(\d{5})$/, '$1.$2') // Adiciona ponto para milhares
      .replace(/(\d)(\d{2})$/, '$1,$2'); // Adiciona vírgula para centavos
  };

  // Submete o formulário (adiciona ou atualiza um registro)
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedAmount = form.amount.replace(',', '.'); // Converte vírgula para ponto para armazenamento
    if (!form.category || !form.date || !formattedAmount || !form.description) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    let updatedRecords;
    if (editIndex === null) {
      // Adiciona um novo registro
      updatedRecords = [...records, { ...form, amount: formattedAmount }];
    } else {
      // Atualiza o registro existente
      updatedRecords = records.map((record, index) =>
        index === editIndex ? { ...form, amount: formattedAmount } : record
      );
      setEditIndex(null); // Limpa o índice de edição após salvar
    }

    // Salva os registros no localStorage
    setRecords(updatedRecords);
    localStorage.setItem('receitas', JSON.stringify(updatedRecords));

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
    localStorage.setItem('receitas', JSON.stringify(updatedRecords));
  };

  // Preenche o formulário para edição
  const handleEdit = (index) => {
    setForm({
      ...records[index],
      amount: formatValue(records[index].amount) // Formata o valor para edição
    });
    setEditIndex(index);
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
            type="text"
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

        <button type="submit" className="submit-button">
          {editIndex === null ? 'Adicionar Receita' : 'Atualizar Receita'}
        </button>
      </form>

      <h2>Registros de Receitas</h2>
      <ul className="record-list">
        {records.length === 0 ? (
          <p>Nenhuma receita registrada.</p>
        ) : (
          records.map((record, index) => (
            <li key={index}>
              <strong>{record.category}</strong> - {record.date} - R${formatValue(record.amount)} <br />
              {record.description}
              <button onClick={() => handleEdit(index)} className="edit-button">Editar</button>
              <button onClick={() => handleDelete(index)} className="delete-button">Excluir</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Receitas;