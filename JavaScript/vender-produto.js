const API_BASE_URL = 'http://127.0.0.1:5001';

// Agora pega EXATAMENTE o token que seu login salva:
function getAuthToken() {
    return localStorage.getItem("token");
}

async function realizarVenda(idProduct, quantity, priceUnit) {
    const token = getAuthToken();

    if (!token) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    const payload = {
        id_product: Number(idProduct),
        quantity: Number(quantity),
        price: Number(priceUnit)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/sell`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(`Erro: ${data.erro || data.message || "Falha ao realizar venda"}`);
            return null;
        }

        alert("Venda realizada com sucesso!");
        return data;

    } catch (error) {
        console.error("Erro na requisição POST:", error);
        alert("Erro ao conectar com o servidor.");
        return null;
    }
}

function criarItemVenda(produto) {
    const { id, name, quantity, price } = produto;

    const li = document.createElement('li');
    li.className = 'list-class';
    li.id = `list-id-${id}`;

    const ul = document.createElement('ul');
    ul.className = 'description-list';

    const liNome = document.createElement('li');
    liNome.textContent = name;

    const liEstoque = document.createElement('li');
    liEstoque.textContent = `Estoque: ${quantity}`;

    const liPrecoUnit = document.createElement('li');
    liPrecoUnit.textContent = `R$ ${Number(price).toFixed(2)} /un`;

    const liQuantidade = document.createElement('li');
    const labelQtd = document.createElement('span');
    labelQtd.textContent = 'Qtd:';

    const inputQtd = document.createElement('input');
    inputQtd.type = 'number';
    inputQtd.min = '1';
    inputQtd.max = quantity.toString();
    inputQtd.value = '1';

    liQuantidade.appendChild(labelQtd);
    liQuantidade.appendChild(inputQtd);

    const liTotal = document.createElement('li');
    const spanTotal = document.createElement('span');
    spanTotal.textContent = `Total: R$ ${Number(price).toFixed(2)}`;
    liTotal.appendChild(spanTotal);

    inputQtd.addEventListener('input', () => {
        let qtdVenda = parseInt(inputQtd.value, 10) || 1;

        if (qtdVenda < 1) {
            qtdVenda = 1;
            inputQtd.value = '1';
        }
        if (qtdVenda > quantity) {
            qtdVenda = quantity;
            inputQtd.value = quantity.toString();
            alert(`Quantidade máxima disponível: ${quantity}`);
        }

        const totalVenda = qtdVenda * price;
        spanTotal.textContent = `Total: R$ ${totalVenda.toFixed(2)}`;
    });

    const liVender = document.createElement('li');
    const btnVender = document.createElement('button');
    btnVender.className = "ClassButton";
    btnVender.type = 'button';
    btnVender.id = `botao-vender-${id}`;
    btnVender.textContent = 'Vender 💰';

    btnVender.addEventListener('click', async () => {
        const qtdVenda = parseInt(inputQtd.value, 10);

        if (qtdVenda < 1 || qtdVenda > quantity) {
            alert('Quantidade inválida!');
            return;
        }

        const confirmacao = confirm(
            `Confirmar venda?\n\nProduto: ${name}\nQuantidade: ${qtdVenda}\nTotal: R$ ${(qtdVenda * price).toFixed(2)}`
        );

        if (!confirmacao) return;

        const resultado = await realizarVenda(id, qtdVenda, price);

        if (resultado) {
            await getDados();
        }
    });

    liVender.appendChild(btnVender);

    ul.append(liNome, liEstoque, liPrecoUnit, liQuantidade, liTotal, liVender);
    li.appendChild(ul);

    return li;
}

function listarProdutosVenda(produtos) {
    const container = document.getElementById('product-1');
    if (!container) return;

    container.innerHTML = '';

    if (!produtos || produtos.length === 0) {
        const mensagem = document.createElement('li');
        mensagem.textContent = 'Nenhum produto disponível para venda.';
        container.appendChild(mensagem);
        return;
    }

    const fragment = document.createDocumentFragment();
    produtos.forEach((produto) => {
        fragment.appendChild(criarItemVenda(produto));
    });

    container.appendChild(fragment);
}

async function getDados() {
    const token = getAuthToken();

    if (!token) {
        alert("Você precisa estar logado para vender produtos.");
        window.location.href = "login.html";
        return;
    }

    const produtosDisponiveis = [];
    let num = 1;

    while (true) {
        try {
            const api = await fetch(`${API_BASE_URL}/product/${num}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!api.ok) break;

            const product = await api.json();

            if (product.status === "Ativo" && product.quantity > 0) {
                produtosDisponiveis.push(product);
            }

            num++;

        } catch {
            break;
        }
    }

    listarProdutosVenda(produtosDisponiveis);
}

window.addEventListener('DOMContentLoaded', getDados);
