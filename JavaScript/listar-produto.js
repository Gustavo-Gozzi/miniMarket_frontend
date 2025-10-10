const API_BASE_URL = 'http://127.0.0.1:5001';

function criarItemLista(produto) {
    const { id, name, quantity, price } = produto;

    const li = document.createElement('li');
    li.className = 'list-class';
    li.id = `list-id-${id}`;

    const ul = document.createElement('ul');
    ul.className = 'description-list';

    const liNome = document.createElement('li');
    liNome.textContent = name;

    const liQuantidade = document.createElement('li');
    liQuantidade.textContent = `QTD: ${quantity}`;

    const liPreco = document.createElement('li');
    liPreco.textContent = `R$: ${price.toFixed(2)}`;

    const criarBotaoItem = (texto, idSufixo) => {
        const item = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = "ClassButton";
        btn.type = 'button';
        btn.id = `${idSufixo}-${id}`;
        btn.textContent = texto;
        item.appendChild(btn);
        return item;
    };

    const liEditar = criarBotaoItem('Editar ✏️', 'botao-editar');
    const liDeletar = criarBotaoItem('Deletar ❌', 'botao-deletar');

    ul.append(liNome, liQuantidade, liPreco, liEditar, liDeletar);

    li.appendChild(ul);

    return li;
}

function listarProdutos(produtos) {
    const container = document.getElementById('product-1');

    if (!container) {
        return;
    }
    
    container.innerHTML = '';

    const fragment = document.createDocumentFragment();
    produtos.forEach((produto) => {
        const item = criarItemLista(produto); 
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

async function getDados() {
    const produtosEncontrados = []; 

    let token;
    try {
        const userData = localStorage.getItem("user");
        token = JSON.parse(userData).access_token;
    } catch (e) {
        return;
    }

    let num = 1;

    while (true) {
        const url = `${API_BASE_URL}/product/${num}`;
        
        try {
            const api = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const product = await api.json(); 

            if (!api.ok) {
                break; 
            }

            produtosEncontrados.push(product);
            
            num++;

        } catch (error) {
            break;
        }
    }

    listarProdutos(produtosEncontrados);
}

window.addEventListener('DOMContentLoaded', getDados);