const BASE_URL = 'https://thinkful-list-api.herokuapp.com/elias/bookmarks';

/**
 * listApiFetch - Wrapper function for native `fetch` to standardize error handling. 
 * @param {string} url 
 * @param {object} options 
 * @returns {Promise} 'https://thinkful-list-api.herokuapp.com/elias/bookmarks',{method:'POST',body:{"title":"asdf","url":"asdf","desc":"asdf","rating":"5"}}
 */

const listApiFetch = function (...args) {
  // setup var in scope outside of promise chain

  let error;
  console.log('fetching in process');
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

const getBookmarks = function () {
  return listApiFetch(`${BASE_URL}`);
};

const createBookmarks = function (data) {
  console.log('apis are firing');
  this.adding = !this.adding;
  console.log('adding is '+this.adding+' right now.');
  const newData = JSON.stringify(data);
  return listApiFetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newData
  });
};

const deleteBookmarks = function (id) {
  return listApiFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
};

export default {
  getBookmarks,
  createBookmarks,
  deleteBookmarks
};