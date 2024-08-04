// Вы разрабатываете веб-страницу для отображения расписания занятий в спортивном клубе. Каждое занятие имеет название, время проведения, максимальное количество участников и текущее количество записанных участников.

// 1. Создайте веб-страницу с заголовком "Расписание занятий" и областью для отображения занятий.

// 2. Загрузите информацию о занятиях из предоставленных JSON-данных. Каждое занятие должно отображаться на странице с указанием его названия, времени проведения, максимального количества участников и текущего количества записанных участников.

// 3. Пользователь может нажать на кнопку "Записаться" для записи на занятие. Если максимальное количество участников уже достигнуто, кнопка "Записаться" становится неактивной.

// 4. После успешной записи пользователя на занятие, обновите количество записанных участников и состояние кнопки "Записаться".

// 5. Запись пользователя на занятие можно отменить путем нажатия на кнопку "Отменить запись". После отмены записи, обновите количество записанных участников и состояние кнопки.

// 6. Все изменения (запись, отмена записи) должны сохраняться и отображаться в реальном времени на странице.

// 7. При разработке используйте Bootstrap для стилизации элементов.

const main = document.querySelector('main');
let id = 0;
let sportsActivities = [];

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

sportsActivities = await fetchData(url);

function templating(array) {
    array.forEach(element => {
        main.insertAdjacentHTML('beforeend',
            `<div class="class">
                <h2 class="class__name">${element.name}</h2>
                <p class="class__descr">Время проведения занятия: <span class="class__value" id="time">${element.time}</span></p>
                <p class="class__descr">Максимальное количество участников: <span class="class__value" id="max">${element.people}</span></p>
                <p class="class__descr">Текущее количество записанных участников: <span class="class__value" id="current">${element.enrolled}</span></p>
                <div class="class__buttons">
                    <button id="${element.id}" class="sign class__buttons__button">Записаться на занятие</button>
                    <button id="${element.id}" class="unsign class__buttons__button">Отменить запись</button>
                </div>
            </div>`);
    });
}

templating(sportsActivities);

let signButtons = document.querySelectorAll('.sign');
let unsignButtons = document.querySelectorAll('.unsign');

function checkingStatus() {

    sportsActivities.forEach(element => {

        if (element.people === element.enrolled) {

            for (let i = 0; i < signButtons.length; i++) {
                if (Number(signButtons[i].getAttribute('id')) === element.id) {
                    signButtons[i].disabled = true;
                    signButtons[i].style = 'opacity: 0.1';
                }
            }
        }

        if (element.enrolled === 0) {

            for (let i = 0; i < unsignButtons.length; i++) {

                if (Number(unsignButtons[i].getAttribute('id')) === element.id) {
                    unsignButtons[i].disabled = true;
                    unsignButtons[i].style = 'opacity: 0.1';
                }

            }
        }
    });
}

checkingStatus();

function reload() {

    signButtons.forEach(element => {

        element.addEventListener('click', function (e) {

            for (let i = 0; i < sportsActivities.length; i++) {

                if (sportsActivities[i].id === Number(element.getAttribute('id'))) {

                    sportsActivities[i].enrolled++;
                    main.innerHTML = '';
                    templating(sportsActivities);
                    signButtons = document.querySelectorAll('.sign');
                    unsignButtons = document.querySelectorAll('.unsign');
                    checkingStatus();
                    break;

                }

            }

            reload();
        });
    });

    unsignButtons.forEach(element => {
        element.addEventListener('click', function (e) {

            for (let i = 0; i < sportsActivities.length; i++) {

                if (sportsActivities[i].id === Number(element.getAttribute('id'))) {

                    sportsActivities[i].enrolled--;
                    main.innerHTML = '';
                    templating(sportsActivities);
                    signButtons = document.querySelectorAll('.sign');
                    unsignButtons = document.querySelectorAll('.unsign');
                    checkingStatus();
                    break;

                }

            }

            reload();
        });
    });
}

reload()
