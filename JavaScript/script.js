// Configuração da API
const API_BASE_URL = 'http://127.0.0.1:5001';

// Utility functions
function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function getUserId() {
    return localStorage.getItem('user_id');
}

function setUserId(userId) {
    localStorage.setItem('user_id', userId);
}

function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
}

// Função de cadastro (para página cadastro.html)
async function postData() {
    const name = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const password = document.getElementById("cadastro-senha").value;
    const phone = document.getElementById("cadastro-phone").value;
    const cnpj = document.getElementById("cadastro-documento").value;

    if (!name || !email || !password || !phone || !cnpj) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const url = `${API_BASE_URL}/user`;

    let body = {
        name: name,
        cnpj: cnpj,
        email: email,
        phone: phone, // Manter como string para sua validação
        password: password
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

// Função de login (para página cadastro.html)
async function realizarLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-senha').value.trim();
    
    if (!email || !password) {
        alert('Email e senha são obrigatórios!');
        return;
    }
    
    const url = `${API_BASE_URL}/login`;
    
    const body = {
        email: email,
        password: password
    };
    
    try {
        const api = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        if (api.ok) {
            const data = await api.json();
            setToken(data.access_token);
            setUserId(data.user_id);
            alert('Login realizado com sucesso!');
            
            // Redirecionar para página home após 1 segundo
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            const errorApi = await api.json();
            console.error("Erro no login:", errorApi);
            alert("Erro no login: " + (errorApi.erro || errorApi.message || "verifique os dados."));
        }
    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Erro ao conectar com o servidor.");
    }
}

// Função para buscar dados do usuário (para página visualizar.html)
async function getDados() {
    const num = document.getElementById("id").value;

    if (!num) {
        alert("Por favor, digite um ID para buscar.");
        return;
    }

    const url = `${API_BASE_URL}/user/` + num;
    const token = getToken();

    try {
        const api = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!api.ok) {
            const errorApi = await api.json();
            console.error("Erro na API:", errorApi);
            alert("Erro ao buscar usuário: " + (errorApi.erro || errorApi.message || "usuário não encontrado."));
            throw new Error(`Erro na API (Status: ${api.status})`);
        }

        const usuario = await api.json();

        // Preenche os campos
        document.getElementById("user-name").value = usuario?.name ?? "";
        document.getElementById("user-email").value = usuario?.email ?? "";
        document.getElementById("user-documento").value = usuario?.cnpj ?? "";
        document.getElementById("user-phone").value = usuario?.phone ?? "";

        console.log("Usuário encontrado:", usuario);

    } catch (error) {
        document.getElementById("user-name").value = "";
        document.getElementById("user-email").value = "";
        document.getElementById("user-documento").value = "";
        document.getElementById("user-phone").value = "";

        console.error("Ocorreu uma falha na busca:", error);
    }
}

