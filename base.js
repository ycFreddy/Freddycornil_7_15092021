
class urlParams {
  static returnUrlRequete () {
    return new URL(document.location.href).searchParams.get('requete')
  }
}

const rechercher = (value) => {
  const resultIngredient = recipes.filter(({ ingredients }) => ingredients.find(({ ingredient }) => ingredient === value))
  const resultUstensile = recipes.filter(({ ustensils }) => ustensils.includes(value))
  const resultNomRecette = recipes.filter(({ name }) => name === value)
  const resultAppareil = recipes.filter(({ appliance }) => appliance === value)
  if (resultIngredient.length > 0) return resultIngredient
  if (resultUstensile.length > 0) return resultUstensile
  if (resultNomRecette.length > 0) return resultNomRecette
  if (resultAppareil.length > 0) return resultAppareil
}

//console.log(rechercher(urlParams.returnUrlRequete()))

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

function autocomplete (inp, arr, type, color) {
  let currentFocus
  inp.addEventListener('click', () => {
    closeAllLists()
    const a = document.createElement('div')
    a.id = inp.id + 'autocomplete-list'
    a.className = 'autocomplete-items p-2 ' + color + ' text-light'
    
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
    const val = inp.value
    closeAllLists()
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
    b.className = 'col-4'
    b.innerHTML = '<strong>' + i.substr(0, val.length) + '</strong>'
    b.innerHTML += i.substr(val.length)
    b.innerHTML += "<input type='hidden' value='" + i + "'>"
    b.addEventListener('click', (e) => {
      inp.value = b.getElementsByTagName('input')[0].value
      closeAllLists()
    })
    d.appendChild(b)
  }
  inp.addEventListener('keydown', (e) => {
    let x = document.getElementById(inp.id + 'autocomplete-list')
    if (x) x = x.getElementsByClassName('col-4')
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
      if (el !== i && el !== inp) {
        i.parentNode.removeChild(i)
      }
    }
  }
}
autocomplete(document.getElementById('ingredients'), listIngredients, 'ingredients', 'bg-primary')
autocomplete(document.getElementById('appareils'), listAppareils, 'appareils', 'bg-danger')
autocomplete(document.getElementById('ustensiles'), listUstensiles, 'ustensiles', 'bg-success')
