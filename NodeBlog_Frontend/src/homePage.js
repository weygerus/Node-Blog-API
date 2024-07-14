async function CallPostRegister(){
    window.location.href = 'postRegister.html'
}

async function fetchCategoriesByIds(categoryName) {
    try {

        const response = await fetch(
`http://localhost:3000/admin/categorias/testeIds/nome=${encodeURIComponent(categoryName)}`, {

            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: categoryName })
        })

        console.log('Teste da resposta do fetch categorias, linha 17: ', 'CategoryIds: ', categoryIds, 'Fetch response: ', response)

        if (!response.ok) {
            throw new Error('Houve um erro ao buscar as categorias!')
        }

        const categories = await response.json()

        return Array.isArray(categories) ? categories : []

    } catch (err) {

        console.log('Houve um erro ao buscar as categorias: ' + err)
        return []
    }
}

async function fetchPosts() {
    try {

        const response = await fetch('http://localhost:3000/admin/postagens')
        
        if (!response.ok) {

            throw new Error('Houve um erro ao listar as publicações, linha 42!')
        }
        
        const publications = await response.json()
        
        console.log('Teste de chamada dos posts: linha 47: ', publications.postagens)

        if (!publications || !publications.postagens) {

            throw new Error('Estrutura de dados inesperada!')
        }

        const posts = publications.postagens

        return publications.postagens
    }
    catch (err) {

        console.log('Houve um erro ao listar as publicações: ' + err)
        return []
    }
}

async function createPublicationCard(publications) {

    // Publication card -->

    const card = document.createElement('div')
    card.className = 'listCard'

    const title = document.createElement('h2')
    title.innerText = publications.title
    card.appendChild(title)

    const content = document.createElement('p')
    content.className = 'content'
    content.innerText = publications.content
    card.appendChild(content)

    
    for (let i = 0; i < publications.length; i++) {

        const categoryData = await getCategoryById(publications[i])

        
    }
    
    
    // const categoryName = categoryData.data.nome

    const category = document.createElement('h5')
    category.className = 'category'
    category.innerText = 'categoryName'
    card.appendChild(category)

    // Action buttons -->

    const editBtn = document.createElement('button')
    editBtn.className = 'editBtn'
    card.appendChild(editBtn)

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'deleteBtn'
    card.appendChild(deleteBtn)

    // Render -->
    card.innerHTML = `
        <h2 class="list-title">${publications.titulo}</h2>
        <p class="content">${publications.conteudo}</p>

        <h5 class="category">${'categoryName'}</h5>

        <div class="btnContainer">

            <button class="editBtn" onclick="getEditPost('${publications._id}')">
                <img src="images/icons/edit.svg" alt="edit-icon" width="18px">
            </button>

            <button class="deleteBtn" onclick="deletePost()">
                <img src="images/icons/delete.svg" alt="edit-icon" width="18px">
            </button>

        </div>
    `

    return card
}

async function getEditPost(publication) {

    const baseUrl = `http://localhost:3000/admin/postagens/getById/`
    
    const response = await fetch(baseUrl + `${publication}`)

    if (!response.ok) {

        const errorMessage = 'Publicação não encontrada!'

        window.location.href = `home.html?message=${errorMessage}`
    }
    else {

        const publication = await response.json()

        console.log('Teste de retorno do json: ', publication)

        window.location.href = 
                `editPost.html?id=${publication.data._id}`
    }   
}

async function editPost(postId) {

    event.preventDefault()

    const baseUrl = 'localhost:3000/admin/postagens/edit/'

    console.log('Teste de retorno do parametro: ', postId)

    const Titulo = document.getElementById('titulo').value;
    const Slug = document.getElementById('slug').value;
    const Descricao = document.getElementById('descricao').value;
    const Conteudo = document.getElementById('conteudo').value;
    const Categoria = document.getElementById('categoria').value;

    var data = {
      titulo: Titulo,
      slug: Slug,
      descricao: Descricao, 
      conteudo: Conteudo,
      categoria: Categoria
    }

    const fetchUrl = baseUrl + `${postId}`

    fetch(fetchUrl,{
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: json.stringify(data)
    })
    .then(response => {

        if (response.ok) {
            return response.json()
        } else {
            throw new Error('Erro ao editar a publicação!')
        }
    })

    .then(data => {
        console.log("Publicação editada com sucesso!", data)

        //window.location.href = `home.html?message=Publicação_editada_com_sucesso!&color=green&categoria=${Categoria}`
      })
      .catch(err => {
        console.log("Houve um erro ao editar a publicação!", err)
        
        //window.location.href = 'postRegister.html?message=Houve_um_erro_ao_editar_a_publicação&color=red'
      });
}

async function getCategoryById(category){

    const categoryId = category._id

    const fetchUrl = `http://localhost:3000/admin/categorias/getById/${categoryId}`

    const response = await fetch(fetchUrl)

    const categoryTeste = await response.json()

    console.log('Teste de recebimento dos dados da categoria: ', categoryTeste.data)

    if (!response.ok) {

        console.log('Erro ao buscar categoria da publicação!')
    }
    else {
    
        const category = await response.json()

        console.log('Teste de recebimento da categoria, linha 220: ', category)

        return category
    }
}

async function displayPublications() {
    try {
        const publicationsFetchResponse = await fetchPosts()

        if (publicationsFetchResponse != null) {

            const container = document.getElementById('publicationsContainer')
            container.innerHTML = ''

            publicationsFetchResponse.forEach(async publication => {

                console.log('Teste de retorno dos objetos publication: ', publication)

                const card = await createPublicationCard(publication)

                container.appendChild(card)
            });


        } else {
            console.log('Nenhuma publicação encontrada ou estrutura de dados inesperada:', publicationsFetchResponse)
        }

    } catch (err) {
        console.error('Erro ao listar as publicações:', err)
    }
}

function obterParametros() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return {
        message: urlParams.get('message'),
        color: urlParams.get('color')
    };
}

function exibirMensagemNoCard() {
    const params = obterParametros();
    if (params.message) {
        const decodedMessage = decodeURIComponent(params.message).replace(/_/g, ' ')
        const messageCard = document.getElementById('messageCard')
        
        document.getElementById('messageText').innerText = decodedMessage
        
        messageCard.style.display = 'block'
        messageCard.style.backgroundColor = params.color
    }
}

displayPublications()

exibirMensagemNoCard()