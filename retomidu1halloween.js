function createMagicPotion(potions, target) {
  

  let obj = {};
  let estado = true; 

  for(let i=0; i<potions.length; i++){
    if(potions[i] === 4){
    let elemento = potions[i];
    obj[potions.indexOf(potions[i])] = elemento - target;
    estado = false; 
    } else {
      //let valores = Object.values(obj)
      //valores.
      let i = 0;
    }
  }

  console.log(obj)

  return undefined
}

