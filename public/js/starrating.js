const rating = document.querySelectorAll('[class^="rating-"]')
const post = document.querySelectorAll(".post").forEach((post) => {
  
  var status = post.dataset.starwidth;
  const width = status * 30
  console.log(width)
  post.style.width = width +"px"
})
  const star = document.querySelectorAll('[class^="rating-"]').forEach((star) => {

    star.addEventListener('click', (e) => {
      
      var postId = star.dataset.id;
      var stars = star.dataset.star

      axios.post("/recipes/rating", {data: {postId, stars}}).then((res)=> {
        console.log(res)
        var status = res.data.recipe.starStatus;
        const width = status * 30
        
        if(res.data.user.starredPosts.includes(postId)) {
          const p = document.querySelectorAll('.p-' + postId)
           p.forEach((e) => e.textContent = res.data.recipe.usersStarred)
           const post = document.querySelectorAll(".post-"+postId)
           console.log(post)
           post.forEach((e) => e.style.width = width+"px")
        } else {
          const p = document.querySelectorAll('.p-' + postId)
           p.forEach((e) => e.textContent = res.data.recipe.usersStarred)
           const post = document.querySelectorAll(".post-"+postId)
           console.log(post)
           post.forEach((e) => e.style.width = width+"px")
        }
      })
    })
  })


  for(let i = 0; i < rating.length; i++) {
    rating[i].addEventListener("mouseover", (e) => {
      var stars = rating[i].dataset.star
      for(let j = 0; j < stars; j++) {
        rating[i + j].classList.add("star-color")
      }
    })
  }
  for(let i = 0; i < rating.length; i++) {
    rating[i].addEventListener("mouseout", (e) => {
      var stars = rating[i].dataset.star
      for(let j = 0; j < stars; j++) {
        rating[i + j].classList.remove("star-color")
      }
    })
  }
