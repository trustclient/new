// Create snowflakes
function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    document.body.appendChild(snowflake);
  
    // Initial coordinates of the snowflake
    const startX = Math.random() * window.innerWidth;
    const startY = -10;
  
    snowflake.style.left = startX + "px";
    snowflake.style.top = startY + "px";
  
    // Size and speed of the snowflake
    const size = Math.random() * 3 + 2;
    const speed = Math.random() * 2 + 2.5;
  
    snowflake.style.width = size + "px";
    snowflake.style.height = size + "px";
  
    // Animation of snowflake falling
    function fall() {
        const currentY = parseFloat(snowflake.style.top);
        const windowHeight = window.innerHeight;
        const footerHeight = document.querySelector('h5').offsetTop;
  
        if (currentY < windowHeight + footerHeight) {
            snowflake.style.top = currentY + speed + "px";
            requestAnimationFrame(fall);
        } else {
            // Remove the snowflake when it reaches the bottom
            snowflake.remove();
        }
    }
  
    fall();
  }
  
  document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let messageBox = document.getElementById("message");

    if (!username || !password || !confirmPassword) {
        messageBox.innerHTML = '<div class="error">⚠️ Заполните все поля!</div>';
        return;
    }

    if (password !== confirmPassword) {
        messageBox.innerHTML = '<div class="error">❌ Пароли не совпадают!</div>';
        return;
    }   

    fetch("register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageBox.innerHTML = '<div class="success">✅ Пользователь зарегистрирован!</div>';
            setTimeout(() => window.location.href = "login.html", 1500);
        } else {
            messageBox.innerHTML = '<div class="error">' + data.message + '</div>';
        }
    })
    .catch(error => {
        messageBox.innerHTML = '<div class="error">🚨 Ошибка соединения!</div>';
        console.error(error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const username = getCookie("username");

    if (!username) {
        window.location.href = "login.html";
        return;
    }

    fetch("https://raw.githubusercontent.com/Artem-Russiun/gayporno/main/accounts.json")
        .then(response => response.json())
        .then(data => {
            if (data[username]) {
                const user = data[username];

                document.getElementById("username").textContent = username;
                document.getElementById("uid").textContent = user.uid || "—";
                document.getElementById("hwid").textContent = user.hwid || "—";
                document.getElementById("sub_end").textContent = user.havesub === "yes" ? user.sub_end : "Нет подписки";

                const adminUsers = ["dev", "koder", "b1terFUN"];
                if (adminUsers.includes(username)) {
                    document.getElementById("admin-panel").style.display = "block";
                }
            } else {
                document.querySelector(".profile-container").innerHTML = "<p>Ошибка загрузки данных!</p>";
            }
        })
        .catch(error => {
            console.error("Ошибка запроса:", error);
            document.querySelector(".profile-container").innerHTML = "<p>Не удалось загрузить данные!</p>";
        });

    document.getElementById("logout").addEventListener("click", function () {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "login.html";
    });
});




  // Generate snowflakes every 500 milliseconds
  setInterval(createSnowflake, 500);