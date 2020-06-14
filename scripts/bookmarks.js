import store from './store.js';
import api from './api.js';

const generateStartPage = function() {
  console.log('Only The Header');
  return `
  <div class="js-header">
    <button id="js-add-item" class="item">+Add Item+</button>
    <button id="js-filterBy" class="item">-Filter By-</button>
  </div>`;
};

const generateFilterBySection = function () {
  console.log('filter template generated');
  return `
  <div class="js-header-filter">
  <form> 
    <select id="js-filterBy-val">
      <option value="none" selected disabled hidden>0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <input type="submit" id="js-filterBy-submit"></input>
    <button id="cancel">Cancel</button>
  </form>
  </div`;
};

const generateAddBookmarkSection = function () {
  console.log('So you want to add a new bookmark?');
  return `
  <div class="js-header">
  <form class="js-new-bookmark">
    <fieldset>
    <legend>Enter a new bookmark here</legend>
      <input type="text" name="js-new-title" class="title-styles" placeholder="e.g. Best Coding Bootcamp Ever" required />
      <input type="text" name="js-new-url" class="url-styles" placeholder="e.g. www.Thinkful.com" required />
      <textarea name="js-new-desc" class="desc-styles" rows="2" cols="16" placeholder="e.g. Thinkful Engineering Immersion is an all encompassing deep dive into the world of coding."></textarea>
      <select name="js-new-rating" id="rating-styles">
        <option value="none" selected disabled hidden>1</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>  
      <input type="submit" id="add-bookmark" required>Add Bookmark</input>
      <button type="click" id="cancel">Cancel</button>
    </fieldset>
  </form>
  </div>`;
};

const generateExpansion = function (bookmark) {
  console.log(`Let us see the details of ${bookmark}`);
  return `
  <li class="js-bookmark-element" data-item-id="${bookmark.id}">
    <fieldset><legend>${bookmark.title}</legend>
      <span><button><a href="${bookmark.url}" target="_blank">Visit Site</a></button></span>
      <textarea name="js-new-desc" class="desc-styles" rows="2" cols="16">${bookmark.desc}</textarea>
      <span>${bookmark.rating}</span>
      <button class="js-toggle-collapse">Collapse</button>
      <button class="js-delete">Delete</button>
    </fieldset>
  </li>`;
};

const generateBookmarkElement = function (bookmark) {
  console.log('collapsed view templates generated');
  return `
  <li class="js-bookmark-element" data-item-id="${bookmark.id}">
      <span class="js-bookmark-title title-styles">${bookmark.title} and ${bookmark.rating}</span> 
      <button class="js-toggle-expand">Expand</button>
      <button class="js-delete">Delete</button>
  </li>`;
};

const generateBookmarksString = function (bookmarksList) {
  const bookmarks = bookmarksList.map((bookmark) => {
    if(bookmark.expanded) {
      return generateExpansion(bookmark);
    } else {
      return generateBookmarkElement(bookmark);
    }
  });
  console.log(bookmarks);
  return bookmarks.join('');
};

//------------------------  renderers      ----------------------//
//------------------------  renderers      ----------------------//
const render = function () {
  console.log('we got bookmarks rendered');
  let bookmarks = [...store.bookmarks];
  if (store.filter > 0){
    console.log('type is '+typeof(store.filter));
    console.log('type of ratings is '+typeof(bookmarks[0].rating));
    store.filter = parseInt(store.filter);
    bookmarks = bookmarks.filter(bookmark => bookmark.rating ===store.filter);
  }
  console.log(bookmarks);
  const bookmarksString = generateBookmarksString(bookmarks);
  $('#js-bookmarks').html(bookmarksString);

};

const renderStartPage = function ()  {
  $('.js-header').html(generateStartPage());
  console.log('Start Page Rendered');
};

const renderAddingSection = function () {
  $('.js-header').html(generateAddBookmarkSection());
  store.adding = !store.adding;
  console.log(store.adding);
};

const renderFilterBy = function () {
  $('.js-header-filter').html(generateFilterBySection());
};

//------------------------  handlers      ----------------------//
//------------------------  handlers      ----------------------//
const handleStartPage = function () {
  renderStartPage();
  if (store.adding===true) {
    store.adding===!store.adding;
    console.log(store.adding);
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
    console.log(event.currentTarget);
    renderFilterBy(store.filter);    
  });
};

const handleCancelButton = function () {
  $('header').on('click','#cancel', event => {
    event.preventDefault();
    console.log(event.currentTarget);
    return handleStartPage();
  });
};

const handleExpand = function () {
  $('main').on('click','.js-toggle-expand', event => {
    event.preventDefault();
    const uniqueId = getBookmarkId(event.currentTarget);
    const bookmark = store.findById(uniqueId);
    console.log(`Expanding item: ${uniqueId}`);
    store.findAndUpdate(uniqueId, {expanded: !bookmark.expanded});
    render();    
  });
};

const handleCollapse = function () {
  $('main').on('click','.js-toggle-collapse', event => {
    event.preventDefault();
    const uniqueId = getBookmarkId(event.currentTarget);
    const bookmark = store.findById(uniqueId);
    console.log(`Expanding item: ${uniqueId}`);
    store.findAndUpdate(uniqueId, {expanded: !bookmark.expanded});
    render();
  });
};

const handleNewBookmarkSubmit =  function () {
  $('.js-header').submit(event => {
    event.preventDefault();
    const newBookmark = {};
    newBookmark.title = $('.title-styles').val();
    newBookmark.url = $('.url-styles').val();
    newBookmark.desc = $('.desc-styles').val();
    newBookmark.rating = $('#rating-styles :selected').val();
    console.log('gathered submission');
    api.createBookmarks(newBookmark)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.adding = !store.adding;
        console.log(store.adding);
        renderStartPage();
        render();
      })
      .catch((error) =>{
        store.setError(error.message);
      });

  });
};

const handleFilterBy = function () {
  $('.js-header-filter').submit(event => {
    console.log(event.currentTarget);
    event.preventDefault();
    const rating = $('#js-filterBy-val :selected').val();
    store.filter = rating;
    console.log(`filtering for bookmarks with rating ${store.filter}`);
    render();
  });
};

const getBookmarkId = function (atom) {
  return $(atom)
    .closest('.js-bookmark-element')
    .data('item-id');
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



const generateError = function () {

};

const renderError = function () {

};

const handleCloseError = function () {

};


const boundFunctions = function() {
  handleStartPage();
  handleAddingPage();
  handleCancelButton();
  handleNewBookmarkSubmit();
  handleExpand();
  handleCollapse();
  handleDelete();
  handleFilterByPage();
  handleFilterBy();
};

export default {
  renderStartPage,
  render,
  boundFunctions
};
