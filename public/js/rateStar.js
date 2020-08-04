

const star = document.querySelectorAll('[class^="rating-"]').forEach((star) => {

  star.addEventListener('click', (e) => {
    
    var postId = star.dataset.id;
    var stars = star.dataset.star

    axios.post("/recipes/rating", {data: {postId, stars}}).then((res)=> {
 
      var status = res.data.recipe.starStatus;
      const width = status * 20
      
      if(res.data.user.starredPosts.includes(postId)) {
        const p = document.getElementById("usersStarred")
         p.textContent ="(" + res.data.recipe.usersStarred + ")"
         const post = document.querySelectorAll(".post-"+postId)
         console.log(p)
         post.forEach((e) => e.style.width = width+"%")
      } else {
        console.log(res.data)
        const p = document.getElementById("usersStarred")
        p.textContent = "(" + res.data.recipe.usersStarred + ")"
        console.log(p)
         const post = document.querySelectorAll(".post-"+postId)

         post.forEach((e) => e.style.width = width+"%")
      }
    })
  })
})


for(let i = 0; i < rating.length; i++) {
  rating[i].addEventListener("mouseover", (e) => {
    var stars = rating[i].dataset.star
    for(let j = 0; j < stars; j++) {
      rating[i - j].classList.add("star-color")
    }
  })
}
for(let i = 0; i < rating.length; i++) {
  rating[i].addEventListener("mouseout", (e) => {
    var stars = rating[i].dataset.star
    for(let j = 0; j < stars; j++) {
      rating[i - j].classList.remove("star-color")
    }
  })
}