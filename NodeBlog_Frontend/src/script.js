
async function getCategoryByName(categoryName) {

  const baseUrl = 'http://localhost:3000/admin/categoryByName/'

  const categoryId = await fetch(baseUrl + `${categoryName}`)

  return categoryId
}

function CreatePost(){

    event.preventDefault()

    const baseUrl = 'http://localhost:3000/admin/postagens/nova';

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
    
    fetch(baseUrl,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {

          return response.json()
        } else {

          throw new Error('Erro ao criar a publicação')
        }
      })

      .then(data => {
        console.log("Publicação cadastrado com sucesso!", data)

        window.location.href = `home.html?message=Publicação_criada_com_sucesso!&color=green&categoria=${Categoria}`
      })
      .catch(err => {
        console.log("Houve um erro ao cadastrar a publicação!", err)
        
        window.location.href = 'postRegister.html?message=Houve_um_erro_ao_criar_a_publicação&color=red'
      });
}