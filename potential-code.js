
`````````unused api with api to retrieve and update simultaenously `````

/* api.updateBookmark(id, {expanded: !bookmark.expanded})
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
      }); */


```````````unused alternative to expand ````````````


/* const generateBookmarkDetails = function (bookmark, index) {
  console.log('Expansion commencing');
  let bookmarks = [...store.bookmarks];
  //store.toggleExpandButton(id);
  const beforeExpandedObject = bookmarks.map((bookmark) => generateBookmarkElement(bookmark));
  console.log(beforeExpandedObject);
  const bookmarksString = beforeExpandedObject.splice(index,1,generateExpansion(bookmark));
  console.log(bookmarksString);
  $('#js-bookmarks-list').html(bookmarksString.join(''));
}; */



const handleExpand = function () {
  $('main').on('click','.js-toggle-expand', event => {
    event.preventDefault();
/* const bookmarks = [...store.bookmarks]; */
const uniqueId = getBookmarkId(event.currentTarget);
    const bookmark = store.findById(uniqueId);
//const matchey = (element) => element ===  uniqueId;
    /* const hello = bookmarks[0]; */
    //const index = bookmarks.findIndex(matchey);
    /* const index = bookmarks.map(function(e) { return e.hello; }).indexOf(uniqueId);
    console.log(index);
    renderBookmarkDetails(bookmark,index); */
render();
  });
};
