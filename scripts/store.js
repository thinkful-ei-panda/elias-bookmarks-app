const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;

const findById = function (id) {
  //console.log(`looking for this id: ${id} among these: ${bookmarks} which exists here:${this}`);
  console.log(bookmarks[0].id);
  console.log(bookmarks.find(currentItem => currentItem.id === id));
  return this.bookmarks.find(currentItem => currentItem.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};

const toggleExpandButton = function(id) {
  const bookmark = findById(id);
  console.log(bookmark);
  bookmark.expanded = !bookmark.expanded;
};

const toggleFilter = function (filterBy) {
  this.filter = filterBy;
};

const findAndUpdate = function (id, newData) {
  const currentItem = this.findById(id);
  Object.assign(currentItem, newData);
};

const setError = function () {

};

export default{
  bookmarks,
  adding,
  error,
  filter,
  findById,
  addBookmark,
  toggleExpandButton,
  findAndDelete,
  toggleFilter,
  setError
};