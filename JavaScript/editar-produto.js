const API_BASE_URL = 'http://127.0.0.1:5001';

// 1️⃣ - Pega o ID do produto pela URL (?id=123)
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// 2️⃣ - Carrega os dados do produto no formulário
async function carregarProduto() {
    const id = getProductIdFromURL();
    if (!id) {
        alert("ID do produto não encontrado na URL.");
        return;
    }

    // Recupera token e id do vendedor diretamente do LocalStorage
    const token = localStorage.getItem("token");
    const idSeller = parseInt(localStorage.getItem("user_id"));

    if (!token || !idSeller) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/product/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar produto. Código: " + response.status);
        }

        const produto = await response.json();

        // Preenche o formulário
        document.getElementById("name").value = produto.name || "";
        document.getElementById("price").value = produto.price || "";
        document.getElementById("quantity").value = produto.quantity || "";

    } catch (error) {
        console.error("Erro ao carregar produto:", error);
        alert("Erro ao carregar os dados do produto.");
    }
}

// 3️⃣ - Salva alterações via PUT
async function salvarAlteracoes(event) {
    if (event) event.preventDefault();

    const id = getProductIdFromURL();
    if (!id) {
        alert("Produto inválido.");
        return;
    }

    const nome = document.getElementById("name").value.trim();
    const preco = parseFloat(document.getElementById("price").value);
    const quantidade = parseInt(document.getElementById("quantity").value);

    // Recupera token e id_seller diretamente do localStorage
    const token = localStorage.getItem("token");
    const idSeller = parseInt(localStorage.getItem("user_id"));

    if (!token || !idSeller) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
    }

    const body = {
        name: nome,
        price: preco,
        quantity: quantidade,
        id_seller: idSeller,
        status: "ativo"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/product/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const responseText = await response.text();
        console.log("Status:", response.status);
        console.log("Resposta do servidor:", responseText);

        if (!response.ok) {
            throw new Error(`Erro ao atualizar produto (${response.status}): ${responseText}`);
        }

        alert("Produto atualizado com sucesso!");
        setTimeout(() => {
            window.location.href = "listar-produto.html"; // volta pra lista
        }, 1500);

    } catch (error) {
        console.error("Erro ao salvar alterações:", error);
        alert("Erro ao salvar alterações. Veja o console para mais detalhes.");
    }
}

// 4️⃣ - Evento de carregamento da página
document.addEventListener("DOMContentLoaded", () => {
    carregarProduto();
    const botaoSalvar = document.getElementById("botao-salvar");
    if (botaoSalvar) {
        botaoSalvar.addEventListener("click", salvarAlteracoes);
    }
});