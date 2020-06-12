import store from './store.js';
import api from './api.js';

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
  console.log('mapped new list items');
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
  console.log(bookmarksString);
  $('.js-bookmarks-list').html(bookmarksString);
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
    console.log(newBookmark.rating);
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
  handleNewBookmarkSubmit();
};

export default {
  boundFunctions,
  render
};
