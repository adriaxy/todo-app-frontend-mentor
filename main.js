const divSummary = document.querySelector('.todo-summary');
const stateButtons = document.querySelector('.state-buttons');
const interactiveSection = document.querySelector('.interactive-content');
const divFooter = document.createElement('div');
divFooter.className = 'div-footer';

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

// Se ejecuta al cargar la página
window.addEventListener('DOMContentLoaded', repositionDiv)
// Se ejecuta cuando se cambia el tamaño de la ventana
window.addEventListener('resize', repositionDiv);

