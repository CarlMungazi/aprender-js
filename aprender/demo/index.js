// - As a user, I can view the search app - DONE
// - As a user, I can select an API - DONE
// - As a user, after selecting an API, I can view information explaining the API and what search parameters I can use
// - As a user, I can type in the search field and click the search button
// - As a user, after clicking the search button I can view the search results
// - As a user, I can clear the search results

const aprender = require('../src/aprender');

/* BEGINNING OF TEST */

// const oldTree = aprender.h('div', { 
//     children: ['Search', aprender.h('p')] 
//   }
// );

// const newTree = aprender.h('div', { 
//   children: ['No Search', aprender.h('p')] 
//   }
// );

// const root = aprender.render(oldTree)
// aprender.mount(root, document.getElementById('app'))

// const diff = aprender.diff(oldTree, newTree);

// setTimeout(() => {
//   aprender.patch(root, diff);
// }, 5000)

/* END OF TEST */

const Button = aprender.h('button', { 
    attrs: {
      type: 'submit'
    },
    children: ['Search'] 
  }
);
  

const Search = aprender.h('input', { 
  attrs: { 
    type: 'search',
    oninput: (e) => console.log(e.target.value)
  }
});
  
const Form = aprender.h('form', {
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
})
   

const Dropdown = aprender.h('select', {
  attrs: {
    onchange: (e) => console.log(e.target.value)
  },
  children: [
    aprender.h('option', {
      children: ['--Please select an API--']
    }),
    aprender.h('option', {
      children: ['API 1']
    }),
    aprender.h('option', {
      children: ['API 2']
    })
  ]
});

const SelectAPI = aprender.h('div', {
  children: [
    aprender.h('h3', { children: ['Select API: ']}),
    Dropdown
  ]
})

const InfoBox = description => aprender.h('div', {
  children: [
    aprender.h('p', {
      children: [
        'The description goes here'
      ]
    })
  ]
})
  

const Container = () => {
  return aprender.h('div', {
    children: [
      InfoBox(),
      SelectAPI,
      Form
    ]
  })
}
  
const App = aprender.render(Container());

aprender.mount(App, document.getElementById('app'));