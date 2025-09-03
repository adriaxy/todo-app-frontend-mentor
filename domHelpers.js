import {
    countActiveItems
} from './helpers.js'

export function changeClassVisibility(element, list, flag){
      const id = Number(element.id)
      const index = getIndexByKey(list, id, 'id');
      const completed = list[index].completed
      if(completed === flag){
        element.classList.add('show');
        element.classList.remove('hide');
      } else {
        element.classList.add('hide');
        element.classList.remove('show');
      }
}

function getIndexByKey(list,targetValue, key){
  return list.findIndex(element => element[key] === targetValue);
}

export function updateItemsLeftUI(text, list){
  text.textContent = countActiveItems(list);
}

export function createNewItem(list, inputElement){
  list.unshift(
    {
      text: inputElement.value,
      completed: false,
      id: Date.now()
    }
  )
};


