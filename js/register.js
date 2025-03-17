document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let messageBox = document.getElementById("message");

    // === ПРОВЕРКА ДАННЫХ ===
    if (!username || !email || !password || !confirmPassword) {
        messageBox.innerHTML = '<div class="error">Заполните все поля!</div>';
        return;
    }

    if (password.length < 6) {
        messageBox.innerHTML = '<div class="error">Пароль должен быть минимум 6 символов!</div>';
        return;
    }

    if (password !== confirmPassword) {
        messageBox.innerHTML = '<div class="error">Пароли не совпадают!</div>';
        return;
    }

    // === СОЗДАЕМ 5-ЗНАЧНЫЙ КОД ===
    let generatedCode = Math.floor(10000 + Math.random() * 90000).toString();

    // === ИМИТАЦИЯ ОТПРАВКИ НА СЕРВЕР ===
    fetch("register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, code: generatedCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageBox.innerHTML = '<div class="success">Код отправлен на вашу почту!</div>';

            // === УБИРАЕМ ФОРМУ ===
            document.getElementById("registerForm").style.display = "none";
            document.getElementById("verificationContainer").style.display = "block";

            // === ОСТАНАВЛИВАЕМ КНОПКУ ПОВТОРНОЙ ОТПРАВКИ НА 60 СЕК ===
            let resendButton = document.getElementById("resendCode");
            resendButton.style.display = "none";
            setTimeout(() => { resendButton.style.display = "block"; }, 60000);
        } else {
            messageBox.innerHTML = '<div class="error">' + data.message + '</div>';
        }
    });
});

// === ПРОВЕРКА КОДА ===
document.getElementById("verifyCodeForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let enteredCode = document.getElementById("verificationCode").value.trim();
    let messageBox = document.getElementById("message");

    if (enteredCode === generatedCode) {
        messageBox.innerHTML = '<div class="success">Регистрация успешна! Перенаправляем...</div>';
        setTimeout(() => { window.location.href = "index5.html"; }, 1500);
    } else {
        messageBox.innerHTML = '<div class="error">Неверный код! Попробуйте снова.</div>';
    }
});
