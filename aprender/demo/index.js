// - As a user, I can view the search app - DONE
// - As a user, I can select an API - DONE
// - As a user, after selecting an API, I can view information explaining the API and what search parameters I can use
// - As a user, I can type in the search field and click the search button
// - As a user, after clicking the search button I can view the search results
// - As a user, I can clear the search results

const aprender = require('../src/aprender');

const Button = aprender.createElement('button', { 
    attrs: {
      type: 'submit'
    },
    children: ['Search'] 
  }
);

const Search = aprender.createElement('input', { 
  attrs: { 
    type: 'search',
    oninput: (e) => console.log(e.target.value)
  }
});

const Form = aprender.createElement('form', {
    attrs: { 
      id: 'form',
      onsubmit: (e) => { 
        e.preventDefault(); 
        console.log('I am being submitted..')  
      }
    },
    children: [
      Search,
      Button
    ]
  },
);

const Dropdown = aprender.createElement('select', {
  attrs: {
    onchange: (e) => console.log(e.target.value)
  },
  children: [
    aprender.createElement('option', {
      children: ['--Please select an API--']
    }),
    aprender.createElement('option', {
      children: ['API 1']
    }),
    aprender.createElement('option', {
      children: ['API 2']
    })
  ]
});

const SelectAPI = aprender.createElement('div', {
  children: [
    aprender.createElement('h2', { children: ['Select API: ']}),
    Dropdown
  ]
})

const Container = aprender.createElement('div', {
  children: [
    SelectAPI,
    Form
  ]
})

const App = aprender.render(Container);

aprender.mount(App, document.getElementById('app'));