// Função para carregar dados do usuário logado (para página home.html)
async function carregarDadosUsuario() {
    const userId = getUserId();
    const token = getToken();
    
    if (!userId || !token) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'cadastro.html';
        return;
    }
    
    const url = `${API_BASE_URL}/user/${userId}`;
    
    try {
        const api = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (!api.ok) {
            const errorApi = await api.json();
            console.error("Erro ao carregar dados:", errorApi);
            alert("Erro ao carregar dados: " + (errorApi.erro || errorApi.message || "tente novamente."));
            
            // Se erro de autenticação, redirecionar para login
            if (api.status === 401 || api.status === 403) {
                removeToken();
                window.location.href = 'cadastro.html';
            }
            return;
        }
        
        const user = await api.json();
        console.log('Dados recebidos da API:', user);
        
        // ===== PREENCHER CABEÇALHO DE BOAS-VINDAS =====
        const nomeElemento = document.getElementById('nome-titulo');
        const emailElemento = document.getElementById('email-titulo');
        
        if (nomeElemento) {
            nomeElemento.textContent = user.name || 'Usuário';
            console.log('Nome no cabeçalho atualizado para:', user.name);
        } else {
            console.error('Elemento nome-titulo não encontrado');
        }
        
        if (emailElemento) {
            emailElemento.textContent = user.email || 'email@exemplo.com';
            console.log('Email no cabeçalho atualizado para:', user.email);
        } else {
            console.error('Elemento email-titulo não encontrado');
        }
        
        // ===== PREENCHER CAMPOS DO FORMULÁRIO =====
        const campos = {
            'cadastro-nome': user.name,
            'cadastro-email': user.email,
            'cadastro-phone': user.phone,
            'cadastro-documento': user.cnpj
        };
        
        Object.entries(campos).forEach(([id, value]) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = value || '';
                console.log(`Campo ${id} preenchido com:`, value);
            } else {
                console.error(`Elemento ${id} não encontrado`);
            }
        });
        
        // Inicialmente desabilitar campos para edição
        desabilitarEdicao();
        
        console.log('Todos os dados carregados com sucesso!');
        
    } catch (error) {
        console.error("Falha na conexão:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

// Função para habilitar/desabilitar edição (para página home.html)
function habilitarEdicao() {
    const campos = ['cadastro-nome', 'cadastro-email', 'cadastro-senha', 'cadastro-phone', 'cadastro-documento'];
    campos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.disabled = false;
            elemento.style.backgroundColor = '#fff';
        }
    });
    
    const botaoEditar = document.getElementById('botao-editar');
    const botaoSalvar = document.getElementById('botao-salvar');
    
    if (botaoEditar) botaoEditar.style.display = 'none';
    if (botaoSalvar) botaoSalvar.style.display = 'block';
}

function desabilitarEdicao() {
    const campos = ['cadastro-nome', 'cadastro-email', 'cadastro-senha', 'cadastro-phone', 'cadastro-documento'];
    campos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.disabled = true;
            elemento.style.backgroundColor = '#f5f5f5';
        }
    });
    
    const botaoEditar = document.getElementById('botao-editar');
    const botaoSalvar = document.getElementById('botao-salvar');
    
    if (botaoEditar) botaoEditar.style.display = 'block';
    if (botaoSalvar) botaoSalvar.style.display = 'none';
}

// Função para salvar alterações do usuário (para página home.html)
async function salvarAlteracoes() {
    const userId = getUserId();
    const token = getToken();
    
    if (!userId || !token) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'cadastro.html';
        return;
    }
    
    const name = document.getElementById('cadastro-nome').value.trim();
    const email = document.getElementById('cadastro-email').value.trim();
    const password = document.getElementById('cadastro-senha').value.trim();
    const phone = document.getElementById('cadastro-phone').value.trim();
    const cnpj = document.getElementById('cadastro-documento').value.trim();
    
    if (!name || !email) {
        alert('Nome e email são obrigatórios!');
        return;
    }
    
    const url = `${API_BASE_URL}/user/${userId}`;
    
    const body = {
        name: name,
        email: email,
        phone: phone,
        cnpj: cnpj
    };
    
    // Adicionar senha apenas se foi preenchida
    if (password.trim()) {
        body.password = password;
    }
    
    try {
        const api = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        
        if (api.ok) {
            const data = await api.json();
            console.log("Atualizado com sucesso:", data);
            alert("Dados atualizados com sucesso!");
            
            desabilitarEdicao();
            // Limpar campo de senha após salvar
            document.getElementById('cadastro-senha').value = '';
            // Recarregar dados atualizados
            carregarDadosUsuario();
        } else {
            const errorApi = await api.json();
            console.error("Erro ao atualizar:", errorApi);
            alert("Erro na atualização: " + (errorApi.erro || errorApi.message || "verifique os dados."));
        }
    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Erro ao conectar com o servidor.");
    }
}

