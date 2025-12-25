const openBtn = document.getElementById('openFormBtn');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('closeBtn');
const form = document.getElementById('feedbackForm');
const messageBox = document.getElementById('messageBox');

// Открытие попапа и изменение URL с помощью History API
openBtn.addEventListener('click', () => {
    popup.classList.remove('hidden');
    history.pushState({}, '', '/feedback'); // Меняем URL
});

// Закрытие попапа при клике на "Назад" в браузере
window.addEventListener('popstate', () => {
    popup.classList.add('hidden');
});

// Закрытие попапа по кнопке
closeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    history.back(); // Возвращаем предыдущий URL
});

// Отправка формы через fetch
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const formData = Object.fromEntries(data);

    // Сохраняем в LocalStorage перед отправкой
    localStorage.setItem('feedbackForm', JSON.stringify(formData));

    try {
        const response = await fetch('https://example.com/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            messageBox.innerHTML = '<p style="color: green;">Форма отправлена!</p>';
            form.reset(); // Очищаем форму
            localStorage.removeItem('feedbackForm'); // Удаляем из LocalStorage
        } else {
            messageBox.innerHTML = '<p style="color: red;">Ошибка отправки!</p>';
        }
    } catch (error) {
        messageBox.innerHTML = '<p style="color: red;">Ошибка сети!</p>';
    }
});

// Восстановление значений из LocalStorage при загрузке
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('feedbackForm');
    if (savedData) {
        const values = JSON.parse(savedData);
        Object.keys(values).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) field.value = values[key];
        });
    }
});
