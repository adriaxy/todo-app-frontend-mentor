import {
  countActiveItems
} from './helpers.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const $id = id => document.getElementById(id);

const body = $('body');
const form = $('.todo-form');
const input = $id('todo-input');
const emptyList = $('.empty-list');
const listContainer = $('.list-container');
const divSummary = $('.todo-summary');
const stateButtons = $('.state-buttons');
const interactiveSection = $('.interactive-content');
const divFooter = document.createElement('div');
divFooter.className = 'div-footer';
const itemsLeftText = $('.items-left');

// Buttons
const btnTheme = $('.btn-theme');
const darkBtn = $('.dark-theme-svg')
const lightBtn = $('.light-theme-svg');
const addItemBtn = $('.add-item-btn');
const btnDelete = $('.delete');
const currentBtn = $$('.btn-state');
const clearCompleted = $('.btn-clear-completed');

// Flags
let isDeletedVisible = null;
let isAnimating = false;
let currentFilter = 'all';

// Functions
const isEmpty = () => listItems.length === 0; 
const current = () => body.dataset.theme;
const changeFilter = (filter) => currentFilter = (filter);
const showEmptyListMessage = () => emptyList.style.display = 'flex';

// Display modes
let modes = {
    all: 'all',
    active: 'active',
    completed: 'completed'
  }

// Todos
let listItems = []



stateButtons.addEventListener('click', (e)=> {
  if(isEmpty()){
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
    changeFilter(modes.all);
    liElements.forEach((li) => {
      li.classList.remove('hide');
      li.classList.add('show');
    })
  };
  if(active){
    addClassToSelectedBtn(selectedBtn);
    changeFilter(modes.active);
    filterLiElements(liElements, false);
    console.log(listItems)
  }
  if(completed){
    addClassToSelectedBtn(selectedBtn);
    changeFilter(modes.completed);
    filterLiElements(liElements, true);
  }
  itemsLeft();
});

clearCompleted.addEventListener('click', ()=> {
  if(isEmpty())return;
    console.log(listItems)
  const liElements = $$('li');
  listItems = listItems.filter(item => !item.completed);
  liElements.forEach(li => {
    const liId = Number(li.id);
    if(!listItems.find(item => item.id === liId)) li.remove();
  })
  console.log(listItems)
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
  updateItemsLeftUI(itemsLeftText, listItems)
}

function createNewItem(inputElement){
  listItems.unshift(
    {
      text: inputElement.value,
      completed: false,
      id: Date.now()
    }
  )
};

function addItem(){
  emptyList.style.display='none';
      createNewItem(input);
      const visibilityClass = currentFilter === 'completed' ? 'hide' : 'show'
      // const lastItem = listItems.length-1;
      const newLi = addItemToList(listItems[0].id, listItems[0].text, visibilityClass)
      listContainer.prepend(newLi);
      input.value = '';
}

listContainer.addEventListener('click', (e)=> {
  if(isEmpty())return;

  const btn = e.target.closest('button');
  if (btn) {
    const li = btn.closest('li');
    if (!li) return; 
    const id = Number(li.id);
    const index = findIndexItem(id, 'id');
    if (index !== -1) listItems.splice(index, 1);
    li.remove();
    if(isEmpty()) showEmptyListMessage();
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
   } else {
    todoText.classList.remove('completed');
    customCheck.classList.remove('round-check');
    customCheckSVG.style.display = 'none';
    customCheck.classList.add('round-hoverable');
    li.classList.remove('hide');
    itemsLeft();
   }

   if(currentFilter === modes.active){
    filterLiElements(li, false);
  } else if(currentFilter === modes.completed){
      filterLiElements(li, true);
  } else { // all
      li.classList.remove('hide');
      li.classList.add('show');
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
  li.id = id
  li.setAttribute('draggable', 'true');
  li.tabIndex = 0;

  li.innerHTML = `<label for="input-${id}" class="label-li">
        <input type="checkbox" data-input="${id}">
        <span class="custom-check round round-hoverable" data-check="${id}" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" data-svg="${id}" class="check-svg"><path fill="none" stroke="#fff" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
        </span>
        <span class="todo-text" data-text="${id}">${text}</span>
      </label>
      <button type="button" class="delete" data-id="${id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="var(--accent)" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
      </button>`;

      li.addEventListener('dragstart', (e)=>{
        e.dataTransfer.clearData();
        e.dataTransfer.setData('text/plain', e.target.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      li.addEventListener('dragover', (e)=> {
        e.preventDefault();
        e.dataTransfer.effectAllowed = 'move';
      });

      li.addEventListener('drop', (e)=>{
        e.preventDefault();
        const data = e.dataTransfer.getData('text');
        const source = document.getElementById(data);
        const targetLi = e.target.closest('li');
        const targetId = targetLi.id;
  
        if(!targetLi || targetLi === source) return; 
        // const draggedElementIndex = listItems.findIndex(item => item.id === Number(source.id));
        const draggedElementIndex = findIndexItem(Number(source.id), 'id');
        // const dropElementIndex = listItems.findIndex(item => item.id === Number(targetId));

        const targetLiMeasures = targetLi.getBoundingClientRect();
        const midpoint = targetLiMeasures.top + targetLiMeasures.height / 2;

        
        
        if(e.clientY < midpoint){
          const liElementOnListItems = listItems[draggedElementIndex];
          const targetIndex = findIndexItem(Number(targetLi.id), 'id');
          listItems.splice(draggedElementIndex, 1);
          if(draggedElementIndex < targetIndex){
            listItems.splice(targetIndex -1, 0, liElementOnListItems);
            } else {
            listItems.splice(targetIndex, 0, liElementOnListItems);
            }
          listContainer.insertBefore(source, targetLi);
        } else{
          const liElementOnListItems = listItems[draggedElementIndex];
          const targetIndex = findIndexItem(Number(targetLi.id), 'id');
          listItems.splice(draggedElementIndex, 1);
          listItems.splice(targetIndex, 0, liElementOnListItems);
          listContainer.insertBefore(source, targetLi.nextSibling);
        }
      })

      return li;
    }



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

  if(!isEmpty()){
    const buttons = $$('.delete');
    buttons.forEach(btn => btn.classList.toggle('delete-dark'));
  }
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
});

function toggleTheme() {
  body.dataset.theme = current() === 'dark' ? 'light' : 'dark';
}

function updateItemsLeftUI(text, list){
  text.textContent = countActiveItems(list);
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

