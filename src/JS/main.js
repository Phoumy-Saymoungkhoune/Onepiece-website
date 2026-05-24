'use strict';

// API URL
const API_URL = 'https://api.api-onepiece.com/v2/characters/en';

// DOM elementen selecteren
const karaktersContainer = document.querySelector('#karakters-container');
const zoekbalk = document.querySelector('#zoekbalk');
const sorteerSelect = document.querySelector('#sorteer');
const filterStatus = document.querySelector('#filter-status');
const filterFruit = document.querySelector('#filter-fruit');
const filterCrew = document.querySelector('#filter-crew');

// Gewenste karakters
const gewensteIds = [1, 2, 54, 59, 81, 85, 96, 97, 187, 188, 247, 258, 259, 290, 365, 662, 661, 687, 690, 761];

// Foto's per karakter id
const karakterFotos = {
    1: '/src/assets/Luffy.jpg',
    2: '/src/assets/Zoro.jpg',
    54: '/src/assets/Law.jpg',
    59: '/src/assets/Kid.jpg',
    81: '/src/assets/Mihawk.jpg',
    85: '/src/assets/Shanks.jpg',
    96: '/src/assets/BigMom.jpg',
    97: '/src/assets/Katakuri.jpg',
    187: '/src/assets/Kaido.jpg',
    188: '/src/assets/King.jpg',
    247: '/src/assets/Teach.jpg',
    258: '/src/assets/Roger.jpg',
    259: '/src/assets/Rayleigh.jpg',
    290: '/src/assets/Ace.jpg',
    365: '/src/assets/Doflamingo.jpg',
    662: '/src/assets/Sabo.jpg',
    661: '/src/assets/Dragon.jpg',
    687: '/src/assets/Kuzan.jpg',
    690: '/src/assets/Kuma.jpg',
    761: '/src/assets/Vegapunk.jpg'
};

// Alle karakters opslaan voor later filteren
let alleKarakters = [];

// Karakter kaart aanmaken
const maakKaraktersKaart = (karakter) => {
    const kaart = document.createElement('article');
    kaart.classList.add('karakter-kaart');

    kaart.innerHTML = `
        <div class="kaart-info">
            <img src="${karakterFotos[karakter.id] ?? ''}" alt="${karakter.name}" class="karakter-foto">
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
    observeerKaartjes();
};

// Crew filter vullen vanuit de data
const vulCrewFilter = (karakters) => {
    filterCrew.innerHTML = '<option value="all">All crews</option>';
    const crews = [...new Set(karakters
        .map(k => k.crew?.name) 
        .filter(Boolean)
    )].sort();

    crews.forEach(crew => {
        const optie = document.createElement('option');
        optie.value = crew;
        optie.textContent = crew;
        filterCrew.appendChild(optie);
    });
};

// Sorteer functie
const sorteerKarakters = (karakters) => {
    const keuze = sorteerSelect.value;
    const parseBounty = (bounty) => {
    if (!bounty) return 0;
    return parseInt(bounty.replace(/\./g, ''));
};

    if (keuze === 'naam-az') {
        return [...karakters].sort((a, b) => a.name.localeCompare(b.name));
    } else if (keuze === 'naam-za') {
        return [...karakters].sort((a, b) => b.name.localeCompare(a.name));
    } 
    
    else if (keuze === 'bounty-hoog') {
    return [...karakters].sort((a, b) => parseBounty(b.bounty) - parseBounty(a.bounty));
} else if (keuze === 'bounty-laag') {
    return [...karakters].sort((a, b) => parseBounty(a.bounty) - parseBounty(b.bounty));
}
    return karakters;
};

// Filter en zoek functie
const filterEnZoek = () => {
    const zoekterm = zoekbalk.value.toLowerCase();
    const statusKeuze = filterStatus.value;
    const fruitKeuze = filterFruit.value;
    const crewKeuze = filterCrew.value;

    let resultaat = alleKarakters;

    // Filter op naam
    resultaat = resultaat.filter(k =>
        k.name.toLowerCase().includes(zoekterm)
    );

    // Filter op status
    if (statusKeuze !== 'all') {
        const levendWaarden = ['living', 'vivant'];
        const doodWaarden = ['deceased', 'dead'];

        if (statusKeuze === 'living') {
            resultaat = resultaat.filter(k => levendWaarden.includes(k.status));
        } else if (statusKeuze === 'deceased') {
            resultaat = resultaat.filter(k => doodWaarden.includes(k.status));
        }
    }

    // Filter op devil fruit
    if (fruitKeuze === 'ja') {
        resultaat = resultaat.filter(k => k.fruit !== null && k.fruit !== undefined);
    } else if (fruitKeuze === 'nee') {
        resultaat = resultaat.filter(k => k.fruit === null || k.fruit === undefined);
    }

    // Filter op crew
    if (crewKeuze !== 'all') {
        resultaat = resultaat.filter(k => k.crew?.name === crewKeuze);
    }

    // Sorteer
    resultaat = sorteerKarakters(resultaat);

    toonKarakters(resultaat);
};

// Luisteren naar alle filters
zoekbalk.addEventListener('input', filterEnZoek);
sorteerSelect.addEventListener('change', filterEnZoek);
filterStatus.addEventListener('change', filterEnZoek);
filterFruit.addEventListener('change', filterEnZoek);
filterCrew.addEventListener('change', filterEnZoek);

// Data ophalen van de API
const haalKaraktersOp = async () => {
    try {
        karaktersContainer.innerHTML = '<p>Loading characters...</p>';

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Something went wrong: ${response.status}`);
        }

        const data = await response.json();
        alleKarakters = data.filter(k => gewensteIds.includes(k.id));

        vulCrewFilter(alleKarakters);
        toonKarakters(alleKarakters);

    } catch (fout) {
        karaktersContainer.innerHTML = `<p>Error: ${fout.message}</p>`;
        console.error('Fout bij ophalen:', fout);
    }
};
// Favorieten array
let favorieten = JSON.parse(localStorage.getItem('favorieten')) ?? [];

