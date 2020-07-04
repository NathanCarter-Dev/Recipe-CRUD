var actOnPost = function (event) {
  var postId = event.target.dataset.postId;
  axios.post('/recipes/' + postId + '/favourite').then(function(response) {
  axios.get('/recipes/:id/favourite').then(function(response) {
    var data = response.data
    if(data.data.favouritePosts.includes(postId)) {
      document.querySelector('#favourite-' + postId).textContent="Unfavourite";
    } else {
      document.querySelector('#favourite-' + postId).textContent="Favourite";
    }
  })
  });

};
