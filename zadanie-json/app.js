
// perform search - GET from api
// server: https://rickandmortyapi.com/api/character
// local json server: http://localhost:3000/

// form docs
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const radio = document.querySelectorAll('input[name="type"');

// pagination docs
const next = document.getElementById("next-page");
const prev = document.getElementById("prev-page");

// API server remote url
const BASE_REMOTE_URL = `https://rickandmortyapi.com/api/character/`;
// jason-servel local url
const BASE_LOCAL_URL = 'http://localhost:3000/character/';

// init current page
let page = 1;

// listen to input daia in searchform
form.addEventListener(`input`, (event) => {
    event.preventDefault();
    searchItems(false, page = 1, input.value, radioValue(radio));
});

// pagination action
next.addEventListener('click', () => {
    searchItems(false, ++page, input.value, radioValue(radio));
})

// pagination action
prev.addEventListener('click', () => {
    searchItems(false, --page, input.value, radioValue(radio));
    if (page <= 0) page = 1;
})

// default when docs are loaded
document.addEventListener(`DOMContentLoaded`, () => {
    searchItems(false, page, input.value, radioValue(radio));
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
async function searchItems(remote, page, name, status) {

    // init BASE_URL
    let url = '';

    // init input to default
    if (name == null) name = '';
    if (status == null) status = '';
    if (page == null) page = 1;
    if (remote == null) remote = false;

    if (remote === true) {

        // init data
        let postData = [];
        url = `${BASE_REMOTE_URL}?page=${page}&name=${name}&status=${status}`;
        try {
            const data = await getAPI(url);

            data.results.forEach((item) => {
                // debug
                console.log("ITEM FROM REMOTE API:", item);
                postData.push(
                    {
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        status: item.status,
                        species: item.species,
                    }
                );
            });

            postData.forEach((item) => {
                // debug
                console.log(`ITEM BEFORE POST ${url}:`, item);
                postAPI(BASE_LOCAL_URL, item);
            });

            searchItems(false, page = 1, input.value, radioValue(radio));

        } catch (error) {
            console.error(`BŁĄD SEARCH REMOTE`, error);
        }

    } else {
        // init data
        url = `${BASE_LOCAL_URL}?_page=${page}&_limit=5&name_like=${name}&status=${status}`;
        try {
            const data = await getAPI(url);

            // debug PoC
            console.log(`Searching ${url}`, data);

            if (data.length > 0) {
                data.forEach((item) => {
                    console.log('SEARCH ITEM LOCAL:', item);
                });
            }
            // render html content
            renderItems(data);

        } catch (error) {
            console.error(`BŁĄD SEARCH ${url}`, error);
            // render html content with init result to catch "nie znaleziono wyników" 
            renderItems({ data: [] });
        }
    }
}

// add - async api handler
async function addItem() {
    // init data
    let url = BASE_LOCAL_URL;
    let postData = [];

    // construct data for post
    postData.push(
        {
            name: document.getElementById("post-name").value,
            image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
            status: document.getElementById("post-status").value,
            species: document.getElementById("post-species").value,
        }
    );

    try {
        const response = await postAPI(url, postData[0]);
        searchItems(false, page, input.value, radioValue(radio));

    } catch (error) {
        console.error(`BŁĄD POST ${url}`, error);
        searchItems(false, page, input.value, radioValue(radio));
    }
}

// delete - async api handler
async function deleteItem(id) {
    // let url = `${BASE_LOCAL_URL}?id=${id}`;
    let url = `${BASE_LOCAL_URL}${id}`;

    try {
        const response = await deleteAPI(url);
        searchItems(false, page, input.value, radioValue(radio));

    }
    catch (error) {
        console.error(`BŁĄD DELETE ${url}`, error);
        searchItems(false, page, input.value, radioValue(radio));
    }
}

// get data from url
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

// post data to url
async function postAPI(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const postData = await response.json();

    } catch (error) {
        console.error(`BŁĄD POST ${url}`, error);

    }
}

// delete data from url
async function deleteAPI(url) {
    try {
        let response = await fetch(url, {
            method: "DELETE",
        });

    } catch (error) {
        console.error(`BŁĄD DELETE ${url}`, error);
    }
}

// render html content
function renderItems(data) {

    // create elements
    const results = document.getElementById(`results`);
    results.innerHTML = ``;

    if (data.length > 0) {
        data.forEach((item) => {
            const itemDiv = document.createElement(`div`);
            itemDiv.className = `result-item`;
            itemDiv.innerHTML = `
                    <div class="character-card">
                        <img src="${item.image}" alt="${item.name}" class="character-image">
                        <div class="character-info">
                            <p>${item.name}</p>
                            <p>Status: ${item.status}</p>
                            <p>Gatunek: ${item.species}</p>
                            <button onclick="deleteItem('${item.id}')">Usuń</button>
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

// debug
const postBtn = document.getElementById('post');
postBtn.addEventListener('click', () => {
    searchItems(false, page, input.value, radioValue(radio));

})
