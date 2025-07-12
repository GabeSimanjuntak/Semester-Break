document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const creatureName = document.getElementById('creature-name');
    const creatureId = document.getElementById('creature-id');
    const weight = document.getElementById('weight');
    const height = document.getElementById('height');
    const types = document.getElementById('types');
    const hp = document.getElementById('hp');
    const attack = document.getElementById('attack');
    const defense = document.getElementById('defense');
    const specialAttack = document.getElementById('special-attack');
    const specialDefense = document.getElementById('special-defense');
    const speed = document.getElementById('speed');

    searchButton.addEventListener('click', searchCreature);

    function searchCreature() {
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            alert('Please enter a creature name or ID');
            return;
        }

        fetch(`https://rpg-creature-api.freecodecamp.rocks/api/creatures/${searchTerm.toLowerCase()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Creature not found');
                }
                return response.json();
            })
            .then(data => {
                displayCreature(data);
            })
            .catch(error => {
                alert(error.message);
                clearDisplay();
            });
    }

    function displayCreature(creature) {
        // Basic info
        creatureName.textContent = creature.name.toUpperCase();
        creatureId.textContent = `#${creature.id}`;
        weight.textContent = `Weight: ${creature.weight}`;
        height.textContent = `Height: ${creature.height}`;

        // Types
        types.innerHTML = '';
        creature.types.forEach(type => {
            const typeElement = document.createElement('span');
            typeElement.textContent = type.toUpperCase();
            typeElement.className = 'type';
            typeElement.style.backgroundColor = getTypeColor(type);
            types.appendChild(typeElement);
        });

        // Stats
        hp.textContent = creature.hp;
        attack.textContent = creature.attack;
        defense.textContent = creature.defense;
        specialAttack.textContent = creature.special_attack;
        specialDefense.textContent = creature.special_defense;
        speed.textContent = creature.speed;
    }

    function clearDisplay() {
        creatureName.textContent = '-';
        creatureId.textContent = '#-';
        weight.textContent = 'Weight: -';
        height.textContent = 'Height: -';
        types.innerHTML = '';
        hp.textContent = '-';
        attack.textContent = '-';
        defense.textContent = '-';
        specialAttack.textContent = '-';
        specialDefense.textContent = '-';
        speed.textContent = '-';
    }

    function getTypeColor(type) {
        const typeColors = {
            'fire': '#F08030',
            'water': '#6890F0',
            'grass': '#78C850',
            'electric': '#F8D030',
            'ice': '#98D8D8',
            'fighting': '#C03028',
            'poison': '#A040A0',
            'ground': '#E0C068',
            'flying': '#A890F0',
            'psychic': '#F85888',
            'bug': '#A8B820',
            'rock': '#B8A038',
            'ghost': '#705898',
            'dark': '#705848',
            'dragon': '#7038F8',
            'steel': '#B8B8D0',
            'fairy': '#EE99AC',
            'normal': '#A8A878'
        };
        return typeColors[type.toLowerCase()] || '#777';
    }
});