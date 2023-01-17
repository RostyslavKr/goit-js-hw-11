import axios from 'axios';

export default class PictureApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchPictures() {
    const URL = 'https://pixabay.com/api/';
    const KEY = '32888012-43d6bfcd82cdab993f3e07c85';
    return axios
      .get(
        `${URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      )
      .then(({ data }) => data)
      .then(data => {
        this.incrementPage();

        return data;
      });
  }

  incrementPage() {
    return (this.page += 1);
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
