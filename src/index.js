import PictureApiService from './picture.service';
import Notiflix from 'notiflix';
import '/node_modules/notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  input: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  cardContainer: document.querySelector('.gallery'),
};
const pictureApiService = new PictureApiService();
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

refs.input.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  clearPicturesContainer();
  pictureApiService.query = e.target.elements.searchQuery.value.trim();
  pictureApiService.resetPage();

  await pictureApiService.fetchPictures().then(data => {
    if (pictureApiService.searchQuery === '') {
      return;
    } else if (data.hits.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    createMarkUp(data.hits);
    refs.loadMoreBtn.classList.remove('not-visible');
  });
}

function createMarkUp(pictures) {
  const markup = pictures
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a class="gallery-link" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="350" height="250"/>
      <div class="info">
      <p class="info-item">
      <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
      <b>Views ${views}</b>
      </p>
      <p class="info-item">
      <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
      <b>Downloads ${downloads}</b>
      </p>
     </div>
      </a>`
    )
    .join('');
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
  if (pictures.total <= 40) {
    lightbox.refresh();
    return pictures;
  } else {
    refs.loadMoreBtn.classList.remove('not-visible');
  }
  lightbox.refresh();
  return pictures;
}

async function onLoadMore() {
  await pictureApiService.fetchPictures().then(data => {
    const total = data.totalHits / 40;
    if (pictureApiService.page >= total) {
      refs.loadMoreBtn.classList.add('not-visible');
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    createMarkUp(data.hits);
  });
}
function clearPicturesContainer() {
  refs.cardContainer.innerHTML = '';
}
