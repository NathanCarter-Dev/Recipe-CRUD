


var actOnPost = function (event) {
  var postId = event.target.dataset.post;
  axios.post('/recipes/' + postId + '/favourite').then(function(response) {
  axios.get('/recipes/:id/favourite').then(function(response) {
    var data = response.data
    if(data.data.favouritePosts.includes(postId)) {
      const fav = document.querySelectorAll('.favourite-' + postId)
      fav.forEach((e) => {
        e.classList.remove("unfavourited-color")
        e.classList.add("favourited-color")
      })
    } else {
      const fav = document.querySelectorAll('.favourite-' + postId)
      fav.forEach((e) => {
        e.classList.add("unfavourited-color")
        e.classList.remove("favourited-color") 

      })

    }
  })
  });

};
