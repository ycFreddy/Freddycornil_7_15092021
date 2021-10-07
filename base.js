/**
 * importe l'objet recettes
 */
import { recipes } from './recipes.js'

/**
 * Recherche dans l'objet recettes la valeur en paramètre
 * @param {*} value nom, ingrédient, ustensile ou appareil
 * @returns return un objet contenant les recette correspondantes à la recherche sans doublons
 */
 const rechercher = (value) => {
  const reg = new RegExp('\\b' + value + '\\b', 'i')
  const resultNomRecette = []
  const resultIngredient = []
  const resultUstensile = []
  const resultAppareil = []
  for (const i of recipes) {
    if (i.name.match(reg)) { resultNomRecette.push(i) }
    if (i.appliance.match(reg)) { resultAppareil.push(i) }
    for (const j of i.ingredients) {
      if (j.ingredient.match(reg)) { resultIngredient.push(i) }
    }
    for (const k of i.ustensils) {
      if (k.match(reg)) { resultUstensile.push(i) }
    }
  }
  return new Set(resultIngredient.concat(resultUstensile).concat(resultNomRecette).concat(resultAppareil))
}

/**
 * Affiche les vignettes recettes
 * @param {*} el Recette
 * @param {*} parent element parent auquel la vignette est rattachée
 */
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

/**
 * Affiche le menu tag
 * @param {*} data tableau de rectte
 */
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
  const resdata = []
  for (const z in data) {
    data[z].forEach(e => {
      rechercher(e).forEach(el => {
        resdata.push(el)
      })
    })
  }
  const result = [...new Set(resdata)]
  afficheListe(result)
  if (result.length === 0) { select(recipes) } else { select(result) }
}

/**
 * Liste déroulantes de selection
 * @param {*} inp input du formulaire
 * @param {*} arr liste de recherche
 * @param {*} type type de recherche
 * @param {*} color couleur de l'input
 */
const autocomplete = (inp, arr, type, color) => {
  let currentFocus
  inp.addEventListener('click', () => {
    addRow(inp, arr, '', '', type, 'click')
  })
  inp.addEventListener('input', () => {
    const val = inp.value
    if (!val) { inp.click() }
    const reg = new RegExp(val, 'i')
    addRow(inp, arr, reg, val, type, 'input')
  })
  const addRow = (inp, arr, reg, val, type, event) => {
    closeAllLists()
    document.getElementById(inp.id + 'chevron').classList.add('up-chevron')
    document.getElementById(inp.id + 'chevron').classList.remove('down-chevron')
    const container = document.createElement('div')
    container.id = inp.id + 'autocomplete-list'
    container.className = 'autocomplete-items p-2 ' + color + ' text-light'
    if (event === 'click') container.className += ' down-items-list'
    inp.parentNode.appendChild(container)
    currentFocus = -1
    let row = 0
    let ligne
    for (const i of arr) {
      if (reg) {
        if (i.match(reg)) {
          if ((row % 3) === 0) {
            ligne = document.createElement('div')
            ligne.className = 'row m-0'
            container.appendChild(ligne)
          }
          row++
          addCol(ligne, i, val, type)
        }
      } else {
        if ((row % 3) === 0) {
          ligne = document.createElement('div')
          ligne.className = 'row m-0'
          container.appendChild(ligne)
        }
        row++
        addCol(ligne, i, val, type)
      }
    }
  }
  const addCol = (ligne, i, val, type) => {
    const col = document.createElement('div')
    col.className = 'col w-400 colonne'
    col.innerHTML = i
    col.innerHTML += '<input type="hidden" value="' + i + '">'
    col.addEventListener('click', (e) => {
      tabTags(i, type, 'add')
      closeAllLists()
    })
    ligne.appendChild(col)
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
  const rech = document.getElementById('rechercher')
  rech.addEventListener('click', (e) => {
    closeAllLists(e.target)
  })
  const chev = document.getElementsByClassName('chevron')
  for (const c of chev) {
    c.addEventListener('click', (e) => {
      closeAllLists(e.target)
    })
  }
}

/**
 * Rempli les fomrulaires de selection
 * @param {*} data liste de selection
 */
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

/**
 * Affiche le liste de recette
 * @param {*} data tableau de recette
 */
const afficheListe = (data) => {
  let ligne
  let row = 0
  const res = document.getElementById('resultats')
  res.innerHTML = ''
  data.forEach(elmt => {
    if ((row % 3) === 0) {
      ligne = document.createElement('div')
      ligne.name = elmt.id + 'row'
      ligne.className = 'row'
      res.appendChild(ligne)
    }
    row++
    const col = document.createElement('div')
    col.className = 'col-4 p-2'
    ligne.appendChild(col)
    afficheCarte(elmt, col)
  })
}

/**
 * Initialisation de la selction
 */
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

/**
* Requete principale
*/
const requete = document.getElementById('requete')
requete.addEventListener('input', (e) => {
  if (requete.value.length > 2) {
    afficheListe(rechercher(requete.value))
    select(rechercher(requete.value))
  } else {
    select(recipes)
  }
})

if (requete.value === '') select(recipes)
requete.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault() }
})

requete.addEventListener('click', (e) => {
  select(recipes)
})
