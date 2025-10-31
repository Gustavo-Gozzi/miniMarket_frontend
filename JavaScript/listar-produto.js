const API_BASE_URL = 'http://127.0.0.1:5001';

async function atualizarProduto(id, name, quantity, price) {
    const userData = localStorage.getItem("user_id");
    const token = JSON.parse(userData).access_token;

    const idSeller = JSON.parse(userData).user_id || 1; 

    try {
        const response = await fetch(`${API_BASE_URL}/product/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                quantity: Number(quantity),
                price: Number(price),
                id_seller: idSeller,
                status: "Ativo"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro ao atualizar produto:", data);
            alert(`Erro: ${data.erro || 'Falha ao atualizar produto'}`);
        } else {
            alert("✅ Produto atualizado com sucesso!");
        }

        return data;

    } catch (error) {
        console.error("Erro na requisição PUT:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

async function deletarProduto(id) {
    const userData = localStorage.getItem("user_id");
    const token = JSON.parse(userData).access_token;

    try {
        const response = await fetch(`${API_BASE_URL}/product/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro ao deletar produto:", data);
            alert(`Erro: ${data.erro || 'Falha ao deletar produto'}`);
        } else {
            const li = document.getElementById(`list-id-${id}`);
            if (li) li.remove(); // Remove do front-end
            alert("✅ Produto removido com sucesso!");
        }

        return data;

    } catch (error) {
        console.error("Erro na requisição DELETE:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

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
        return { item, btn };
    };

    const { item: liEditar, btn: btnEditar } = criarBotaoItem('Editar ✏️', 'botao-editar');
    const { item: liDeletar, btn: btnDeletar } = criarBotaoItem('Deletar ❌', 'botao-deletar');

    // Evento de edição
    btnEditar.addEventListener('click', async () => {
        if (btnEditar.textContent === 'Editar ✏️') {
            const inputNome = document.createElement('input');
            inputNome.type = 'text';
            inputNome.value = name;

            const inputQtd = document.createElement('input');
            inputQtd.type = 'number';
            inputQtd.value = quantity;

            const inputPreco = document.createElement('input');
            inputPreco.type = 'number';
            inputPreco.step = '0.01';
            inputPreco.value = price.toFixed(2);

            liNome.textContent = '';
            liNome.appendChild(inputNome);
            liQuantidade.textContent = '';
            liQuantidade.appendChild(inputQtd);
            liPreco.textContent = '';
            liPreco.appendChild(inputPreco);

            btnEditar.textContent = 'Salvar 💾';
        } else {
            const novoNome = liNome.querySelector('input').value;
            const novaQtd = liQuantidade.querySelector('input').value;
            const novoPreco = liPreco.querySelector('input').value;

            await atualizarProduto(id, novoNome, novaQtd, novoPreco);

            liNome.textContent = novoNome;
            liQuantidade.textContent = `QTD: ${novaQtd}`;
            liPreco.textContent = `R$: ${parseFloat(novoPreco).toFixed(2)}`;

            btnEditar.textContent = 'Editar ✏️';
        }
    });

    // Evento de delete
    btnDeletar.addEventListener('click', async () => {
        if (confirm("Tem certeza que deseja remover este produto?")) {
            await deletarProduto(id);
        }
    });

    ul.append(liNome, liQuantidade, liPreco, liEditar, liDeletar);
    li.appendChild(ul);

    return li;
}

function listarProdutos(produtos) {
    const container = document.getElementById('product-1');
    if (!container) return;

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
        const userData = localStorage.getItem("user_id");
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
            if (!api.ok) break;

            // Só adiciona produtos ativos
            if (product.status === "Ativo") produtosEncontrados.push(product);
            num++;
        } catch {
            break;
        }
    }

    listarProdutos(produtosEncontrados);
}

window.addEventListener('DOMContentLoaded', getDados);
