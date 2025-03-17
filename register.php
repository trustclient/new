<?php

header("Content-Type: application/json");

$github_url = "https://raw.githubusercontent.com/Artem-Russiun/gayporno/main/accounts.json";
$github_raw_url = "https://api.github.com/repos/Artem-Russiun/gayporno/contents/accounts.json";
$github_token = "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"; // ЗАМЕНИ НА СВОЙ TOKEN!

// Читаем JSON с GitHub
$options = [
    "http" => [
        "header" => "User-Agent: Mozilla/5.0\r\n"
    ]
];

$json = file_get_contents($github_url, false, stream_context_create($options));
$data = json_decode($json, true) ?? [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input = json_decode(file_get_contents("php://input"), true) ?? [];

    $username = trim($input["username"] ?? "");
    $password = trim($input["password"] ?? "");

    if (!$username || !$password) {
        echo json_encode(["error" => true, "message" => "Заполните все поля!"]);
        exit;
    }

    if (isset($data[$username])) {
        echo json_encode(["error" => true, "message" => "Пользователь уже существует!"]);
        exit;
    }

    // Подсчет UID (берем последний и +1)
    $lastUid = 0;
    foreach ($data as $user) {
        if (isset($user["uid"]) && $user["uid"] > $lastUid) {
            $lastUid = $user["uid"];
        }
    }
    $newUid = $lastUid + 1;

    // Добавляем нового пользователя
    $data[$username] = [
        "password" => $password,
        "havesub" => "no",
        "uid" => $newUid
    ];

    // Конвертируем обратно в JSON
    $new_json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    // Получаем SHA последнего коммита файла
    $github_headers = [
        "http" => [
            "method" => "GET",
            "header" => [
                "User-Agent: Mozilla/5.0",
                "Authorization: token $github_token"
            ]
        ]
    ];

    $response = file_get_contents($github_raw_url, false, stream_context_create($github_headers));
    $github_data = json_decode($response, true);
    $sha = $github_data["sha"] ?? "";

    if (!$sha) {
        echo json_encode(["error" => true, "message" => "Ошибка получения SHA!"]);
        exit;
    }

    // Запрос на обновление JSON в GitHub
    $update_data = json_encode([
        "message" => "Добавлен пользователь $username",
        "content" => base64_encode($new_json),
        "sha" => $sha
    ]);

    $github_headers["http"]["method"] = "PUT";
    $github_headers["http"]["header"][] = "Content-Type: application/json";
    $github_headers["http"]["content"] = $update_data;

    $update_response = file_get_contents($github_raw_url, false, stream_context_create($github_headers));
    $update_result = json_decode($update_response, true);

    if (isset($update_result["commit"])) {
        echo json_encode(["success" => true, "message" => "", "redirect" => "pisunf6.html"]);
    } else {
        echo json_encode(["error" => true, "message" => ""]);
    }
}
?>
