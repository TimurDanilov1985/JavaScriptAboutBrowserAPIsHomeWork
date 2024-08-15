let page = 0;
let indexPhoto = 0;
let photos = [];
let photo = {};
let like = false;
let likeCounter = 0;
let photoHistory = [];
let id = 0;

const photoContainer = document.querySelector('.block');
const photographerName = document.querySelector('.photographer__info__name');
const likeCounterOutput = document.querySelector('.likes__count');
const likeButton = document.querySelector('.likes__button');
const historyRender = document.querySelector('.history__render');
const accessKey = 'InBWdchk0CPiwng3rBYtUArDLGIIU0rJfxDptE1m4bA';

async function fetchPhotos() {
    try {
        const response = await fetch(`https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=${accessKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка получения данных: ${error}`);
        return [];
    }
}

function savePhotoHistory() {

    photoHistory = JSON.parse(localStorage.getItem('photoHistory'));

    let objectPhoto = {};

    if (photoHistory.length !== 0) {
        id = photoHistory[photoHistory.length - 1].id + 1;
    }

    let date = new Date();
    let currentDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ' + date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + 'г';
    objectPhoto.id = id;
    objectPhoto.time = currentDate;
    objectPhoto.src = photo.urls.full;
    objectPhoto.photographer = photo.user.name;
    objectPhoto.likes = likeCounter;
    objectPhoto.like = like;

    if (photoHistory.length <= 10) {
        photoHistory.push(objectPhoto);
    } else {
        photoHistory.splice(0, 1);
        photoHistory.push(objectPhoto);
    }

    localStorage.setItem('photoHistory', JSON.stringify(photoHistory));
}

function renderHistory() {
    let array = JSON.parse(localStorage.getItem('photoHistory'));
    let arr = array.reverse();
    arr.forEach(element => {
        historyRender.insertAdjacentHTML('beforeend', `<div id=${element.id} class="history__block">
                        <p class="history__block__data">Дата: ${element.time}</p>
                        <p class="history__block__photographer">Имя фотографа: ${element.photographer}</p>
                        <div class="history__block__likes">
                            <div class="history__block__likes__image">
                                <svg class="history__block__likes__image__svg" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;" xml:space="preserve"><g><path d="M475.366,71.951c-24.175-23.606-57.575-35.404-100.215-35.404c-11.8,0-23.843,2.046-36.117,6.136 c-12.279,4.093-23.702,9.615-34.256,16.562c-10.568,6.945-19.65,13.467-27.269,19.556c-7.61,6.091-14.845,12.564-21.696,19.414 c-6.854-6.85-14.087-13.323-21.698-19.414c-7.616-6.089-16.702-12.607-27.268-19.556c-10.564-6.95-21.985-12.468-34.261-16.562 c-12.275-4.089-24.316-6.136-36.116-6.136c-42.637,0-76.039,11.801-100.211,35.404C12.087,95.552,0,128.288,0,170.162 c0,12.753,2.24,25.889,6.711,39.398c4.471,13.514,9.566,25.031,15.275,34.546c5.708,9.514,12.181,18.796,19.414,27.837 c7.233,9.042,12.519,15.27,15.846,18.699c3.33,3.422,5.948,5.899,7.851,7.419L243.25,469.937c3.427,3.429,7.614,5.144,12.562,5.144 s9.138-1.715,12.563-5.137l177.87-171.307c43.588-43.583,65.38-86.41,65.38-128.475C511.626,128.288,499.537,95.552,475.366,71.951 z"></path></g></svg>
                            </div>
                            <p class="history__block__likes__count">${element.likes}</p>
                        </div>
                    </div>`);
    });
}

window.addEventListener('load', function (e) {
    page = Math.ceil(Math.random() * 100);
    indexPhoto = Math.ceil(Math.random() * 10);
    async function data() {
        photos = await fetchPhotos();
        photo = photos[indexPhoto];
        photoContainer.insertAdjacentHTML('beforeend', `<img class="block__img" src=${photo.urls.full} alt=${photo.alt_description}>`);
        photographerName.textContent = photo.user.name;
        likeCounter = photo.likes;
        likeCounterOutput.textContent = likeCounter;
        savePhotoHistory();
        renderHistory();
        reEvent();
    }
    data();
});

//console.log(JSON.parse(localStorage.getItem('photoHistory')));
//localStorage.removeItem('photoHistory');

function reEvent() {
    const historyBlocks = document.querySelectorAll('.history__block');
    historyBlocks.forEach(block => {
        block.addEventListener('click', function (e) {
            let arr1 = JSON.parse(localStorage.getItem('photoHistory'));
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i].id === Number(block.getAttribute('id'))) {
                    photoContainer.innerHTML = '';
                    photographerName.textContent = '';
                    likeCounterOutput.textContent = '';
                    photoContainer.insertAdjacentHTML('beforeend', `<img class="block__img" src=${arr1[i].src} alt="photo">`);
                    photographerName.textContent = arr1[i].photographer;
                    likeCounter = arr1[i].likes;
                    likeCounterOutput.textContent = likeCounter;
                }
            }
        });
    });
}

likeButton.addEventListener('click', function (e) {

    if (!like) {
        likeCounter++;
        likeCounterOutput.textContent = likeCounter;
        like = true;
        const element = document.querySelector('.block__img');
        let array = [];
        array = JSON.parse(localStorage.getItem('photoHistory'));
        for (let i = 0; i < array.length; i++) {
            if (array[i].src === element.getAttribute('src')) {
                array[i].like = true;
                array[i].likes = likeCounter;
                localStorage.setItem('photoHistory', JSON.stringify(array));
                historyRender.innerHTML = '';
                renderHistory();
                reEvent();
                break;
            }
        }

    } else {
        likeCounter--;
        likeCounterOutput.textContent = likeCounter;
        like = false;
        const element = document.querySelector('.block__img');
        let array = [];
        array = JSON.parse(localStorage.getItem('photoHistory'));
        for (let i = 0; i < array.length; i++) {
            if (array[i].src === element.getAttribute('src')) {
                array[i].like = false;
                array[i].likes = likeCounter;
                localStorage.setItem('photoHistory', JSON.stringify(array));
                historyRender.innerHTML = '';
                renderHistory();
                reEvent();
                break;
            }
        }
    }

});

