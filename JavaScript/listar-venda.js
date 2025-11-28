const API_BASE_URL = 'http://127.0.0.1:5001';

function criarItemVenda(venda) {
    const { id, quantity, price, status, client, id_product, product_name } = venda;
    const total = (price * quantity).toFixed(2);

    const li = document.createElement('li');
    li.className = 'list-class';
    li.id = `sell-id-${id}`;

    const ul = document.createElement('ul');
    ul.className = 'description-list';

    const liProduto = document.createElement('li');
    liProduto.textContent = `${product_name}`;

    const liQuantidade = document.createElement('li');
    liQuantidade.textContent = `Quantidade vendida: ${quantity}`;

    const liTotal = document.createElement('li');
    liTotal.textContent = `Total: R$ ${total}`;

    ul.append(liProduto, liQuantidade, liTotal);
    li.appendChild(ul);

    return li;
}

function listarVendas(vendas) {
    const container = document.getElementById('product-1');
    if (!container) return;

    container.innerHTML = '';

    if (!vendas || vendas.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma venda encontrada.';
        container.appendChild(li);
        return;
    }

    const fragment = document.createDocumentFragment();
    vendas.forEach((venda) => {
        const item = criarItemVenda(venda);
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

async function getVendas() {
    let token;
    try {
        // O token está salvo diretamente na chave "token"
        token = localStorage.getItem("token");
        
        if (!token) {
            alert("Erro: Usuário não autenticado. Faça login novamente.");
            return;
        }
    } catch (e) {
        console.error("Erro ao obter token:", e);
        alert("Erro: Usuário não autenticado. Faça login novamente.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/sell/seller`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro ao buscar vendas:", errorData);
            alert(`Erro ao buscar vendas: ${errorData.erro || 'Erro desconhecido'}`);
            return;
        }

        const vendas = await response.json();
        
        if (Array.isArray(vendas)) {
            vendas.sort((a, b) => b.id - a.id);
        }

        listarVendas(vendas);

    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("Erro ao carregar vendas.");
    }
}

window.addEventListener('DOMContentLoaded', getVendas);