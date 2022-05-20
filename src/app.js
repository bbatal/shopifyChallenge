// API secret key for openAI
const API_KEY = process.env.API_KEY;

import firebaseApp from "../firebaseApp.js";
import { getDatabase, ref, set, onValue, push, child,  } from 'firebase/database';

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
        // console.log(data.choices)
        app.renderElements(data.choices);

        // add both the data and the original prompt
        app.handleAddItem(data.choices[0].text, app.data.prompt)
    })
}

// lets return the prompt and the markup onto the page from our call
app.renderElements = (fetchResponse) => {
    // create our local variables
    const li = document.createElement('li');
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    // append prompt to h2
    h2.textContent = app.data.prompt;

    // append returned data to paragraph
    p.textContent = fetchResponse;

    // append all data to div
    div.append(h2);
    div.append(p)

    // append div to li
    li.append(div);
    app.uLList.append(li)
}

// load firebase data
app.firebaseGetter = () => {
    // use onValue to watch for changes
    onValue(app.dbRootAddress, (response) => {

        const data = response.val();

        for (let key in data) {
            // fill the array with { key: prompt, response: "responseBody"} type objects
            app.renderElements(data[data])
         }

      console.log(app.savedItems);
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

    set(ref(app.database, `answers/${newPostKey}`), fireObj);
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
        fetchCall(app.data);

    })
}

document.addEventListener("DOMContentLoaded", function(e) {

    app.init();
    app.firebaseGetter();
})
 