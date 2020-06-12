import store from './store.js';
import api from './api.js';

const generateItemElement = function () {

};

const generateBookmarksString = function () {

};

const generateError = function () {

};

const renderError = function () {

};

const handleCloseError = function () {

};

const render = function () {

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
      .then((newBookmark) => console.log(newBookmark));
  });
};

const getItemId = function () {

};

const handleDeleteItemClick = function() {

};

const handleToggleExpand = function ()  {

};


const boundFunctions = function() {
  handleNewBookmarkSubmit();
};

export default {
  boundFunctions,
  render
};
