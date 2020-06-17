import store from './store.js';
import api from './api.js';

//------------------------  generators      ----------------------//
//------------------------  generators      ----------------------//
const generateStartPage = function() {
  return `
  <div>
    <h1 class="item">Your Bookmarks</h1>
    <button id="js-add-item" class="submitAndCancel button">Add</button>
    <button id="js-filterBy" class="submitAndCancel button">Filter</button>
  </div>`;
};

const generateFilterBySection = function () {
  return `
  <div>
  <h1 class="item">Your Bookmarks</h1>
  <form id="filterSection">
    <button id="cancel" class="button">Cancel</button> 
    <select id="js-filterBy-val" class="filterRating" name="filterBy">
      <option value="0" selected disabled hidden>Filter:</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  </form>
  </div>`;
};

const generateAddBookmarkSection = function () {
  return `
  <h1 class="item"> Your Bookmarks</h1>
  <div class="errorMessage"></div>
  <form id="addSection">
    <fieldset id="addField">
    <legend id="addLegend">Add New Bookmark</legend>
      
      <span class="addForm">
      <label for="addBookmark-title">Title</label>
      <input type="text" name="addBookmark-title" id="js-title-val" placeholder="e.g. Amazon" required />
      </span>

      <span class="addForm">
      <label for="addBookmark-url">URL</label>
      <input type="text" name="addBookmark-url" id="js-url-val" placeholder="e.g. https://amazon.com" required />
      </span>
      
      <span class="addForm">
      <label for="addBookmark-desc">Description</label>
      <textarea name="addBookmark-desc" id="js-desc-val" placeholder="e.g. America's online retail giant."></textarea>
      </span>
      
      <span class="addForm-rating">
      <label for="addBookmark-rating">Rating</label>
      <select required="true" name="addBookmark-rating" id="js-rating-val" required="true">
        <option value="">Good time to be judgy</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      </span>
      
      <span class="addForm submitAndCancel">
      <input type="submit" class="button" required/>
      <button type="click" id="cancel" class="button">Cancel</button>
      </span>

    </fieldset>
  </form>`;
};

const generateExpansion = function (bookmark) {
  return `
  <li class="js-bookmark-element expanded" data-item-id="${bookmark.id}">
    
    <span class="expansionSpan">
    <label class="expanded" for="expanded-title">Title</label>
    <p class="expanded" name="expanded-title">${bookmark.title}</p>
    </span>

    <span class="expansionSpan">
    <label class="expanded" for="expanded-url">URL</label>
    <button class="button" id="visit-site" name="expanded-url">Visit Site</a></button>
    </span>

    <span class="expansionSpan">
    <label class="expanded" for="expanded-desc">Description</label>
    <textarea name="js-new-desc" align="center" class="desc-styles-expanded" name="expanded-desc">${bookmark.desc}</textarea>
    </span>

    <span class="expansionSpan">
    <label class="expanded" for="expanded-rating">Rating</label>
    <p class="expanded" name="expanded-rating">${bookmark.rating}</p>
    </span>

    <span class="expansionSpan">
    <button class="js-delete button">Delete</button>
    </span>

    
  </li>`;
};

const generateBookmarkElement = function (bookmark) {
  return `
  <li class="js-bookmark-element" data-item-id="${bookmark.id}">
      <h2>${bookmark.title}</h2> <p>${bookmark.rating}</p>
  </li>`;
};

const generateError = function (error) {
  return `
  <div>
    <button id="cancel">Reset</button>
    <span>${error.message}</span>
  </div>`;
};

const generateBookmarksString = function (bookmarksList) {
  const almostbookmarks = bookmarksList.map((bookmark) => {
    if(bookmark.expanded) {
      return generateExpansion(bookmark);
    } else {
      return generateBookmarkElement(bookmark);
    }
  });
  const bookmarks = `<ul align="center" >${almostbookmarks.join('')}</ul>`;
  return bookmarks;
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
  $('main').html(bookmarksString);
};

const renderStartPage = function ()  {
  $('header').html(generateStartPage());
};

const renderAddingSection = function () {
  $('header').html(generateAddBookmarkSection());
  store.adding = !store.adding;
};

const renderFilterBy = function () {
  $('header').html(generateFilterBySection());
};

const renderError = function () {
  if (store.error) {
    const err = generateError(store.error);
    console.log(err);
    $('.errorMessage').html(err);
  } else {
    $('.errorMessage').empty();
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
    .catch(error => {
      store.error = error;
      renderError();
    });
};

const handleAddingPage = function () {
  $('header').on('click','#js-add-item', event => {
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
    /* if(store.error){
      store.error=null;
    } */
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
  $('header').submit(event => {
    event.preventDefault();
    store.filter = $('#js-filterBy-val :selected').val();
    const newBookmark = {};
    newBookmark.title = $('#js-title-val').val();
    newBookmark.url = $('#js-url-val').val();
    newBookmark.desc = $('#js-desc-val').val();
    newBookmark.rating = $('#js-rating-val :selected').val();
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
      .catch(error => {
        console.log('we got error catching triggered');
        store.error = error;
        renderError();
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
      .catch(error => {
        store.error = error;
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
    store.error = null;
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
