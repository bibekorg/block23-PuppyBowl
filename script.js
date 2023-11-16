const playerContainer = document.getElementById('all-players-container');
const teamContainer = document.getElementById('all-teams-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-ACC-PT-WEB-PT-A';
// Use the API_URL variable for fetch requests
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/` + cohortName;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${API_URL}/players`);
        const json = await response.json();
        const players = json.data.players;
        if (json.error) {
            throw new Error(json.error);
        }
        return players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

//fetch a single player object whose id is equal to PLAYER-ID.
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${API_URL}/players/${playerId}`);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

// fetches team as an array of player objects.
const fetchTeam = async () => {
    try {
        const response = await fetch(API_URL + "/teams");
        const json = await response.json();
        const teams = json.data.teams;
        return teams;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
}

// to create a new player
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${API_URL}/players`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerObj),
        });
        const json = await response.json();
        if (json.error) {
            throw new Error(json.error);
        }
        init();
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${API_URL}/players/${playerId}`, {
            method: "DELETE",
        });
        const delPlayer = await response.json();

        if (!response.ok) {
            throw new Error("Player could not be deleted.");
        }
        init();
        return delPlayer;
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 * Then it takes that larger string of HTML and adds it to the DOM.
 * It also adds event listeners to the buttons in each player card.
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        const playerItems = playerList.map((player) => {
            const playerItem = document.createElement("li");
            playerItem.classList.add("player");
            playerItem.innerHTML = `
                <h2>ID ${player.id}</h2>
                <h3>Name ${player.name}<h3>
                <img src="${player.imageUrl}" alt="${player.name}" />
                <p>TeamID ${player.teamId}</p>
                <div class="hidden playerDetails">
                    <p>${player.breed}</p>
                    <p>${player.status}<p>
                    <p>${player.createdAt}</p>
                    <p>${player.updatedAt}</p>
                    <p>${player.cohortId}</p>
                </div>
                <button>See Details</button>
                `;

            playerItem.querySelector("button").addEventListener("click", () => {
                playerItem.querySelector(".playerDetails").classList.toggle("hidden")
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Remove Player";
            playerItem.append(deleteButton);
            deleteButton.addEventListener("click", async (event) => {
                event.preventDefault();
                await removePlayer(player.id);
            });

            return playerItem;
        });
        playerContainer.replaceChildren(...playerItems);
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */

const renderNewPlayerForm = () => {
    try {
        const submitButton = document.getElementById("new-player");
        submitButton.addEventListener("submit", async (event) => {
            event.preventDefault();
            await addNewPlayer({
                name: event.target.title.value,
                breed: event.target.breed.value,
                status: event.target.status.value,
                imageUrl: event.target.imageUrl.value,
                teamId: event.target.teamId.value,
            });
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    //const singlePlayer = await fetchSinglePlayer(id);
    const teams = await fetchTeam();
    renderAllPlayers(players);
}

init();

renderNewPlayerForm();