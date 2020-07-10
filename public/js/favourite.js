
var actOnPost = function (event) {
  var postId = event.target.dataset.postId;
  axios.post('/recipes/' + postId + '/favourite').then(function(response) {
  axios.get('/recipes/:id/favourite').then(function(response) {
    var data = response.data
    if(data.data.favouritePosts.includes(postId)) {
      const fav = document.querySelectorAll('.favourite-' + postId)
      fav.forEach((e) => e.textContent = "Unfavourite")
    } else {
      const fav = document.querySelectorAll('.favourite-' + postId)
      fav.forEach((e) => e.textContent = "Favourite")

    }
  })
  });

};
