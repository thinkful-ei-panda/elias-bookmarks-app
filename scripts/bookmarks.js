import store from './store.js';
import api from './api.js';

const generateStartPage = function() {
  console.log('start page loaded');
  return `
  <header id="js-header" class="group">
  <h1> Your Bookmarks</h1>
  <div >
    <button id="js-add-item" class="item">+Add Item+</button>
    <button id="js-filter-by" class="item">-Filter By-</button>
  </div>
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
  <button id="js-filter-by" class="item">-Filter By-</button></header>`;
};

/* const generateHeaderSection = function () {
  console.log('Only The Header');
};
 */
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

const render = function () {
  console.log('we got render');
  let bookmarks = [...store.bookmarks];
  /* if(store.filter === 5){
    //bookmarks = store.filterBy
  } */
  const bookmarksString = generateBookmarksString(bookmarks);
  $('#js-bookmarks-list').html(bookmarksString);

};

const renderStartPage = function ()  {
  $('body').html(generateStartPage());
  console.log('Start Page Rendered');
};

const renderAddingSection = function () {
  $('header').html(generateAddBookmarkSection());
  store.adding = !store.adding;
  console.log(store.adding);
};



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
  $('body').on('click','#js-add-item', event => {
    event.preventDefault();
    renderAddingSection();
  });
};

const handleCancelButton = function () {
  $('body').on('click','#cancel', event => {
    event.preventDefault();
    //store.adding = !store.adding;
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
  $('body').submit(event => {
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

const handleToggleExpand = function ()  {

};

const handleFilterBy = function () {

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
};

export default {
  renderStartPage,
  boundFunctions
};
