export function countActiveItems(list){
  return list.filter((item) => !item.completed).length
}
