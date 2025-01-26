
// perform search - GET from api
// server: https://rickandmortyapi.com/api/character

// form docs
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const radio = document.querySelectorAll('input[name="type"');

// pagination docs
const next = document.getElementById("next-page");
const prev = document.getElementById("prev-page");

// API server url
const BASE_URL = `https://rickandmortyapi.com/api/character/`;

// init current page
let page = 1;

// listen to input daia in searchform
form.addEventListener(`input`, (event) => {
    event.preventDefault();
    searchItems(page = 1, input.value, radioValue(radio));
});

// pagination action
next.addEventListener('click', () => {
    searchItems(++page, input.value, radioValue(radio));
})

// pagination action
prev.addEventListener('click', () => {
    searchItems(--page, input.value, radioValue(radio));
    if (page <= 0) page = 1;
})

// default when docs are loaded
document.addEventListener(`DOMContentLoaded`, () => {
    searchItems(page, input.value, radioValue(radio));
});

// get selected radio button
function radioValue(elem) {
    let val = '';
    // doc element radio buttons
    elem.forEach((item) => {
        // debug
        // console.log(item.name, item.checked, item.value);
        if (item.checked) val = item.value
    });
    return val;
}

// search - async api handler
async function searchItems(page, name, status) {

    // init input to default
    if (name == null) name = '';
    if (status == null) status = 'Alive';
    if (page == null) page = 1;

    try {
        const data = await getAPI(`${BASE_URL}?page=${page}&name=${name}&status=${status}`);

        // debug PoC
        if (data.results.length > 0) {
            data.results.forEach((item) => {
                console.log('SEARCH ITEM:', item);
            });
        }
        // render html content
        renderItems(data);

    } catch (error) {
        console.error(`BŁĄD SEARCH`, error);
        // render html content with init result to catch "nie znaleziono wyników" 
        renderItems({ results: [] });
    }
}

// search - async api handler
async function getAPI(url) {

    try {
        const response = await fetch(url);
        const data = await response.json();
        // debug
        //console.log(url)
        //console.log(`GET OK ${url}:`,data);     
        return data;

    } catch (error) {
        console.error(`BŁĄD GET ${url}`, error);
        return data;
    }
}

// render html content
function renderItems(data) {

    // create elements
    const results = document.getElementById(`results`);
    results.innerHTML = ``;

    if (data.results.length > 0) {
        data.results.forEach((item) => {
            const itemDiv = document.createElement(`div`);
            itemDiv.className = `result-item`;
            itemDiv.innerHTML = `
                    <div class="character-card">
                        <img src="${item.image}" alt="${item.name}" class="character-image">
                        <div class="character-info">
                            <p>${item.name}</p>
                            <p>Status: ${item.status}</p>
                            <p>Gatunek: ${item.species}</p>
                        </div>
                    </div>
              `;
            results.appendChild(itemDiv);
        });
    } else {
        results.innerHTML =
            "<p>Nie znaleziono wyników!</p>";
    }
}