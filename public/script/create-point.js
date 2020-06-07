function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res=> res.json())
    .then(states => {
        for(const state of states){
            ufSelect.innerHTML += `<Option value="${state.id}">${state.nome}</Option>`
        }
    })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const ufvalue = event.target.value
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufvalue}/municipios`
    
    const stateinput = document.querySelector("input[name=state]")
    const IndexOfSelectedState = event.target.selectedIndex
    stateinput.value = event.target.options[IndexOfSelectedState].text

    citySelect.innerHTML = "<option value> selecione a cidade </option>" 
    citySelect.disabled = true

    fetch(url)
    .then(res=> res.json())
    .then(cities => {
        for(const city of cities){
            citySelect.innerHTML += `<Option value="${city.nome}">${city.nome}</Option>`
        }
        citySelect.disabled = false
    })

}

//itens de coleta - grid

const itenstocollet = document.querySelectorAll(".itens-grid li")

for(const itens of itenstocollet){
    document.addEventListener("click", handleselecteditem)
}
const colleteditens = document.querySelector("input[name=items]")

let selectedItens = []

function handleselecteditem() {
    const itemLi = event.target
    //adicionar ou remover uma classe de seleção com javascript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id
    //verificar se há itens selecionados no array, se sim
    // pegar os itens selecionados
    const alreadySelected = selectedItens.findIndex(item =>{
        const itemfound = item == itemId // verdadeiro ou falso
        return itemfound
    })
    

    //se ja estiver selecionado 
    if(alreadySelected >= 0){
        //tirar da seleção
        const filteredItens = selectedItens.filter(item =>{
            const itemdiIsdiferent = item != itemId // false
            return itemdiIsdiferent
            
        })
        selectedItens = filteredItens
    }
    else{
    //se nao estiver selecionado adicionar a seleção  
    selectedItens.push(itemId)  
    }
    //atualizar o campo escondido com os itens selecionados
    colleteditens.value = selectedItens
}
