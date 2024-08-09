const container = document.querySelector('.slider__container');
const buttonPrevious = document.querySelector('#back');
const buttonNext = document.querySelector('#forward');
const pointsContainer = document.querySelector('.slider__points')
let index = 0;
let linksImages = [];
let linksImagesNav = [];
const url = './data.json';

async function fetchData(url) {

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка - ${error}`);
    }

}

linksImages = await fetchData(url);

function showPicture(index, array) {
    if (index === -1) {
        index = array.length - 1;
    } else if (index > array.length - 1) {
        index = 0;
    } else if (index === -2) {
        index = array.length - 2;
    }
    container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', `<img class="slider__container__img" src=${array[index].src} alt="picture">`);
    return index;
}

showPicture(index, linksImages);

linksImages.forEach(element => {
    linksImagesNav.push(element);
});

let elementPenultimate = linksImagesNav[linksImages.length - 2];
let elementLast = linksImagesNav[linksImagesNav.length - 1];

linksImagesNav.splice(linksImages.length - 2, 2);
linksImagesNav.unshift(elementPenultimate, elementLast);


function templatingNav(array) {
    let id = 0;
    pointsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        pointsContainer.insertAdjacentHTML('beforeend', `<div class="slider__points__block">
            <img id=${id} class="slider__points__block__img" src=${array[i].src} alt="picture"></div>`);
        id++;
    }
    const images = pointsContainer.querySelectorAll('.slider__points__block');
    images[2].style.cssText = 'border: 5px solid red';
}

templatingNav(linksImagesNav);

function stepOneForward() {
    index++;
    index = showPicture(index, linksImages);
    let element = linksImagesNav[0];
    linksImagesNav.splice(0, 1);
    linksImagesNav.push(element);
    templatingNav(linksImagesNav);
    navigation();
}

function stepOneBack() {
    index--;
    index = showPicture(index, linksImages);
    let element = linksImagesNav[linksImages.length - 1];
    linksImagesNav.splice(linksImages.length - 1, 1);
    linksImagesNav.unshift(element);
    templatingNav(linksImagesNav);
    navigation();
}

function stepTwoForward() {
    index += 2;
    index = showPicture(index, linksImages);
    let firstElement = linksImagesNav[0];
    let secondElement = linksImagesNav[1];
    linksImagesNav.splice(0, 2);
    linksImagesNav.push(firstElement, secondElement);
    templatingNav(linksImagesNav);
    navigation();
}

function stepTwoBack() {
    index -= 2;
    index = showPicture(index, linksImages);
    let elementPenultimate = linksImagesNav[linksImages.length - 2];
    let elementLast = linksImagesNav[linksImagesNav.length - 1];
    linksImagesNav.splice(linksImages.length - 2, 2);
    linksImagesNav.unshift(elementPenultimate, elementLast);
    templatingNav(linksImagesNav);
    navigation();
}

function navigation() {
    const images = pointsContainer.querySelectorAll('.slider__points__block__img');
    images.forEach(image => {
        image.addEventListener('click', function (e) {
            if (Number(image.getAttribute('id')) === 3) {
                stepOneForward();
            } else if (Number(image.getAttribute('id')) === 1) {
                stepOneBack();
            } else if (Number(image.getAttribute('id')) === 4) {
                stepTwoForward();
            } else if (Number(image.getAttribute('id')) === 0) {
                stepTwoBack();
            }
        });
    });
}

navigation();

buttonNext.addEventListener('click', function (e) {
    stepOneForward();
});

buttonPrevious.addEventListener('click', function (e) {
    stepOneBack();
});

