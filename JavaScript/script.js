async function postData(){
    const name = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const password = document.getElementById("cadastro-senha").value;
    const phone = document.getElementById("cadastro-celular").value;
    const doc = document.getElementById("cadastro-documento").value;

    if (!name || !email || !password || !phone || !doc) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const url = 'http://127.0.0.1:5001/user';

    console.log(name, email, password, phone, doc)
    let body = {
            "name": name,
            "cnpj": doc, 
            "email": email,
            "celular": phone,
            "password": password
        };

    console.log(body)
    let api = await fetch(url,
        {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(body)

        });
    
    console.log("oi")
    console.log(api)
    let data = await api.json();
    console.log("Resposta API:", data)

}

async function getDados() {
    const num = document.getElementById("id").value;

    if (!num) {
        alert("Por favor, digite um ID para buscar.");
        return;
    }

    const url = 'http://127.0.0.1:5001/user/' + num;

    try {
        const api = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        
        if (!api.ok) {
            throw new Error(`Erro na API: Usuário não encontrado ou falha no servidor (Status: ${api.status})`);
        }
    
        const usuario = await api.json();
    
        document.getElementById("user-name").value = usuario?.Nome ?? "";
        document.getElementById("user-email").value = usuario?.["E-mail"] ?? "";
        document.getElementById("user-documento").value = usuario?.CNPJ ?? "";
        document.getElementById("user-phone").value = usuario?.Celular ?? "";
        console.log("Usuário encontrado:", usuario);

    } catch (error) {
        document.getElementById("user-name").value = "";
        document.getElementById("user-email").value = "";
        document.getElementById("user-documento").value = "";
        document.getElementById("user-phone").value = "";
        
        console.error("Ocorreu uma falha na busca:", error);
        alert("Não foi possível encontrar o usuário. Verifique o ID e tente novamente.");
    }
}