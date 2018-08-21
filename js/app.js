(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  document.querySelector('button').addEventListener('click', function(e) {
    e.preventDefault();
    // Process the search term so it can be appended to API call
    const input = document.getElementById('search').value;
    if (input) {
      // Clear out the previous search results
      movies.length = 0;
      // API call for search
      axios.get(`http://www.omdbapi.com/?apikey=80756297&s=${input}`)
      .then(searchResponse => {
        // Use promise array to wait for multiple asynchronous api calls
        let promiseArr = [];
        // Make an API call using the imdbID of each movie returned by search
        for (const searchResult of searchResponse.data.Search) {
          promiseArr.push(axios.get(`http://www.omdbapi.com/?apikey=80756297&i=${searchResult.imdbID}&plot=full`));
        }
        return Promise.all(promiseArr);
      }).then(promises => {
        for (const promise of promises) {
          // Build movie object
          const movieObj = promise.data;
          movies.push({
            'id': movieObj.imdbID,
            'poster': movieObj.Poster,
            'title': movieObj.Title,
            'year': movieObj.Year,
            'plot': movieObj.Plot
          });
        }
        renderMovies();
      });
    }
  });
})();
