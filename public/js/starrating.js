const rating = document.querySelectorAll('[class^="rating-"]')
const post = document.querySelectorAll(".post").forEach((post) => {

  var status = post.dataset.starwidth;

  
  const width = status * 20

  post.style.width = width +"%"
})
