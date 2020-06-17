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

function Form(props, updateFn) {
  function Button() {
    return aprender.h('button', { 
        attrs: {
          type: 'submit'
        },
        children: ['Search'] 
      }
    );
  }
  
  function Search() {
    return aprender.h('input', { 
      attrs: { 
        type: 'search',
        oninput: (e) => {

        }
      }
    });
  }

  return aprender.h('form', {
      attrs: { 
        id: 'form',
        onsubmit: (e) => { 
          e.preventDefault(); 
        }
      },
      children: [
        aprender.h(Search),
        aprender.h(Button)
      ]
    },
  );
}

function Dropdown(props, updateFn) {

  function DropdownOption(value) {
    return aprender.h('option', {
      attrs: {
        value
      },
      children: value
    })
  }

  return aprender.h('select', {
    attrs: {
      name: 'api-selection',
      onchange: (e) => { 
        props.updateFn({
          selectedApiDesc: props.apiDescs[e.target.value],
          selectedApi: e.target.value
        })
      }
    },
    children: props.apiOptions.map(opt => DropdownOption(opt))
  });
}

function SelectAPI(props) {
  return aprender.h('div', {
    children: [
      aprender.h('h3', { children: ['Select API: ']}),
      aprender.h(Dropdown, 
        { attrs: { props } }
      )
    ]
  })
}

function InfoBox(props) {
  return aprender.h('div', {
    children: [
      aprender.h('p', {
        children: [
          props.selectedApiDesc
        ]
      })
    ]
  })
}

function Container(props, updateFn) {
  const state = {
    apiOptions: [
      'API 1',
      'API 2'
    ],
    apiDescs: {
      'API 1': 'This is a description of API 1',
      'API 2': 'This is a description of API 2'
    },
    selectedApi: props.selectedApi || 'API 1',
    selectedApiDesc: props.selectedApiDesc || 'The description goes here',
    searchTerm: props.searchTerm || ''
  }

  return aprender.h('div', {
    children: [
      aprender.h(
        InfoBox, { 
          attrs: { 
            props: { selectedApiDesc: state.selectedApiDesc }
          }
        }
      ),
      aprender.h(SelectAPI, { 
        attrs: { 
          props: { 
            apiOptions: state.apiOptions,
            apiDescs: state.apiDescs,
            updateFn
          }
        }
      }),
      aprender.h(Form, { 
        attrs: { 
          props: {
            searchTerm: state.searchTerm
          }
        }
      })
    ]
  })
}

// const App = aprender.render(
//   aprender.h(
//     ({count = 0}, updateFn) => {

//       const increment = () => updateFn({ count: ++count });

//       return aprender.h('button', {
//         attrs:{
//           onclick: increment
//         },
//         children: [`${count}`, aprender.h('div', {}, [])]
//       })
//     }
//   )
// );

const _App = aprender.h(({count = 0}, updateFn) => {
  const increment = () => updateFn({ count: ++count });

  return aprender.h('button', {
    attrs:{
      onclick: increment
    },
    children: [
      `${count}`,
      aprender.h(() => (
        aprender.h('div', {children: ['This is text']})
      ))
    ]
  })
});


// aprender.mount(App, document.getElementById('app'));
aprender.render(_App, {}, document.getElementById('app'));