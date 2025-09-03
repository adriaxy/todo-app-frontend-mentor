export function countActiveItems(list){
  return list.filter((item) => !item.completed).length
}


export function findIndexItem(list, targetValue, key){
  return list.findIndex(element => element[key] === targetValue);
}
