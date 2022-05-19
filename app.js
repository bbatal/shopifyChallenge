// API secret key for openAI
import TOKEN from "./environment.js";

const app = {};

// all variables
app.form = document.getElementById('form');
app.input = document.getElementById('prompt');
app.uLList = document.getElementById('responses');
app.data = {
 prompt: "Write a poem about a dog wearing skis",
 temperature: 0.5,
 max_tokens: 64,
 top_p: 1.0,
 frequency_penalty: 0.0,
 presence_penalty: 0.0,
};

const fetchCall = (data) => {
    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${TOKEN}`,
     },
     body: JSON.stringify(app.data),
    })
    .then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data.choices)
        app.renderElements(data.choices)
    })
}

// lets return the prompt and the markup onto the page from our call
app.renderElements = (fetchResponse) => {
    // create our local variables
    const li = document.createElement('li');
    const p = document.createElement('p');

    // append returned data to paragraph
    p.textContent = fetchResponse[0].text;

    // aappend paragraph to li
    li.append(p);
    app.uLList.append(li)
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
})
 