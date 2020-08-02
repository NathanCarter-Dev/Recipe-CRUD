


let containerWidth;
let clientWidth

const buttonRight = document.querySelectorAll('.slideRight')

buttonRight.forEach((e) => {
  e.onclick = function (e) {
    clientWidth = this.parentNode.clientWidth
     containerWidth = this.parentNode.scrollWidth

    
    $(this.parentNode).animate({scrollLeft: '+=' + clientWidth + 'px'}, 400);
  };
})

const buttonLeft = document.querySelectorAll('.slideLeft')
buttonLeft.forEach((e) => {
  e.onclick = function (e) {
    clientWidth = this.parentNode.clientWidth
    containerWidth = this.parentNode.scrollWidth



    
    $(this.parentNode).animate({scrollLeft: '-=' + clientWidth + 'px'}, 400);
    
  };
})






