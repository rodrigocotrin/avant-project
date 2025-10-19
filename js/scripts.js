// Executa o script quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DE CARREGAMENTO DA TABELA (Página excursoes.html) ---
    const tabelaCorpo = document.getElementById('tabela-corpo');
    
    // Verifica se estamos na página correta (onde a tabela existe)
    if (tabelaCorpo) {
        carregarDadosTabela();
    }

    // --- 2. LÓGICA DE VALIDAÇÃO DO FORMULÁRIO (Página roteiro.html) ---
    const formRoteiro = document.getElementById('form-roteiro');

    // Verifica se estamos na página correta (onde o formulário existe)
    if (formRoteiro) {
        formRoteiro.addEventListener('submit', validarFormulario);
        
        // Bonus: Atualizar o valor do range
        const orcamentoInput = document.getElementById('orcamento');
        const orcamentoValor = document.getElementById('orcamento-valor');
        orcamentoInput.addEventListener('input', (e) => {
            orcamentoValor.textContent = `$${e.target.value}`;
        });
    }
});

/**
 * Função para carregar dados do JSON e popular a tabela via AJAX (Fetch API).
 */
async function carregarDadosTabela() {
    const tabelaCorpo = document.getElementById('tabela-corpo');
    
    try {
        // 
        const response = await fetch('data/tabela.json'); 
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const dados = await response.json();

        // Limpa o indicador de "Carregando..."
        tabelaCorpo.innerHTML = '';

        // Popula a tabela
        dados.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.destino}</td>
                <td>${item.data}</td>
                <td>${item.duracao}</td>
                <td>${item.vagas}</td>
                <td><strong>$${item.preco}</strong></td>
            `;
            tabelaCorpo.appendChild(row);
        });

    } catch (error) {
        console.error('Falha ao carregar dados da tabela:', error);
        tabelaCorpo.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Falha ao carregar dados. Tente novamente mais tarde.</td></tr>`;
    }
}

/**
 * Função para validar o formulário de roteiro.
 * 
 */
function validarFormulario(event) {
    // Impede o envio real do formulário
    event.preventDefault();

    // Coleta de dados (Exemplo simples de captura)
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const data = document.getElementById('data').value;
    const duracao = document.getElementById('duracao').value;
    const hospedagem = document.getElementById('hospedagem').value;

    // Validação simples (apenas campos obrigatórios)
    if (nome === '' || email === '') {
        alert('Por favor, preencha os campos "Nome Completo" e "E-mail".');
        return; // Interrompe a execução
    }

    // Coleta dos checkboxes
    const destinos = [];
    if (document.getElementById('checkRussia').checked) {
        destinos.push('Rússia');
    }
    if (document.getElementById('checkUcrania').checked) {
        destinos.push('Ucrânia');
    }

    // Monta a string de dados para o alerta
    let dadosPreenchidos = `
        Roteiro solicitado!
        ----------------------
        Nome: ${nome}
        Email: ${email}
        Data: ${data || 'Não definida'}
        Duração: ${duracao || 'Não definida'} dias
        Hospedagem: ${hospedagem || 'Não definida'}
        Destinos: ${destinos.length > 0 ? destinos.join(', ') : 'Não definidos'}
    `;

    // Exibe os dados em uma caixa de diálogo [cite: 26]
    alert(dadosPreenchidos);

    // Limpa o formulário após o envio
    event.target.reset();
    
    // Reseta o valor do range (bônus)
    document.getElementById('orcamento-valor').textContent = '$2000';
}