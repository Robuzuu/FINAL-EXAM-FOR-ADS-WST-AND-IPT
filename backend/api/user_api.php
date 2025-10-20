<?php
require_once __DIR__ . '/../controllers/UserController.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$auth = new AuthController();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';

function readJson() {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}

try {
    if ($method === 'POST') {
        $data = $_POST ?: readJson();
        if ($action === 'register') {
            echo json_encode($auth->register($data));
            exit;
        }
        if ($action === 'login') {
            echo json_encode($auth->login($data));
            exit;
        }
        http_response_code(400);
        echo json_encode(['error' => 'Unsupported action']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

