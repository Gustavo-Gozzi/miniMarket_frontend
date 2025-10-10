const API_BASE_URL = 'http://127.0.0.1:5001';


async function postProduct() {
    const userId = localStorage.getItem('user_id');

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const quantity = document.getElementById("quantity").value;
    const id_seller = userId;

    if (!name || !price || !quantity || !id_seller) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    //const userId = getUserId();

    const url = `${API_BASE_URL}/product`;
    
    

    let body = {
        name: name,
        price: price,
        quantity: quantity,
        id_seller: id_seller
    };

    try {
        let api = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (api.ok) {
            let data = await api.json();
            console.log("Resposta API:", data);
            alert('Cadastro realizado com sucesso!');
            document.getElementById("form-cadastro").reset();
        } else {
            let errorApi = await api.json();
            console.error("Erro na API:", errorApi);
            alert("Erro no cadastro: " + (errorApi.erro || errorApi.message || "verifique os dados."));
        }
    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Erro ao conectar com o servidor.");
    }
}