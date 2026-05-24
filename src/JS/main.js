'use strict';

// API URL
const API_URL = 'https://api.api-onepiece.com/v2/characters/en';

// DOM elementen selecteren
const karaktersContainer = document.querySelector('#karakters-container');
const zoekbalk = document.querySelector('#zoekbalk');
const sorteerSelect = document.querySelector('#sorteer');

// Gewenste karakters
const gewensteKarakters = [
    // Piraten (20)
    'Monkey D Luffy', 'Roronoa Zoro', 'Sanji',
    'Nico Robin', 'Jinbe', 'Brook', 'Shanks',
    'Marchall D. Teach / Barbe Noire', 'Edward Newgate / Barbe Blanche',
    'Portgas D. Ace', 'Don Quijote Doflamingo', 'Crocodile',
    'Kaido', 'Charlotte Linlin / Big Mom', 'Eustass Kidd',
    'Trafalgar D. Water Law', 'Baggy / Le Clown',
    'Cavendish', 'Bartolomeo', 'Dracule Mihawk',
    // Revolutionaire Leger (2)
    'Sabo', 'Monkey D. Dragon'
];

// Alle karakters opslaan voor later filteren
let alleKarakters = [];

// Karakter kaart aanmaken
const maakKaraktersKaart = (karakter) => {
    const kaart = document.createElement('article');
    kaart.classList.add('karakter-kaart');

    kaart.innerHTML = `
        <div class="kaart-info">
            <h2>${karakter.name}</h2>
            <p><strong>Status:</strong> ${karakter.status ?? 'Unknown'}</p>
            <p><strong>Age:</strong> ${karakter.age ?? 'Unknown'}</p>
            <p><strong>Size:</strong> ${karakter.size ?? 'Unknown'}</p>
            <p><strong>Crew:</strong> ${karakter.crew?.name ?? 'Unknown'}</p>
            <p><strong>Bounty:</strong> ${karakter.bounty ?? 'Unknown'}</p>
            <p><strong>Devil Fruit:</strong> ${karakter.fruit?.name ?? 'None'}</p>
            <button class="favoriet-knop" data-id="${karakter.id}">⭐ Add to favorites</button>
        </div>
    `;

    // Event aan favoriet knop koppelen
    const favorietKnop = kaart.querySelector('.favoriet-knop');
    favorietKnop.addEventListener('click', () => {
        voegToeAanFavorieten(karakter);
    });

    return kaart;
};

// Karakters tonen in de DOM
const toonKarakters = (karakters) => {
    karaktersContainer.innerHTML = '';

    if (karakters.length === 0) {
        karaktersContainer.innerHTML = '<p>No characters found.</p>';
        return;
    }

    karakters.forEach(karakter => {
        const kaart = maakKaraktersKaart(karakter);
        karaktersContainer.appendChild(kaart);
    });
};

// Data ophalen van de API
const haalKaraktersOp = async () => {
    try {
        karaktersContainer.innerHTML = '<p>Loading characters...</p>';

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Something went wrong: ${response.status}`);
        }

        const data = await response.json();
        alleKarakters = data.filter(k => gewensteKarakters.includes(k.name));

        toonKarakters(alleKarakters);

    } catch (fout) {
        karaktersContainer.innerHTML = `<p>Error: ${fout.message}</p>`;
        console.error('Fout bij ophalen:', fout);
    }
};

// App starten
window.addEventListener('load', () => {
    haalKaraktersOp();
});