// Функция для получения куки по имени
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Получаем данные из куки
const username = getCookie("username");
const uid = getCookie("uid");
const hwid = getCookie("hwid");
const sub_end = getCookie("sub_end");

// Если нет логина в куках — отправляем на страницу входа
if (!username) {
    alert("Сессия истекла! Войдите снова.");
    window.location.href = "login.html";
} else {
    // Подставляем данные на страницу
    document.getElementById("username").textContent = username;
    document.getElementById("uid").textContent = uid || "Не найдено";
    document.getElementById("hwid").textContent = hwid || "Не найдено";
    document.getElementById("sub_end").textContent = sub_end || "Нет подписки";
}


// Выход из системы (удаление куки)
document.getElementById("logout").addEventListener("click", function() {
    document.cookie = "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "hwid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "sub_end=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    window.location.href = "index.html";
});

// Кнопка "Скачать лаунчер" (меняем ссылку на свою)
document.getElementById("download-launcher").addEventListener("click", function() {
    window.location.href = "https://example.com/launcher.exe"; // <-- Укажи реальную ссылку
});
