import { recipes } from './recipes.js'

const rechercher = (value) => {
  const reg = new RegExp('\\b' + value + '\\b', 'i')
  // let reg = new RegExp (value, 'i')
  const resultIngredient = recipes.filter(({ ingredients }) => ingredients.find(({ ingredient }) => ingredient.match(reg)))
  const resultUstensile = recipes.filter(({ ustensils }) => ustensils.find(el => el.match(reg)))
  const resultNomRecette = recipes.filter(({ name }) => name.match(reg))
  const resultAppareil = recipes.filter(({ appliance }) => appliance.match(reg))
  return new Set(resultIngredient.concat(resultUstensile).concat(resultNomRecette).concat(resultAppareil))
}

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
  const parent = document.getElementById('tags')
  parent.innerHTML = ''
  for (const i of data.ingredients) {
    const tag = document.createElement('div')
    tag.className = 'alert d-flex align-items-center justify-content-between m-2 p-02 bg-primary text-white'
    tag.innerHTML = i + '<button type="button" class="close" data-dismiss="alert"><span><i class="text-white far fa-times-circle pl-2"></i></span></button>'
    parent.appendChild(tag)
    tag.addEventListener('click', () => {
      tabTags(i, 'ingredients', 'del')
    })
  }
  for (const a of data.appareils) {
    const tag = document.createElement('div')
    tag.className = 'alert d-flex align-items-center justify-content-between m-2 p-02 bg-success text-white'
    tag.innerHTML = a + '<button type="button" class="close" data-dismiss="alert"><span><i class="text-white far fa-times-circle pl-2"></i></span></button>'
    parent.appendChild(tag)
    tag.addEventListener('click', () => {
      tabTags(a, 'appareils', 'del')
    })
  }
  for (const u of data.ustensiles) {
    const tag = document.createElement('div')
    tag.className = 'alert d-flex align-items-center justify-content-between m-2 p-02 bg-danger text-white'
    tag.innerHTML = u + '<button type="button" class="close" data-dismiss="alert"><span><i class="text-white far fa-times-circle pl-2"></i></span></button>'
    parent.appendChild(tag)
    tag.addEventListener('click', () => {
      tabTags(u, 'ustensiles', 'del')
    })
  }
  let l
  let ligne = 0
  const res = document.getElementById('resultats')
  res.innerHTML = ''
  for (const z in data) {
    data[z].forEach(e => {
      rechercher(e).forEach(el => {
        if ((ligne % 3) === 0) {
          l = document.createElement('div')
          l.name = el.id + 'row'
          l.className = 'row'
          res.appendChild(l)
        }
        ligne++
        const r = document.createElement('div')
        r.className = 'col-4 p-2'
        l.appendChild(r)
        afficheCarte(el, r)
      })
    })
  }
}

const tabTag = []
tabTag.ingredients = []
tabTag.appareils = []
tabTag.ustensiles = []
const tabTags = (value, type, op) => {
  if (op === 'add') {
    tabTag[type].push(value)
  } else {
    tabTag[type].splice(tabTag[type].findIndex(e => e === value), 1)
  }
  ProcessMenuTags(tabTag)
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
        addCol(d, i, '', type)
      }
    }
  })
  inp.addEventListener('input', () => {
    closeAllLists()
    document.getElementById(inp.id + 'chevron').classList.add('up-chevron')
    document.getElementById(inp.id + 'chevron').classList.remove('down-chevron')
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
        addCol(d, i, val, type)
      }
    }
  })
  const addCol = (d, i, val, type) => {
    const b = document.createElement('div')
    b.className = 'col w-400 colonne'
    b.innerHTML = '<strong>' + i.substr(0, val.length) + '</strong>'
    b.innerHTML += i.substr(val.length)
    b.innerHTML += '<input type="hidden" value="' + i + '">'
    b.addEventListener('click', (e) => {
      inp.value = b.getElementsByTagName('input')[0].value
      tabTags(inp.value, type, 'add')
      closeAllLists()
    })
    d.appendChild(b)
  }
  inp.addEventListener('keydown', (e) => {
    let x = document.getElementById(inp.id + 'autocomplete-list')
    if (x) x = x.getElementsByClassName('colonne')
    if ((e.key === 'ArrowRight')) {
      currentFocus++
      addActive(x)
    } else if (e.key === 'ArrowDown') {
      currentFocus = currentFocus + 3
      addActive(x)
    } else if (e.key === 'ArrowLeft') {
      currentFocus--
      addActive(x)
    } else if (e.key === 'ArrowUp') {
      currentFocus = currentFocus - 3
      addActive(x)
    } else if (e.key === 'Enter') {
      if (currentFocus > -1) {
        if (x) x[currentFocus].click()
        e.preventDefault()
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

const select = (data) => {
  const listIngredients = []
  const listUstensiles = []
  const listAppareils = []
  const listRecettes = []

  for (const i of data) {
    for (const j of i.ingredients) {
      if (!listIngredients.includes(j.ingredient)) listIngredients.push(j.ingredient)
    }
    for (const j of i.ustensils) {
      if (!listUstensiles.includes(j)) listUstensiles.push(j)
    }
    if (!listAppareils.includes(i.appliance)) listAppareils.push(i.appliance)
    if (!listRecettes.includes(i.name)) listRecettes.push(i.name)
  }
  autocomplete(document.getElementById('ingredients'), listIngredients, 'ingredients', 'bg-primary')
  autocomplete(document.getElementById('appareils'), listAppareils, 'appareils', 'bg-success')
  autocomplete(document.getElementById('ustensiles'), listUstensiles, 'ustensiles', 'bg-danger')
}

const requete = document.getElementById('requete')
requete.addEventListener('input', () => {
  let l
  let ligne = 0
  const parent = document.getElementById('resultats')
  parent.innerHTML = ''
  if (requete.value.length > 2) {
    rechercher(requete.value).forEach(el => {
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
    select(rechercher(requete.value))
  } else {
    select(recipes)
  }
})
if (requete.value === '') select(recipes)
requete.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault() }
})
