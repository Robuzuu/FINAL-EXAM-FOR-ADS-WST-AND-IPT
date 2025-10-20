<?php
require_once __DIR__ . '/../controllers/ShipmentController.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$controller = new ShipmentController();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';

function readJsonBody() {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

try {
    if ($method === 'GET') {
        if ($action === 'track') {
            $tracking = $_GET['tracking'] ?? '';
            echo json_encode($controller->track($tracking));
        } else {
            echo json_encode($controller->list());
        }
        exit;
    }

    if ($method === 'POST') {
        $data = $_POST ?: readJsonBody();
        if ($action === 'create') {
            echo json_encode($controller->create($data));
            exit;
        }
        if ($action === 'updateStatus') {
            $id = $data['id'] ?? null;
            $status = $data['status'] ?? null;
            if (!$id || $status===null) { echo json_encode(['error'=>'id and status required']); exit; }
            echo json_encode($controller->updateStatus((int)$id, $status));
            exit;
        }
        http_response_code(400);
        echo json_encode(['error' => 'Unsupported POST action']);
        exit;
    }

    if ($method === 'PUT') {
        $data = readJsonBody();
        if ($action === 'assign') {
            $id = $data['id'] ?? null;
            $driverId = $data['driver_id'] ?? null;
            if (!$id || !$driverId) { echo json_encode(['error'=>'id and driver_id required']); exit; }
            echo json_encode($controller->assign((int)$id, (int)$driverId));
            exit;
        }
        http_response_code(400);
        echo json_encode(['error' => 'Unsupported PUT action']);
        exit;
    }

    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) { echo json_encode(['error'=>'id required']); exit; }
        echo json_encode($controller->delete((int)$id));
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

