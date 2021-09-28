/* eslint-disable no-trailing-spaces */
class urlParams {
  static returnTabRequete () {
    const req = new URL(document.location.href).searchParams.get('requete')
    const reqIngredients = new URL(document.location.href).searchParams.get('ingredients')
    const reqAppareils = new URL(document.location.href).searchParams.get('appareils')
    const reqUstensiles = new URL(document.location.href).searchParams.get('ustensiles')
    if (reqIngredients) { return reqIngredients }
    if (req) { return req }
    if (reqAppareils) { return reqAppareils }
    if (reqUstensiles) { return reqUstensiles }
  }
  
  static returnUrlRequete () {
    const type = []
    const urlIngredients = new URL(document.location.href).searchParams.get('ingredients')
    const urlAppareils = new URL(document.location.href).searchParams.get('appareils')
    const urlUstensiles = new URL(document.location.href).searchParams.get('ustensiles')
    if (urlIngredients) {
      type.push({ type: 'ingredient', valeur: urlIngredients })
      return type
    }
    if (urlAppareils) {
      type.push({ type: 'appareil', valeur: urlAppareils })
      return type
    }
    if (urlUstensiles) {
      type.push({ type: 'ustensile', valeur: urlUstensiles })
      return type
    }
  }
}

const rechercher = (value) => {
  const resultIngredient = recipes.filter(({ ingredients }) => ingredients.find(({ ingredient }) => ingredient === value))
  const resultUstensile = recipes.filter(({ ustensils }) => ustensils.includes(value))
  let resultNomRecette = recipes.filter(({ name }) => name.toUpperCase().search(value.toUpperCase()) !== -1)
  const resultAppareil = recipes.filter(({ appliance }) => appliance === value)
  if (resultIngredient.length > 0) return resultIngredient
  if (resultUstensile.length > 0) return resultUstensile
  if (resultAppareil.length > 0) return resultAppareil
  if (resultNomRecette.length > 0) { return resultNomRecette } else { resultNomRecette = []; return resultNomRecette }
}

let ligne = 0
let l
const parent = document.getElementById('resultats')
const afficheCarte = (el, parent) => {
  const carte = document.createElement('div')
  carte.className = 'card'
  parent.appendChild(carte)
  const carteImg = document.createElement('img')
  carteImg.className = 'card-img-top'
  carteImg.src = 'public/images/img.jpg'
  carte.appendChild(carteImg)
  const carteBody = document.createElement('div')
  carteBody.className = 'card-body'
  carte.appendChild(carteBody)
  const carteTitre = document.createElement('h5')
  carteTitre.className = 'card-title'
  carteTitre.innerHTML = '<div class="d-flex justify-content-between m-0 p-0"><p>' + el.name + '</p><p class="text-nowrap font-weight-bold"><i class="far fa-clock pr-2"></i>' + el.time + 'min</p></div>'
  carteBody.appendChild(carteTitre)
  const carteTexte = document.createElement('div')
  carteTexte.className = 'card-text d-flex justify-content-between carte'
  carteBody.appendChild(carteTexte)
  const listeIngredients = document.createElement('div')
  carteTexte.appendChild(listeIngredients)
  listeIngredients.className = 'carte'
  el.ingredients.forEach(val => {
    if (val.quantity === undefined) val.quantity = ''
    if (val.unit === undefined) val.unit = ''
    listeIngredients.innerHTML += '<p><strong>' + val.ingredient + '</strong>: ' + val.quantity + ' ' + val.unit + '</p>'
  })
  carteTexte.innerHTML += '<div class="col-6 m-0 p-0 pl-2 description">' + el.description + '</div>'
}

// Affiche de le menu de tags uniques
const ProcessMenuTags = (data) => {
  const parent = document.getElementById('rechercher')
  const tag = document.createElement('div')
  tag.className = 'alert d-flex align-items-center justify-content-between m-2 p-02'
  if (data[0].type === 'ingredient') { tag.className += ' bg-primary text-white' }
  if (data[0].type === 'appareil') { tag.className += ' bg-success text-white' }
  if (data[0].type === 'ustensile') { tag.className += ' bg-danger text-white' }
  tag.innerHTML = data[0].valeur
  tag.innerHTML += '<button type="button" class="close" data-dismiss="alert"><span><i class="text-white far fa-times-circle pl-2"></i></span></button>'
  parent.appendChild(tag)
  tag.addEventListener('click', () => {
    document.location.href = 'index.html'
  })
}

if (urlParams.returnTabRequete()) {
  if (urlParams.returnUrlRequete()) {
    ProcessMenuTags(urlParams.returnUrlRequete())
  }
  rechercher(urlParams.returnTabRequete()).forEach(el => {
    if ((ligne % 3) === 0) {
      l = document.createElement('div')
      l.name = el.id + 'row'
      l.className = 'row'
      parent.appendChild(l)
    }
    ligne++
    const r = document.createElement('div')
    r.className = 'col-4 p-2'
    l.appendChild(r)
    afficheCarte(el, r)
  })
}

