// Exemplo de lista de produtos (substitua pelos seus dados reais)
let produtos = [
    { nome: 'Notebook', quantidade: 5, preco: 10.10 },
    { nome: 'Mouse', quantidade: 10, preco: 10.00 },
    { nome: 'Teclado', quantidade: 8, preco: 10.00 },
    { nome: 'Monitor', quantidade: 3, preco: 10.00 },
    { nome: 'Monitor', quantidade: 3, preco: 10.00 },
    { nome: 'Monitor', quantidade: 3, preco: 10.00 },
    { nome: 'Monitor', quantidade: 3, preco: 10.00 },
    { nome: 'Monitor', quantidade: 3, preco: 10.00 },
    { nome: 'Monitor', quantidade: 3, preco: 10.00 }
];




function criarItemLista(nome, quantidade, preco, idUnico) {

    // Criar o <li> principal
    const li = document.createElement('li');
    li.className = 'list-class';
    li.id = `list-id-${idUnico}`;
    
    // Criar o <ul> interno
    const ul = document.createElement('ul');
    ul.className = 'description-list';
    
    // Criar item do nome
    const liNome = document.createElement('li');
    liNome.textContent = nome;
    
    // Criar item da quantidade
    const liQuantidade = document.createElement('li');
    liQuantidade.textContent = `QTD: ${quantidade}`;

    // Criar item do preço
    const liPreco = document.createElement('li');
    liPreco.textContent = `R$: ${preco.toFixed(2)}`;
    
    // Criar item do botão editar
    const liEditar = document.createElement('li');
    const btnEditar = document.createElement('button');
    btnEditar.className = "ClassButton"
    btnEditar.type = 'button';
    btnEditar.id = `botao-editar-${idUnico}`;
    btnEditar.textContent = 'Editar ✏️';
    liEditar.appendChild(btnEditar);
    
    // Criar item do botão deletar
    const liDeletar = document.createElement('li');
    const btnDeletar = document.createElement('button');
    btnDeletar.className = "ClassButton"
    btnDeletar.type = 'button';
    btnDeletar.id = `botao-deletar-${idUnico}`;
    btnDeletar.textContent = 'Deletar ❌';
    liDeletar.appendChild(btnDeletar);
    
    // Adicionar todos os items ao <ul>
    ul.appendChild(liNome);
    ul.appendChild(liQuantidade);
    ul.appendChild(liPreco);
    ul.appendChild(liEditar);
    ul.appendChild(liDeletar);
    
    // Adicionar o <ul> ao <li> principal
    li.appendChild(ul);
    
    return li;
}

// Função para listar produtos a partir de um array de objetos
function listarProdutos(produtos) {
    const container = document.getElementById('product-1');
    
    // Limpa o container antes de adicionar os novos itens
    container.innerHTML = '';
    
    // Percorre o array de produtos e cria cada item
    produtos.forEach((produto, index) => {
        const item = criarItemLista(produto.nome, produto.quantidade, produto.preco, index);
        container.appendChild(item);
    });
}


// Quando a página carregar, renderiza os produtos
window.addEventListener('DOMContentLoaded', () => {
    listarProdutos(produtos);
});