async function postData(){
    const name = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const password = document.getElementById("cadastro-senha").value;
    const phone = document.getElementById("cadastro-celular").value;
    const doc = document.getElementById("cadastro-documento").value;

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
    
    

    if (api.ok) {
        let data = await api.json();
        console.log(data);
        alert('Cadastro realizado com sucesso!')
        document.getElementById("form-cadastro").reset();
        console.log("Resposta API:", data);
    } else {
    
    
        let errorApi = await api.json();
        let errors = errorApi.data.errors;
    }

}

async function getDados() {
    const num = document.getElementById("id").value;

    const url = 'http://127.0.0.1:5001/user/' + num;

    let api = await fetch(url, {
        method: "GET",
        headers: {
               "Content-Type": "application/json"
        }
    })

    
    let usuario = await api.json()
    console.log(usuario)
    document.getElementById("user-name").value = usuario.Nome;
    document.getElementById("user-email").value = usuario["E-mail"];
    document.getElementById("user-documento").value = usuario.CNPJ;
    document.getElementById("user-phone").value = usuario.Celular;
    
    
}