// Função para deletar conta (para página home.html)
async function deletarConta() {
    if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita!')) {
        return;
    }
    
    const userId = getUserId();
    const token = getToken();
    
    if (!userId || !token) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'cadastro.html';
        return;
    }
    
    const url = `${API_BASE_URL}/user/${userId}`;
    
    try {
        const api = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (api.ok) {
            alert("Conta deletada com sucesso!");
            removeToken();
            setTimeout(() => {
                window.location.href = 'cadastro.html';
            }, 2000);
        } else {
            const errorApi = await api.json();
            console.error("Erro ao deletar:", errorApi);
            alert("Erro ao deletar conta: " + (errorApi.erro || errorApi.message || "tente novamente."));
        }
    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Erro ao conectar com o servidor.");
    }
}

// Função para logout
function logout() {
    removeToken();
    alert('Logout realizado com sucesso!');
    setTimeout(() => {
        window.location.href = 'cadastro.html';
    }, 1000);
}

// Event listeners para diferentes páginas
document.addEventListener('DOMContentLoaded', function() {
    // Página cadastro.html
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            realizarLogin();
        });
    }
    
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro && window.location.pathname.includes('cadastro.html')) {
        const botaoCriarConta = document.getElementById('botao-criar-conta');
        if (botaoCriarConta) {
            botaoCriarConta.addEventListener('click', postData);
        }
    }
    
    // Página home.html
    if (window.location.pathname.includes('home.html')) {
        // Verificar se usuário está logado
        if (!getToken() || !getUserId()) {
            alert('Você precisa fazer login primeiro.');
            window.location.href = 'cadastro.html';
            return;
        }
        
        carregarDadosUsuario();
        
        const botaoEditar = document.getElementById('botao-editar');
        if (botaoEditar) {
            botaoEditar.addEventListener('click', habilitarEdicao);
        }
        
        const botaoSalvar = document.getElementById('botao-salvar');
        if (botaoSalvar) {
            botaoSalvar.addEventListener('click', salvarAlteracoes);
        }
        
        const botaoDeletar = document.getElementById('botao-deletar');
        if (botaoDeletar) {
            botaoDeletar.addEventListener('click', deletarConta);
        }
    }
    
    // Página visualizar.html
    if (window.location.pathname.includes('visualizar.html')) {
        const botaoVerDados = document.getElementById('botao-criar-conta');
        if (botaoVerDados) {
            botaoVerDados.addEventListener('click', getDados);
        }
    }
});

// Funções extras para atualizar e deletar na página visualizar (caso você queira adicionar)
async function updateDados() {
    const num = document.getElementById("id").value;
    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const phone = document.getElementById("user-phone").value;
    const cnpj = document.getElementById("user-documento").value;
    const token = getToken();

    if (!num || !name || !email || !phone || !cnpj) {
        alert("Por favor, preencha todos os campos para atualizar.");
        return;
    }

    const url = `${API_BASE_URL}/user/` + num;

    let body = {
        name: name,
        cnpj: cnpj,
        email: email,
        phone: phone
    };

    try {
        let api = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (api.ok) {
            let data = await api.json();
            console.log("Atualizado com sucesso:", data);
            alert("Usuário atualizado com sucesso!");
        } else {
            let errorApi = await api.json();
            console.error("Erro ao atualizar:", errorApi);
            alert("Erro na atualização: " + (errorApi.erro || errorApi.message || "verifique os dados."));
        }
    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Erro ao conectar com o servidor.");
    }
}

async function deleteDados() {
    const num = document.getElementById("id").value;
    const token = getToken();

    if (!num) {
        alert("Por favor, digite um ID para excluir.");
        return;
    }

    const url = `${API_BASE_URL}/user/` + num;

    try {
        let api = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (api.ok) {
            alert("Usuário excluído com sucesso!");
            document.getElementById("user-name").value = "";
            document.getElementById("user-email").value = "";
            document.getElementById("user-documento").value = "";
            document.getElementById("user-phone").value = "";
        } else {
            let errorApi = await api.json();
            console.error("Erro ao excluir:", errorApi);
            alert("Erro na exclusão: " + (errorApi.erro || errorApi.message || "usuário não encontrado."));
        }
    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Erro ao conectar com o servidor.");
    }
}