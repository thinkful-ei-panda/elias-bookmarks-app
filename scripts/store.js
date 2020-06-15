const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;

const findById = function (id) {
  return this.bookmarks.find(currentItem => currentItem.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};

const toggleFilter = function (filterBy) {
  this.filter = filterBy;
};

const findAndUpdate = function (id, newData) {
  const currentItem = this.findById(id);
  Object.assign(currentItem, newData);
  console.log(`${currentItem.title} was given expanded = ${currentItem.expanded}`);
};

const setError = function () {
  this.error = error;
};

export default{
  bookmarks,
  adding,
  error,
  filter,
  findById,
  findAndUpdate,
  addBookmark,
  findAndDelete,
  toggleFilter,
  setError
};