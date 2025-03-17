<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$json_url = "https://raw.githubusercontent.com/Artem-Russiun/gayporno/refs/heads/main/accounts.json";

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data["username"]);
$password = trim($data["password"]);

$json_data = file_get_contents($json_url);
$accounts = json_decode($json_data, true);

if (!$accounts) {
    echo json_encode(["error" => true, "message" => "Ошибка загрузки базы данных!"]);
    exit;
}

if (isset($accounts[$username]) && $accounts[$username]["password"] === $password) {
    $uid = $accounts[$username]["uid"] ?? "Не найдено";
    $hwid = $accounts[$username]["hwid"] ?? "Не найдено";
    $sub_end = $accounts[$username]["sub_end"] ?? "Нет подписки";

    // Устанавливаем куки
    setcookie("username", $username, time() + 3600, "/");
    setcookie("uid", $uid, time() + 3600, "/");
    setcookie("hwid", $hwid, time() + 3600, "/");
    setcookie("sub_end", $sub_end, time() + 3600, "/");

    echo json_encode(["error" => false, "message" => "Успешный вход!", "redirect" => "pisunf6.html"]);
} else {
    echo json_encode(["error" => true, "message" => "Неверный логин или пароль!"]);
}
?>
