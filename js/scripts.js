// Ela aplica uma classe ao <body> milissegundos antes do navegador mudar de página.
window.addEventListener('beforeunload', () => {
    document.body.classList.add('unloading');
});


document.addEventListener('DOMContentLoaded', () => {

    const tabelaCorpo = document.getElementById('tabela-corpo');
    
    if (tabelaCorpo) {
        carregarDadosTabela();
    }

    const formRoteiro = document.getElementById('form-roteiro');

    if (formRoteiro) {
        formRoteiro.addEventListener('submit', validarFormulario);
        
        const orcamentoInput = document.getElementById('orcamento');
        const orcamentoValor = document.getElementById('orcamento-valor');
        orcamentoInput.addEventListener('input', (e) => {
            orcamentoValor.textContent = `$${e.target.value}`;
        });
    }
});

//Carregar dados do JSON e popular a tabela via AJAX (Fetch API).
async function carregarDadosTabela() {
    const tabelaCorpo = document.getElementById('tabela-corpo');
    
    try {
        
        const response = await fetch('/data/tabela.json'); 
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const dados = await response.json();

        tabelaCorpo.innerHTML = '';

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

//Valida o formulário de roteiro.
function validarFormulario(event) {
 
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const data = document.getElementById('data').value;
    const duracao = document.getElementById('duracao').value;
    const hospedagem = document.getElementById('hospedagem').value;

    if (nome === '' || email === '') {
        alert('Por favor, preencha os campos "Nome Completo" e "E-mail".');
        return; 
    }

    const destinos = [];
    if (document.getElementById('checkRussia').checked) {
        destinos.push('Rússia');
    }
    if (document.getElementById('checkUcrania').checked) {
        destinos.push('Ucrânia');
    }

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
    alert(dadosPreenchidos);
    event.target.reset();
    document.getElementById('orcamento-valor').textContent = '$2000';
}