// Favorieten container selecteren
const favorietenContainer = document.querySelector('#favorieten-container');

// Favoriet toevoegen of verwijderen
const voegToeAanFavorieten = (karakter) => {
    const bestaatAl = favorieten.some(f => f.id === karakter.id);

    if (bestaatAl) {
        favorieten = favorieten.filter(f => f.id !== karakter.id);
    } else {
        favorieten.push(karakter);
    }

    // Opslaan in LocalStorage
    localStorage.setItem('favorieten', JSON.stringify(favorieten));
    toonFavorieten();
};

// Favorieten tonen in de DOM
const toonFavorieten = () => {
    favorietenContainer.innerHTML = '';

    if (favorieten.length === 0) {
        favorietenContainer.innerHTML = '<p>No favorites yet.</p>';
        return;
    }

    favorieten.forEach(karakter => {
        const kaart = document.createElement('article');
        kaart.classList.add('karakter-kaart');

        kaart.innerHTML = `
            <div class="kaart-info">
                <h2>${karakter.name}</h2>
                <p><strong>Crew:</strong> ${karakter.crew?.name ?? 'Unknown'}</p>
                <p><strong>Bounty:</strong> ${karakter.bounty ?? 'Unknown'}</p>
                <button class="verwijder-knop" data-id="${karakter.id}">❌ Remove</button>
            </div>
        `;

        // Verwijder knop event
        const verwijderKnop = kaart.querySelector('.verwijder-knop');
        verwijderKnop.addEventListener('click', () => {
            voegToeAanFavorieten(karakter);
        });

        favorietenContainer.appendChild(kaart);
    });
};
// Thema knop selecteren
const themaKnop = document.querySelector('#theme-toggle');

// Thema toepassen op de pagina
const pasThemaToe = (thema) => {
    if (thema === 'dark') {
        document.body.classList.add('dark-mode');
        themaKnop.textContent = '☀️ Light mode';
    } else {
        document.body.classList.remove('dark-mode');
        themaKnop.textContent = '🌙 Dark mode';
    }
};

// Thema wisselen als gebruiker op knop klikt
const wisselThema = () => {
    const isDark = document.body.classList.contains('dark-mode');
    const nieuwThema = isDark ? 'light' : 'dark';
    localStorage.setItem('thema', nieuwThema);
    pasThemaToe(nieuwThema);
};

// Opgeslagen thema laden bij opstarten
const opgeslagenThema = localStorage.getItem('thema') ?? 'light';
pasThemaToe(opgeslagenThema);

// Luisteren naar knop klik
themaKnop.addEventListener('click', wisselThema);

// Observer API
const kaartjeInBeeld = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('zichtbaar');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(kaartjeInBeeld, {
    threshold: 0.1
});

// Koppel de observer aan elk karakter kaartje
const observeerKaartjes = () => {
    const kaartjes = document.querySelectorAll('.karakter-kaart');
    kaartjes.forEach(kaart => observer.observe(kaart));
};

// App starten
window.addEventListener('load', () => {
    haalKaraktersOp();
    toonFavorieten();
});