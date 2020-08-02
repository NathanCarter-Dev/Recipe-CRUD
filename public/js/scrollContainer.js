


let containerWidth;
let offset = 0;

const buttonRight = document.querySelectorAll('.slideRight')

buttonRight.forEach((e) => {
  e.onclick = function (e) {
     containerWidth = this.parentNode.clientWidth + this.parentNode.offsetWidth
    offset += this.parentNode.clientWidth;
    console.log(containerWidth)
    if(offset > containerWidth) {
      offset = containerWidth 
    }
    
    $(this.parentNode).animate({scrollLeft: offset}, 400);
  };
})

const buttonLeft = document.querySelectorAll('.slideLeft')
buttonLeft.forEach((e) => {
  e.onclick = function (e) {
    containerWidth = this.parentNode.clientWidth + this.parentNode.offsetWidth
    offset -= this.parentNode.clientWidth;
    if(offset < 0 ) {
      offset = 0
    }
    
    $(this.parentNode).animate({scrollLeft: offset}, 400);
    
  };
})






