let sanctuary = []; 

const form = document.getElementById('addCreatureForm');
const sanctuaryDisplay = document.getElementById('creatureSanctuary');
const searchInput = document.getElementById('searchCreature');

// 1. Grab the input a user enters into our form
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the page from refreshing

    const nameInput = document.getElementById('creatureName').value;
    const typeInput = document.getElementById('creatureType').value;
    const habitatInput = document.getElementById('creatureHabitat').value;
    const notesInput = document.getElementById('creatureNotes').value;

    // 2. Represent this input in a meaningful way, let's say an Object
    const newCreature = {
        id: Date.now(), // Gives a unique ID for our remove function
        name: nameInput,
        type: typeInput,
        habitat: habitatInput,
        notes: notesInput
    };

    // 3. Push the contents of that Object into an Array 
    sanctuary.push(newCreature);

    // 4. Reset our form
    form.reset();

    // 5. Display the new creature in our Array back to the user
    updateSanctuaryUI();
});

// Search Feature
searchInput.addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    updateSanctuaryUI(searchTerm);
});

// UI Rendering Logic
function updateSanctuaryUI(filterText = '') {
    sanctuaryDisplay.innerHTML = ''; // Clear out the old list

    // Filter logic based on the search bar
    const filteredCreatures = sanctuary.filter(creature => 
        creature.name.toLowerCase().includes(filterText) || 
        creature.type.toLowerCase().includes(filterText)
    );

    // Build the UI for each creature in the array
    filteredCreatures.forEach(creature => {
        const creatureDiv = document.createElement('div');
        creatureDiv.className = 'card mt-3 shadow-sm creature-card';
        
        creatureDiv.innerHTML = `
            <div class="card-body">
                <h4 class="card-title">${creature.name} <span class="badge badge-info" style="font-size: 0.6em;">${creature.type}</span></h4>
                <h6 class="card-subtitle mb-3 text-muted">Habitat: ${creature.habitat}</h6>
                <p class="card-text">${creature.notes ? creature.notes : "<em>No notes provided.</em>"}</p>
                <button class="btn btn-outline-danger btn-sm mt-2" onclick="removeCreature(${creature.id})">Release Creature</button>
            </div>
        `;
        sanctuaryDisplay.appendChild(creatureDiv);
    });
}

// Remove Feature
function removeCreature(creatureId) {
    // Keep everything EXCEPT the one with the matching ID
    sanctuary = sanctuary.filter(creature => creature.id !== creatureId);
    
    // Refresh the UI, keeping the current search filter active if there is one
    updateSanctuaryUI(searchInput.value.toLowerCase());
}