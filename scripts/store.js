const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;

const findById = function (id) {
  return this.bookmarks.find(currentItem => currentItem.id === id);
};

const addBookmark = function (bookmark) {
  this.adding = !this.adding;
  this.bookmarks.push(bookmark);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};

const toggleCheckedFilter = function (filterBy) {
  this.filter = filterBy;
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
  findAndDelete,
  toggleCheckedFilter,
  setError
};