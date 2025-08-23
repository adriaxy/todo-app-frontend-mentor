const divSummary = document.querySelector('.todo-summary');
const stateButtons = document.querySelector('.state-buttons');
const interactiveSection = document.querySelector('.interactive-content');
const divFooter = document.createElement('div');
divFooter.className = 'div-footer';

//Color theme
const btnTheme = document.querySelector('.btn-theme');
const body = document.querySelector('body');
const darkBtn = document.querySelector('.dark-theme-svg')
const lightBtn = document.querySelector('.light-theme-svg');
let isAnimating = false;


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
})


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



