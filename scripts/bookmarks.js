import store from './store.js';
import api from './api.js';

//------------------------  generators      ----------------------//
//------------------------  generators      ----------------------//
const generateStartPage = function() {
  return `
  <div class="js-header">
    <button id="js-add-item" class="button">Add Item</button>
    <button id="js-filterBy" class="button">Filter By</button>
  </div>`;
};

const generateFilterBySection = function () {
  return `
  <div class="js-header"></div>
  <div class="js-header-filter">
  <form> 
    <select id="js-filterBy-val" class="filterRating" name="filterBy">
      <option value="0" selected disabled hidden>Filter:</option>
      <option value="0">None</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <button id="cancel" class="button">Cancel</button>
  </form>
  </div`;
};

const generateAddBookmarkSection = function () {
  return `
  <div class="js-header" id="addDiv">
  <form class="js-new-bookmark mid-width" id="addSection">
    <fieldset class="mid-width" id="addField">
    <legend class="mid-width" id="addLegend">Add New Bookmark</legend>
      <input type="text" name="js-new-title" class="title-styles" size="25" placeholder=" Title e.g. Amazon" required />
      <input type="text" name="js-new-url" class="url-styles" size="22.5" placeholder="web address e.g. https://amazon.com" required />
      <div class="adding">
      <textarea name="js-new-desc" class="desc-styles" size="24" placeholder="Describe and rate it --------->"></textarea>
      <select name="js-new-rating" id="rating-styles">
        <option value="0" selected disabled hidden>Rating</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      </div>  
      <div class="submitAndCancel">
      <input type="submit" id="add-bookmark" class="button" required></input>
      <button type="click" id="cancel" class="button">Cancel</button>
      </div>
    </fieldset>
  </form>
  </div>`;
};

const generateExpansion = function (bookmark) {
  return `
  <li class="js-bookmark-element expanded" data-item-id="${bookmark.id}">
    <fieldset class="expanded"><legend align="center" class="expanded">${bookmark.title}</legend>
      <span align="center"><button class="button" id="visit-site">Visit Site</a></button></span>
      <textarea name="js-new-desc" align="center" class="desc-styles-expanded">${bookmark.desc}</textarea>
      <span align="center" class="rating">Rating of ${bookmark.rating}</span>
      <span align="center"><button class="js-delete button">Delete</button></span>
    </fieldset>
  </li>`;
};

const generateBookmarkElement = function (bookmark) {
  return `
  <li class="js-bookmark-element" data-item-id="${bookmark.id}">
      <h2>${bookmark.title}</h2> <h3>${bookmark.rating}</h3>
  </li>`;
};

const generateError = function (message) {
  return `
  <div class="js-header">
  <span>
  <button id="cancel">Reset</button>
  ${message}
  </span>
  </div>`;
};

const generateBookmarksString = function (bookmarksList) {
  const bookmarks = bookmarksList.map((bookmark) => {
    if(bookmark.expanded) {
      return generateExpansion(bookmark);
    } else {
      return generateBookmarkElement(bookmark);
    }
  });
  return bookmarks.join('');
};

//------------------------  renderers      ----------------------//
//------------------------  renderers      ----------------------//
const render = function () {
  let bookmarks = [...store.bookmarks];
  if (store.filter > 0){
    store.filter = parseInt(store.filter);
    bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter);
  }
  const bookmarksString = generateBookmarksString(bookmarks);
  $('#js-bookmarks').html(bookmarksString);
};

const renderStartPage = function ()  {
  $('.js-header').html(generateStartPage());
};

const renderAddingSection = function () {
  $('.js-header').html(generateAddBookmarkSection());
  store.adding = !store.adding;
};

const renderFilterBy = function () {
  $('.js-header').html(generateFilterBySection());
};

const renderError = function () {
  if (store.error) {
    const error = generateError(store.error);
    $('.js-header').html(error);
  }
};


//------------------------  handlers      ----------------------//
//------------------------  handlers      ----------------------//
const handleStartPage = function () {
  renderStartPage();
  if (store.adding===true) {
    store.adding===!store.adding;
    return render();
  }
  api.getBookmarks()
    .then((oldBookmarks) => {
      oldBookmarks.forEach((bookmark) => {
        store.addBookmark(bookmark);
      });
      render();
    })
    .catch((error) =>{
      console.log(error);
      store.setError(error.message);
    });
};

const handleAddingPage = function () {
  $('.js-header').on('click','#js-add-item', event => {
    event.preventDefault();
    renderAddingSection();
  });
};

const handleFilterByPage = function () {
  $('header').on('click','#js-filterBy', event => {
    event.preventDefault();
    renderFilterBy(store.filter);    
  });
};

const handleCancelButton = function () {
  $('header').on('click','#cancel', event => {
    event.preventDefault();
    renderStartPage();
    render();
  });
};

const handleExpand = function () {
  $('main').on('click','.js-bookmark-element', event => {
    event.preventDefault();
    const uniqueId = getBookmarkId(event.currentTarget);
    const bookmark = store.findById(uniqueId);
    store.findAndUpdate(uniqueId, {expanded: !bookmark.expanded});
    render();    
  });
};

const handleNewBookmarkSubmit =  function () {
  $('.js-header').submit(event => {
    event.preventDefault();
    store.filter = $('#js-filterBy-val :selected').val();
    const newBookmark = {};
    newBookmark.title = $('.title-styles').val();
    newBookmark.url = $('.url-styles').val();
    newBookmark.desc = $('.desc-styles').val();
    newBookmark.rating = $('#rating-styles :selected').val();
    if ( parseInt(store.filter) > 0 ) {
      return render();
    }
    api.createBookmarks(newBookmark)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.adding = !store.adding;
        renderStartPage();
        render();
      })
      .catch((error) =>{
        console.log(error);
        store.setError(error.message);
      });

  });
};

const handleFilterBy = function () {
  $('header').on('change','#js-filterBy-val', event => {
    event.preventDefault();
    store.filter = $('#js-filterBy-val :selected').val();
    renderStartPage();
    render();
  });
};

const handleDelete = function() {
  $('main').on('click', '.js-delete', event =>{
    const id = getBookmarkId(event.currentTarget);
    api.deleteBookmarks(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};

const handleVisitSiteClick = function () {
  $('main').on('click','#visit-site', event => {
    const id = getBookmarkId(event.currentTarget);
    const bookmark = store.findById(id);
    window.open(`${bookmark.url}`);
  });
};

const handleCloseError = function () {
  $('main').on('click', '#cancel', () => {
    store.setError(null);
    renderError();
  });

};

//------------------------  misc      ----------------------//
//------------------------  misc      ----------------------//
const getBookmarkId = function (atom) {
  return $(atom)
    .closest('.js-bookmark-element')
    .data('item-id');
};

//------------------------  end     ----------------------//
//------------------------  end     ----------------------//
const boundFunctions = function() {
  handleStartPage();
  handleAddingPage();
  handleCancelButton();
  handleNewBookmarkSubmit();
  handleExpand();
  handleVisitSiteClick();
  handleDelete();
  handleFilterByPage();
  handleFilterBy();
  handleCloseError();
};

export default {
  renderStartPage,
  render,
  boundFunctions
};
