// HTTP module
class HTTP {
    // HTTP get request
    async get(url) {
        const response = await fetch(url);
        const resData = await response.json();

        return resData;
    }

    // HTTP post request
    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(data)
        });

        const resData = await response.json();
        return resData;
    }

    // HTTP put request
    async put(url, data) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(data)
        });

        const resData = await response.json();
        return resData;
    }

    // HTTP delete request
    async delete(url) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resData = await response.json();
        return resData;
    }
}

const http = new HTTP();




// UI module
class UI{
    // Constructor function
    constructor(){
        // Selectors
        this.body = document.body;
        this.form = document.getElementById('form');
        this.button = document.getElementById('button');
        this.titleInput = document.getElementById('title');
        this.authorInput = document.getElementById('author');
        this.bodyInput = document.getElementById('body');
        this.container = document.getElementById('container');
    }
    // UI.prototypes methods
    paintItems(items){
        let html = '';
        items.forEach(function(item){
            html += `
            <div class="card" data-id="${item.id}">
                <h3>${item.title}</h3>
                <h5>${item.author}</h5>
                <p>${item.body}</p>
                <!--
                <p>${item.date}</p>
                <img src="delete.svg" alt="Delete post"/>
                -->
            </div>`
        });
        // Append div element as a child of body element
        this.container.innerHTML = html;
    }
    printInputFields(item) {
        this.titleInput.value = item.title;
        this.authorInput.value = item.author;
        this.bodyInput.value = item.body;
    }
    clearFields() {
        this.titleInput.value = '';
        this.authorInput.value = '';
        this.bodyInput.value = '';
    }
}

const ui = new UI();




// Item controller
class Item {
    constructor() {
        this.selected = null;
        this.editState = false;
    }
    switchToEditState() {
        // Change into edit state
        it.editState = true;
        ui.button.value = 'Update';
        // Create delete button if needed
        if (!document.getElementById('delete')) {
            const deleteBtn = document.createElement('input');
        deleteBtn.type = 'submit';
        deleteBtn.value = 'Delete';
        deleteBtn.id = 'delete';
        ui.form.appendChild(deleteBtn);
        }  
    }
    switchOffEditState() {
        it.editState = false;
        ui.clearFields();
        ui.button.value = 'Post it!';
        document.getElementById('delete').remove();
    }
}

const it = new Item();




// Add Event Listeners
document.addEventListener('DOMContentLoaded', loadItems);

ui.button.addEventListener('click', submitItem);

ui.container.addEventListener('click', selectItem);

ui.form.addEventListener('click', deleteItem);

// Event functions
function loadItems() {
    http.get('http://localhost:3000/posts')
        .then(items => {
            // Make sure the parameter the passed to paintItems is an array
            if (Array.from(items).length === 0) {
                items = [];
            }
            ui.paintItems(items);
            ui.clearFields();
        })
        .catch(err => console.log(err));
}

function submitItem(e) {
    e.preventDefault();

    const title = ui.titleInput.value;
    const author = ui.authorInput.value;
    const body = ui.bodyInput.value;
    const date = new Date();
    const item = {
        title: title, 
        author: author,
        body: body,
        date: date
    };
    
    // Validation 
    // if (title !== '') {
    //     ui.titleInput.style.borderColor = '';
    // } else {
    //     ui.titleInput.style.borderColor = 'red';
    // }
    // if (author !== '') {
    //     ui.authorInput.style.borderColor = '';
    // } else {
    //     ui.authorInput.style.borderColor = 'red';
    // }
    // if (body !== '') {
    //     ui.bodyInput.style.borderColor = '';
    // } else {
    //     ui.bodyInput.style.borderColor = 'red';
    // }
    if (title === '' || author === '' || body === '') return;

    // Add Item
    if (it.editState === false) {
        http.post('http://localhost:3000/posts', item)
            .then(() => {
                ui.clearFields();
                loadItems();
            });
    // Update item thanks to it.selected property
    } else {
        const id = it.selected;
        http.put(`http://localhost:3000/posts/${id}`, item)
            .then(() => {
                ui.clearFields();
                loadItems();
            });
    }
}

function selectItem(e) {
    // Event delegation
    if (e.target.classList.contains('card') || e.target.parentElement.classList.contains('card')) {
        let target;
        if (!e.target.classList.contains('card')) {
            target = e.target.parentElement;
        } else {
            target = e.target;
        }

        console.log(target)
        // If no item is selected
        if (it.selected === null) {
            // Add selected class
            target.classList.add('selected');
            // Update it.selected value
            it.selected = target.dataset.id;

            // Switch to edit state
            it.switchToEditState();
            // get item form server and print input fields
            http.get(`http://localhost:3000/posts/${it.selected}`)
                .then(item => ui.printInputFields(item))
                .catch(err => console.log(err));
            console.log(it.selected)

        // If another item is clicked
        } else if (target.dataset.id !== it.selected) {
            // Remove selected class from previous item
            document.querySelector(`[data-id="${it.selected}"`).classList.remove('selected');
            // Add selected class to current selection
            target.classList.add('selected');
            // Update it.selected value to current selection
            it.selected = target.dataset.id;

            // Swicth to edit state
            it.switchToEditState();
            // get item form server and print input fields
            http.get(`http://localhost:3000/posts/${it.selected}`)
                .then(item => ui.printInputFields(item))
                .catch(err => console.log(err));

        // If same item is clicked: switch off editState
        } else {
            // Remove select class from last selected item
            target.classList.remove('selected');
            // Update it.selected to null value
            it.selected = null;

            // Switch off editState
            it.switchOffEditState();
            
        }
        
    }
}

function deleteItem(e) {
    e.preventDefault();

    if (e.target.id === 'delete') {
        deleteItemById(it.selected);
    }
}

// Console functions
function getItems() {
    http.get('http://localhost:3000/posts')
        .then(items => {
            console.log(items);
        })
        .catch(err => console.log(err));
}

function getItemById(id) {
    http.get(`http://localhost:3000/posts/${id}`)
        .then(data => console.log(data))
        .catch(err => console.log(err));
}

function postItem(item) {
    http.post('http://localhost:3000/posts', item)
        .then(data => {
            console.log(data);
        });
}

function updateItemById(item, id) {
    if (!item) throw 'Item parameter missing';
    if (!id) throw 'Id parameter missing';
    http.put(`http://localhost:3000/posts/${id}`, item)
        .then(data => {
            console.log(data);
        });
}

function deleteItemById(id) {
    http.delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
            console.log(data);
        });
}



// getItems();
// postItem({name: 'Marta', age: 30});
// getItems();

// NO FUNCIONA: postItem se invoca sin parar en vez una sola vez
// SOLUCIONADO: el tema es que postItem recarga la página después de hacer su petición. Entonces, si había sido invocada desde app.js simplemente, entramos en un bucle infinito de invocaciones y recargas que no para de enviar peticiones al servidor.

// NOTA: Si se usan módulos, entonces no se puede acceder a las variables y funciones declaradas desde la consola del navegador ¿?
