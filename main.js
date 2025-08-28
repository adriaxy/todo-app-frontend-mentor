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
let currentFilter = 'all';
const changeFilter = (filter) => currentFilter = (filter);
const currentBtn = $$('.btn-state');
const itemsLeftText = $('.items-left');

//flags
let isDeletedVisible = null;

const form = $('.todo-form');
const input = $id('todo-input');
const emptyList = $('.empty-list');
const showEmptyListMessage = () => emptyList.style.display = 'flex';
const listContainer = $('.list-container');
let modes = {
    all: 'all',
    active: 'active',
    completed: 'completed'
  }

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

stateButtons.addEventListener('click', (e)=> {
  if(listItems.length === 0){
    currentBtn.forEach((btn) => btn.classList.remove('selected-btn'));
    alert('There is no items on the list :(');
    return
  };
  const activeItems = listItems.filter(element => element.completed === false);
  const liElements = $$('.li');
  const all = e.target.dataset.filter==='all';
  const active = e.target.dataset.filter==='active';
  const completed = e.target.dataset.filter==='completed';
  const selectedBtn = e.target;
  const addClassToSelectedBtn = (btn) => btn.classList.add('selected-btn')
  currentBtn.forEach((btn) => btn.classList.remove('selected-btn'));

  if(all){
    addClassToSelectedBtn(selectedBtn);
    changeFilter('all');
    liElements.forEach((li) => {
      li.classList.remove('hide');
      li.classList.add('show');
    })
  };
  if(active){
    addClassToSelectedBtn(selectedBtn);
    changeFilter('active');
    filterLiElements(liElements, false);
  }
  if(completed){
    addClassToSelectedBtn(selectedBtn);
    changeFilter('completed');
    filterLiElements(liElements, true);
  }
  itemsLeft();
})

function filterLiElements(element, flag){
  if(Array.isArray(element) || element instanceof NodeList){
  element.forEach((li) => {
      const id = Number(li.id)
      const index = findIndexItem(id, 'id');
      const completed = listItems[index].completed
      if(completed === flag){
        li.classList.add('show');
        li.classList.remove('hide');
      } else {
        li.classList.add('hide');
        li.classList.remove('show');
      }
    })}else {
      const id = Number(element.id)
      const index = findIndexItem(id, 'id');
      const completed = listItems[index].completed
      if(completed === flag){
        element.classList.add('show');
        element.classList.remove('hide');
      } else {
        element.classList.add('hide');
        element.classList.remove('show');
      }
    }
}

//Form
form.addEventListener('submit', (e)=> {
  handleAddItem(e);
});

addItemBtn.addEventListener('click', (e)=> {
  handleAddItem(e);
});

function handleAddItem(e){
  e.preventDefault();

  if(!input.value){
    alert('Please, write a new task');
    return
  };
  addItem();
  itemsLeft(); 
  // updateDeleteButtonVisibility();
  // isDeletedVisible = null;
}


function addItem(){
  emptyList.style.display='none';
      createNewItem(input);
      const visibilityClass = currentFilter === 'completed' ? 'hide' : 'show'
      const lastItem = listItems.length-1;
      const newLi = addItemToList(listItems[lastItem].id, listItems[lastItem].text, visibilityClass)
      listContainer.prepend(newLi);
      input.value = '';
}

listContainer.addEventListener('click', (e)=> {
  if(listItems.length === 0)return;
  // if(e.target.closest('button')){
  //   console.log(listItems)
  //   console.log(e.target)
  //   const btnId = Number(e.target.dataset.id);
  //   console.log(btnId)
  //   const index = findIndexItem(btnId, 'id');
  //   console.log(index)
  //   if (index !== -1) listItems.splice(index, 1)
  //   e.target.closest('li').remove();
  //   if(listItems.length === 0)showEmptyListMessage();
  //       console.log(listItems)

  //   itemsLeft();
  //   return
  // };

  const btn = e.target.closest('button');
if (btn) {
  const li = btn.closest('li');
  if (!li) return; // seguridad
  const id = Number(li.id); // <--- siempre válido
  const index = findIndexItem(id, 'id');
  if (index !== -1) listItems.splice(index, 1);
  li.remove();
  if(listItems.length === 0) showEmptyListMessage();
  itemsLeft();
  return;
}

  const li = e.target.closest('li');
  if(li){
    // const lista = e.target.closest('li');
    const inputID = e.target.closest('li').id;
    const todoText = $(`span[data-text="${inputID}"]`);
    const customCheck = $(`span[data-check="${inputID}"]`);
    const customCheckSVG = $(`svg[data-svg="${inputID}"]`)
    const index = findIndexItem(Number(inputID), 'id');
    changeCompletedState(inputID);
    const completedState = listItems[index].completed;

   if(completedState){
    itemsLeft();
    todoText.classList.add('completed');
    customCheck.classList.add('round-check');
    customCheckSVG.style.display = 'block';
    customCheck.classList.remove('round-hoverable');
    itemsLeft();
    if(currentFilter === 'active'){
      filterLiElements(li, false);
    }
   } else {
    todoText.classList.remove('completed');
    customCheck.classList.remove('round-check');
    customCheckSVG.style.display = 'none';
    customCheck.classList.add('round-hoverable');
    li.classList.remove('hide');
    itemsLeft();
   }
  return
};
});

listContainer.addEventListener('keydown', (e)=> {
  if(e.target.tagName === 'LI'){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      e.target.click();
    }
  }
});

function changeCompletedState(id){
  const liId = Number(id);
  const index = findIndexItem(liId, 'id');
  const result = index !== -1 
    ? listItems[index].completed = !listItems[index].completed 
    : 'index not found';
  return result;
}

function findIndexItem(targetValue, key){
  return listItems.findIndex(element => element[key] === targetValue);
}

function addItemToList(id, text, visibilityClass){
  const li = document.createElement('li');
  li.classList.add('li');
  li.classList.add(visibilityClass);
  li.id = id;
  li.tabIndex = 0;

  li.innerHTML = `<label for="input-${id}" class="label-li">
        <input type="checkbox" data-input="${id}">
        <span class="custom-check round round-hoverable" data-check="${id}" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" data-svg="${id}" class="check-svg"><path fill="none" stroke="#fff" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
        </span>
        <span class="todo-text" data-text="${id}">${text}</span>
      </label>
      <button type="button" class="delete" data-id="${id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
      </button>`;
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
};

function updateDeleteButtonVisibility(){
  const deleteBtn = $$('.delete');
  const shouldBeVisible = listItems.length !== 0 && window.innerWidth < 590;

  if(shouldBeVisible === isDeletedVisible)return; 

  deleteBtn.forEach(btn => {
    btn.style.pointerEvents = shouldBeVisible ? 'auto' : 'none';
    btn.style.opacity = shouldBeVisible ? '1 ' : '0';
  })
  isDeletedVisible = shouldBeVisible;
}

window.addEventListener('DOMContentLoaded', ()=> {
  repositionDiv();
  // updateDeleteButtonVisibility();
})
window.addEventListener('resize', ()=> {
  repositionDiv();
  // updateDeleteButtonVisibility();
  if(listItems.length === 0)return;
  
});

function toggleTheme() {
  const current = body.dataset.theme;
  body.dataset.theme = current === 'dark' ? 'light' : 'dark';
}

function itemsLeft(){
  let counter = 0;
  listItems.forEach((item) => {
    if(!item.completed){
    counter++; 
    }
  });
  itemsLeftText.textContent = counter
}