const listIngredients = []
const listUstensiles = []
const listAppareils = []
const listRecettes = []

for (const i of recipes) {
  for (const j of i.ingredients) {
    if (!listIngredients.includes(j.ingredient)) listIngredients.push(j.ingredient)
  }
  for (const j of i.ustensils) {
    if (!listUstensiles.includes(j)) listUstensiles.push(j)
  }
  if (!listAppareils.includes(i.appliance)) listAppareils.push(i.appliance)
  if (!listRecettes.includes(i.name)) listRecettes.push(i.name)
}

const autocomplete = (inp, arr, type, color) => {
  let currentFocus  
  inp.addEventListener('click', () => {    
    closeAllLists()
    document.getElementById(inp.id + 'chevron').classList.add('up-chevron')
    document.getElementById(inp.id + 'chevron').classList.remove('down-chevron')
    const a = document.createElement('div')
    a.id = inp.id + 'autocomplete-list'
    a.className = 'autocomplete-items p-2 ' + color + ' text-light down-items-list'
    inp.parentNode.appendChild(a) 
    currentFocus = -1
    let row = 0
    let d
    if (inp.value) {
      d = document.createElement('div')
      d.name = type + 'row'
      d.className = 'row m-0'
      a.appendChild(d)
      addCol(d, inp.value, inp.value)
    } else {
      for (const i of arr) {
        if ((row % 3) === 0) {
          d = document.createElement('div')
          d.name = type + 'row'
          d.className = 'row m-0'
          a.appendChild(d)
        }
        row++
        addCol(d, i, '')
      }
    }
  })
  inp.addEventListener('input', () => {    
    closeAllLists()
    const val = inp.value
    const a = document.createElement('div')
    a.id = inp.id + 'autocomplete-list'
    a.className = 'autocomplete-items p-2 ' + color + ' text-light'
    inp.parentNode.appendChild(a)
    if (!val) { inp.click() }
    currentFocus = -1
    let row = 0
    let d
    for (const i of arr) {
      if (i.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        if ((row % 3) === 0) {
          d = document.createElement('div')
          d.className = 'row m-0'
          a.appendChild(d)
        }
        row++
        addCol(d, i, val)
      }
    }
  })
  const addCol = (d, i, val) => {
    const b = document.createElement('div')
    b.className = 'col w-400 colonne'
    b.innerHTML = '<strong>' + i.substr(0, val.length) + '</strong>'
    b.innerHTML += i.substr(val.length)
    b.innerHTML += '<input type="hidden" value="' + i + '">'
    b.addEventListener('click', (e) => {
      inp.value = b.getElementsByTagName('input')[0].value
      inp.form.submit()
      closeAllLists()
    })
    d.appendChild(b)
  }
  inp.addEventListener('keydown', (e) => {
    let x = document.getElementById(inp.id + 'autocomplete-list')
    if (x) x = x.getElementsByClassName('colonne')
    if ((e.keyCode === 39)) {
      currentFocus++
      addActive(x)
    } else if (e.keyCode === 40) {
      currentFocus = currentFocus + 3
      addActive(x)
    } else if (e.keyCode === 37) {
      currentFocus--
      addActive(x)
    } else if (e.keyCode === 38) {
      currentFocus = currentFocus - 3
      addActive(x)
    } else if (e.keyCode === 13) {
      if (currentFocus > -1) {
        if (x) x[currentFocus].click()
      }
    }
  })

  const addActive = (x) => {
    if (!x) return false
    removeActive(x)
    if (currentFocus >= x.length) currentFocus = 0
    if (currentFocus < 0) currentFocus = (x.length - 1)
    x[currentFocus].classList.add('autocomplete-active')
  }
  const removeActive = (x) => {
    for (const i of x) {
      i.classList.remove('autocomplete-active')
    }
  }
  const closeAllLists = (el) => {    
    const x = document.getElementsByClassName('autocomplete-items')
    for (const i of x) {
      document.getElementById(i.id.replace('autocomplete-list', '') + 'chevron').classList.remove('up-chevron') 
      document.getElementById(i.id.replace('autocomplete-list', '') + 'chevron').classList.add('down-chevron')      
      if (el !== i && el !== inp) {
        i.parentNode.removeChild(i)
      }
    }
  }
  const sb = document.getElementById('rechercher')
  sb.addEventListener('click', (e) => {
    closeAllLists(e.target)
  })
}
autocomplete(document.getElementById('ingredients'), listIngredients, 'ingredients', 'bg-primary')
autocomplete(document.getElementById('appareils'), listAppareils, 'appareils', 'bg-success')
autocomplete(document.getElementById('ustensiles'), listUstensiles, 'ustensiles', 'bg-danger')

