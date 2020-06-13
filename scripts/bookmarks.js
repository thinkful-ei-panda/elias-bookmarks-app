import store from './store.js';
import api from './api.js';

const generateStartPage = function() {
  console.log('start page loaded');
  return `
  <header id="js-header" class="group" >
    <h1> Your Bookmarks</h1>
    <button id="js-add-item" class="item">+Add Item+</button>
    <button id="js-filter-by" class="item">-Filter By-</button>
  </header>

  <main id="js-bookmarks" class="group">
  <ul id="js-bookmarks-list" class="whole-ul-styles">
  </ul>
  </main>`;
};

const generateAddBookmarkSection = function () {
  console.log('So you want to add a new bookmark?');
  return `
  <header id="js-header" class="group"> <h1>Your Bookmarks</h1> 
  <form class="js-new-bookmark" onsubmit="event.preventDefault(); renderStartPage();">
    <fieldset><legend>Enter a new bookmark here</legend>
      <input type="text" name="js-new-title" class="title-styles" placeholder="e.g. Best Coding Bootcamp Ever" required/>
      <input type="text" name="js-new-url" class="url-styles" placeholder="e.g. www.Thinkful.com" required/>
      <textarea name="js-new-desc" class="desc-styles" rows="4" cols="20" placeholder="e.g. Thinkful Engineering Immersion is an all encompassing deep dive into the world of coding."></textarea>
      <select name="js-new-rating" id="rating-styles">
        <option value="none" selected disabled hidden>1</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>  
      <button type="submit">Add Bookmark</button>
      <button type="submit">Cancel</button>
    </fieldset>
  </form>
  <button id="js-filter-by" class="item">-Filter By-</button></header>`;
};

const generateHeaderSection = function () {
  console.log('Only The Header');
};

const generateExpansion = function (bookmark) {
  console.log('Let us see the details');
  return `
  <li class="js-bookmark-element" data-item-id="${bookmark.id}">
    <fieldset><legend>${bookmark.title}</legend>
      <button><a href="${bookmark.url}" target="_blank">Visit Site</a></button>
      <textarea name="js-new-desc" class="desc-styles" rows="4" cols="20">${bookmark.desc}
      <span>${bookmark.rating}</span></textarea>
      <button>Delete</button>
    </fieldset>
  </li>`;
};

const generateBookmarkElement = function (bookmark) {
  console.log('templates are being generated');
  return `
  <li class="js-bookmark-element" data-item-id="${bookmark.id}">
      <span class="js-bookmark-title title-styles">${bookmark.title} and ${bookmark.rating}</span> 
      <button class="js-toggle-expand">ExPanD</button>
  </li>`;
};

const generateBookmarksString = function (bookmarksList) {
  const bookmarks = bookmarksList.map((bookmark) => generateBookmarkElement(bookmark));
  console.log('mapped list items');
  return bookmarks.join('');
};

const generateError = function () {

};

const renderError = function () {

};

const handleCloseError = function () {

};

const render = function () {
  console.log('we got render');
  let bookmarks = [...store.bookmarks];
  console.log(bookmarks);
  bookmarks.forEach((bookmark)=>{
    if(bookmark.expanded===true){
      renderBookmarkDetails(bookmark);
    }
  });
  const bookmarksString = generateBookmarksString(bookmarks);
  //console.log(bookmarksString);
  //console.log(store.adding);
  
  $('#js-bookmarks-list').html(bookmarksString);

};

const renderStartPage = function ()  {
  $('body').html(generateStartPage());
  const bookmarksString = generateBookmarksString(store.bookmarks);
  $('#js-bookmarks-list').html(bookmarksString);
  console.log('Start Page Rendered');
};

const renderAddingSection = function () {
  $('#js-header').html(generateAddBookmarkSection());
  store.adding = !store.adding;
  console.log(store.adding);
};

const renderBookmarkDetails = function (bookmark) {
  $('#js-bookmarks-list').html(generateExpansion(bookmark));
};

const handleStartPage = function () {
  api.getBookmarks()
    .then((oldBookmarks) => {
      console.log(oldBookmarks);
      oldBookmarks.forEach((bookmark) => {
        store.addBookmark(bookmark);
      });
      render();
    })
    .catch((error) =>{
      store.setError(error.message);
    });
};

const handleAddingPage = function () {
  $('#js-header').on('click','#js-add-item', event => {
    event.preventDefault();
    renderAddingSection();
  });
};

const handleExpand = function () {
  $('#js-bookmarks-list').on('click','.js-toggle-expand', event => {
    //event.preventDefault();
    const id = getBookmarkId(event.currentTarget);
    
    api.updateBookmark(id, {expanded: false})
      .then(() => {
        api.getBookmarks()
          .then((oldBookmarks) => {
            console.log(oldBookmarks);
            oldBookmarks.forEach((bookmark) => {
              store.addBookmark(bookmark);
            });
            render();
          })
          .catch((error) =>{
            store.setError(error.message);
          });
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
    
    store.toggleExpandButton(id);
    const bookmark = store.findById(id);
    render();
  });
};

const handleNewBookmarkSubmit =  function () {
  $('body').submit(event => {
    console.log('gathered submission');
    event.preventDefault();
    const newBookmark = {};
    newBookmark.title = $('.title-styles').val();
    newBookmark.url = $('.url-styles').val();
    newBookmark.desc = $('.desc-styles').val();
    newBookmark.rating = $('#rating-styles :selected').val();

    api.createBookmarks(newBookmark)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        render();
      })
      .catch((error) =>{
        store.setError(error.message);
      });
  });
};

const handleCancelbutton = function () {
  $('.js-header').submit(event => {
    event.preventDefault();
    renderStartPage();
  });
};

const getBookmarkId = function (atom) {
  return $(atom)
    .closest('.js-bookmark-element')
    .data('item-id');
};

const handleDeleteItemClick = function() {
};

const handleToggleExpand = function ()  {

};

const handleFilterBy = function () {

};


const boundFunctions = function() {
  handleStartPage();
  handleAddingPage();
  handleCancelbutton();
  handleNewBookmarkSubmit();
  handleExpand();
  console.log(store.bookmarks);
};

export default {
  renderStartPage,
  boundFunctions
};
