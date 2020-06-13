import store from './store.js';
import api from './api.js';

const generateStartPage = function() {
  console.log('start page loaded');
  return `
  <header class="group" id="js-start-page">
    <h1> Your Bookmarks</h1>
    <button id="js-add-item" class="item">+Add Item+</button>
    <button id="js-filter-by" class="item">-Filter By-</button>
  </header>
  <main class="js-bookmarks group">
  <ul id="js-bookmarks-list" class="whole-ul-styles">
  </ul>
  </main>`;
};

const generateAddBookmarkSection = function () {
  console.log('So you want to add a new bookmark?');
  return `
  <header class="group" id="js-start-page"> <h1>Your Bookmarks</h1> 
  <form class="js-new-bookmark">
    <fieldset><legend>Enter a new bookmark here</legend>
      <input type="text" name="js-new-title" class="title-styles" placeholder="e.g. Best Coding Bootcamp Ever" required/>
      <input type="text" name="js-new-url" class="url-styles" placeholder="e.g. www.Thinkful.com" required/>
      <textarea name="js-new-desc" class="desc-styles" rows="4" cols="20" placeholder="e.g. Thinkful Engineering Immersion is an all encompassing deep dive into the world of coding." required></textarea>
      <select name="js-new-rating" id="rating-styles">
        <option value="none" selected disabled hidden>1</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>  
      <button type="submit">Add Bookmark</button>
    </fieldset>
  </form>
  <button id="js-filter-by" class="item">-Filter By-</button></header>`;
};

const generateExpansion = function (bookmark) {
  console.log('Let us see the details');
  return `
    <fieldset><legend>${bookmark.title}</legend>
      <button><a href="${bookmark.url}" target="_blank">Visit Site</a></button>
      <textarea name="js-new-desc" class="desc-styles" rows="4" cols="20">${bookmark.desc}
      <span>${bookmark.rating}</span></textarea>
      <button>Delete</button>
    </fieldset>
  `;
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
  $('#js-start-page').html(generateAddBookmarkSection());
  console.log(store.adding);
};

const renderBookmarkDetails = function () {
  $('.js-toggle-expand').html(generateExpansion());
};

const handleStartPage = function () {
  api.getBookmarks()
    .then((oldBookmarks) => {
      oldBookmarks = [...oldBookmarks];
      const bookmarksString = generateBookmarksString(oldBookmarks);
      console.log(bookmarksString);
      console.log(store.adding);
      $('#js-bookmarks-list').html(bookmarksString);
    })
    .catch((error) =>{
      store.setError(error.message);
    });
};

const handleAddingPage = function () {
  $('#js-start-page').on('click','#js-add-item', event => {
    event.preventDefault();
    renderAddingSection();
  });
};

const handleExpand = function () {
  $('#js-start-page').on('click','.js-toggle-expand', event => {
    event.preventDefault();
    renderExpansion();
  });
};

const handleNewBookmarkSubmit =  function () {
  $('.js-new-bookmark').submit(event => {
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

const getItemId = function () {

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
  handleNewBookmarkSubmit();
  handleExpand();
};

export default {
  renderStartPage,
  boundFunctions
};
