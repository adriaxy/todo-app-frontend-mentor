import {
    countActiveItems,
    findIndexItem
} from '../utils/array.js'

export function changeClassVisibility(element, list, flag){
      const id = Number(element.id)
      const index = findIndexItem(list, id, 'id');
      const completed = list[index].completed
      if(completed === flag){
        element.classList.add('show');
        element.classList.remove('hide');
      } else {
        element.classList.add('hide');
        element.classList.remove('show');
      }
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

export function changeCompletedState(list, id){
  const liId = Number(id);
  const index = findIndexItem(list ,liId, 'id');
  const result = index !== -1 
    ? list[index].completed = !list[index].completed 
    : null;
  return result;
}


