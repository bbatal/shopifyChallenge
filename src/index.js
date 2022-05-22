// API secret key for ope;nAI
const API_KEY = 'process.env.API_KEY'


import firebaseApp from "../firebaseApp.js";
import { getDatabase, ref, set, onValue, push, child, remove,  } from 'firebase/database';

const app = {};

// all variables
app.form = document.getElementById('form');
app.input = document.getElementById('prompt');
app.uLList = document.getElementById('responses');
app.database = getDatabase(firebaseApp);
app.dbRootAddress = ref(app.database);
app.savedItems = [];
app.data = {
 prompt: "Write a poem about a dog wearing skis",
 temperature: 0.5,
 max_tokens: 64,
 top_p: 1.0,
 frequency_penalty: 0.0,
 presence_penalty: 0.0,
};

const fetchCall = () => {
    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${API_KEY}`,
     },
     body: JSON.stringify(app.data),
    })
    .then((res) => {
        return res.json()
    }).then((data) => {
        // add both the data and the original prompt
        if(data.choices) {
            app.handleAddItem(data.choices[0].text, app.data.prompt)
        }
    })
}

// lets return the prompt and the markup onto the page from our call
app.renderElements = (fetchResponse, prompt, firebaseItemKey) => {
    // create our local variables
    const li = document.createElement('li');
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {app.handleRemoveItem(firebaseItemKey)});

    // append prompt to h2
    h2.textContent = prompt;

    // append returned data to paragraph
    p.textContent = fetchResponse;

    // append all data to div
    div.append(h2);
    div.append(p)
    div.append(removeButton)

    // append div to li
    li.append(div);
    app.uLList.append(li)
}

// load firebase data
app.firebaseGetter = () => {

    // use onValue to watch for changes
    onValue(app.dbRootAddress, (response) => {

         // remove li's from ul to clear it before appending more data
        while( app.uLList.firstChild ) {
            app.uLList.removeChild( app.uLList.firstChild )
        }

        const data = response.val();

        if (data) {
            for (let key in data['answers']) {
                // we need to change the app.data.prompt variable on every call of renderElements on page load
                app.renderElements(data['answers'][key].data, data['answers'][key].prompt, key)
    
             }

        }
    })
}

// adding items to firebase
app.handleAddItem = (textData, userPrompt) => {
    const fireObj = {
        data: textData,
        prompt: userPrompt,
    }

    // generate a new key in your database
    const newPostKey = push(child(ref(app.database), `answers`)).key;

    // save generated object to the database position
    set(ref(app.database, `answers/${newPostKey}`), fireObj);
}

// removing items from firebase
app.handleRemoveItem = (key) => {
    const itemLocation = ref(app.database, `answers/${key}/`);
    remove(itemLocation);
}

// call for the intitialization of our app
app.init = function() {
    app.form.addEventListener('submit', (e) => {
        // preventing reload of page
        e.preventDefault();

        // change data object to our input value
        app.data.prompt = app.input.value;

        // clear our value from the markup
        app.input.value = "";

        // call the api with our new data request
        fetchCall();

    })
}

document.addEventListener("DOMContentLoaded", function() {

    app.init();
    app.firebaseGetter();
})
 