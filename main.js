const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const $id = id => document.getElementById(id);


const divSummary = $('.todo-summary');
const stateButtons = $('.state-buttons');
const interactiveSection = $('.interactive-content');
const divFooter = document.createElement('div');
divFooter.className = 'div-footer';

const btnTheme = $('.btn-theme');
const body = $('body');
const darkBtn = $('.dark-theme-svg')
const lightBtn = $('.light-theme-svg');
let isAnimating = false;
const addItemBtn = $('.add-item-btn');
const btnDelete = $('.delete');

const form = $('.todo-form');
const input = $id('todo-input');
const emptyList = $('.empty-list');
const listContainer = $('.list-container');
let modes = {
    all: 'all',
    active: 'active',
    completed: 'completed'
  }
const li = $('.li')

const listItems = []

function createNewItem(inputElement){
  listItems.push(
    {
      text: inputElement.value,
      completed: false,
      id: Date.now()
    }
  )
};

//Form
form.addEventListener('submit', handleAddItem);

addItemBtn.addEventListener('click', handleAddItem);

function handleAddItem(e){
  e.preventDefault();
  if(!input.value) return; 
  addItem();
}

function addItem(){
  emptyList.style.display='none';
      createNewItem(input);

      const lastItem = listItems.length-1;
      listContainer.prepend(addItemToList(listItems[lastItem].id, listItems[lastItem].text))
      input.value = ''
}

listContainer.addEventListener('click', (e)=> {
  if(e.target.tagName === 'BUTTON'){
    const btnId = Number(e.target.dataset.id);
    const index = listItems.findIndex((element) => element.id === btnId);
    if (index !== -1) listItems.splice(index, 1)
    e.target.closest('li').remove();
  } 
})

function addItemToList(id, text){
  const li = document.createElement('li');
  li.classList.add('li');
  li.id = id;
  li.innerHTML = `<label for="input-${id}" class="label-li">
        <input type="checkbox" id="input-${id}">
        <span class="custom-check round">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#000" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
        </span>
        <span class="todo-text">${text}</span>
      </label>
      <button type="button" class="delete" data-id="${id}">
      </button>`
  return li
}


//Theme button
btnTheme.addEventListener('click', (e)=> {
  e.preventDefault();
  toggleTheme();
  if(isAnimating) return;
  isAnimating = true;

  const active = !darkBtn.classList.contains('hide-above') ? darkBtn : lightBtn;
  const next = active === darkBtn ? lightBtn : darkBtn;

  active.classList.add('move-down');
  next.classList.remove('move-down', 'hide-above');

  active.addEventListener('transitionend', ()=> {
    active.classList.remove('move-down');
    active.classList.add('hide-above');
    isAnimating = false;
  }, {once:true});
});


//Interactive section div repositioning
function repositionDiv() {
  if (window.innerWidth < 590) {
    if(!interactiveSection.contains(divFooter)){
    interactiveSection.appendChild(divFooter);
    divFooter.appendChild(stateButtons);
  }
  } else if(interactiveSection.contains(divFooter) && window.innerWidth > 590){
    interactiveSection.removeChild(divFooter);
    divSummary.insertBefore(stateButtons, divSummary.children[1]);
  }
}


window.addEventListener('DOMContentLoaded', repositionDiv)
window.addEventListener('resize', repositionDiv);


function toggleTheme() {
  const current = body.dataset.theme;
  body.dataset.theme = current === 'dark' ? 'light' : 'dark';
}










