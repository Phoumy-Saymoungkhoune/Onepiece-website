# One Piece Characters
Een interactieve single-page webapplicatie over personages uit One Piece.
Gebouwd met vanilla JavaScript en Vite, gebruikmakend van de One Piece API.

## Functionaliteiten
- Personages ophalen van de One Piece API
- Zoeken op naam
- Filteren op status, crew en devil fruit
- Sorteren op naam en bounty
- Favorieten opslaan tussen sessies
- Dark/light mode met localStorage
- Animaties via IntersectionObserver

## Gebruikte API
https://api-onepiece.com/en/documentation/13-character (link website)
https://api.api-onepiece.com/v2/characters/en (API)

## Technische vereisten

### DOM Manipulatie
- **Elementen selecteren:** main.js - lijn 6-11 (`document.querySelector`)
- **Elementen manipuleren:** main.js - lijn 72 (`karaktersContainer.innerHTML`)
- **Events koppelen:** main.js - lijn 62 (`addEventListener`)

### Modern JavaScript
- **Constanten:** main.js - lijn 4 (`const API_URL`)
- **Template literals:** main.js - lijn 52-61 (`kaart.innerHTML = \`...\``)
- **Iteratie over arrays:** main.js - lijn 78 (`forEach`)
- **Array methodes:** main.js - lijn 93 (`filter`, `map`, `sort`)
- **Arrow functions:** main.js - lijn 47 (`const maakKaraktersKaart = (karakter) => {`)
- **Ternary operator:** main.js - lijn 53 (`karakter.status ?? 'Unknown'`)
- **Callback functions:** main.js - lijn 62 (`addEventListener('click', () => {`)
- **Promises:** main.js - lijn 163 (`fetch` returns a Promise)
- **Async & Await:** main.js - lijn 161 (`const haalKaraktersOp = async ()`)
- **Observer API:** main.js - lijn 243 (`new IntersectionObserver`)

### Data & API
- **Fetch:** main.js - lijn 165 (`await fetch(API_URL)`)
- **JSON manipuleren:** main.js - lijn 172 (`await response.json()`)

### Opslag & Validatie
- **Formuliervalidatie:** main.js - lijn 118 (`zoekbalk.value.trim()`)
- **LocalStorage:** main.js - lijn 184 (`localStorage.setItem`)

### Tooling
- Project opgezet met **Vite**
