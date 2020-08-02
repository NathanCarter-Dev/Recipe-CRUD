

let containerWidth;
let offset = 0;

const buttonRight = document.querySelectorAll('.slideRight')

buttonRight.forEach((e) => {
  e.onclick = function (e) {
     containerWidth = this.parentNode.scrollWidth
    offset +=600;
    if(offset < 0 ) {
      offset = 0
    }
    if(offset > containerWidth) {
      offset = containerWidth
    }
    console.log(containerWidth)
    console.log(this.parentNode)
    $(this.parentNode).animate({scrollLeft: offset}, 400);
  };
})

const buttonLeft = document.querySelectorAll('.slideLeft')
buttonLeft.forEach((e) => {
  e.onclick = function (e) {
    containerWidth = document.getElementById('container').scrollWidth
    offset -=600;
    if(offset < 0 ) {
      offset = 0
    }
    if(offset > containerWidth) {
      offset = containerWidth
    }
    console.log(containerWidth)
    console.log(this.parentNode)
    
    $(this.parentNode).animate({scrollLeft: offset}, 400);
    
  };
})






