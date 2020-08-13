/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
    // TODO: Make an ajax request to the searchShows api.  Remove
    // hard coded data.

    const res = await axios.get("http://api.tvmaze.com/search/shows", {
        params: {
            q: query
        }
    })
    let shows = [];
    for (let i = 0; i < res.data.length; i++) {
        let showRes = res.data[i].show
        let id = showRes.id;
        let name = showRes.name;
        let summary = showRes.summary;
        let image;
        if (showRes.image) {
            image = showRes.image.medium;
        } else {
            image = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"
        }
        shows.push({ id, name, summary, image })
    }
    return shows;
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
    const $showsList = $("#shows-list");
    $showsList.empty();

    for (let show of shows) {
        let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-info" data-toggle="modal">Show Episodes</button>
           </div>
         </div>
       </div>
      `);

        $showsList.append($item);
    }
}

$("#shows-list").on("click", "button", async function() {
    let epId = $(this).parent().parent().attr("data-show-id");
    const epiList = await getEpisodes(epId);
    for (episode of epiList) {
        $(("<div>")).html(episode.id).addClass("col-md-2").appendTo($("#episodes-list"));
        $(("<div>")).html(episode.name).addClass("col-md-6").appendTo($("#episodes-list"));
        $(("<div>")).html(episode.season).addClass("col-md-2").appendTo($("#episodes-list"));
        $(("<div>")).html(episode.number).addClass("col-md-2").appendTo($("#episodes-list"));
    }
    $('#episodes-area').modal('show');
});
/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
    evt.preventDefault();

    let query = $("#search-query").val();
    if (!query) return;

    $("#episodes-area").hide();

    let shows = await searchShows(query);

    populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
    // TODO: get episodes from tvmaze
    //       you can get this by making GET request to
    //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

    // TODO: return array-of-episode-info, as described in docstring above
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    let episodesRes = [];
    for (let i = 0; i < res.data.length; i++) {
        let id = res.data[i].id;
        let name = res.data[i].name;
        let season = res.data[i].season;
        let number = res.data[i].number;
        episodesRes.push({ id, name, season, number })
    }
    return episodesRes;
}