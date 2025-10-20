<?php

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../models/Shipment.php';

$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
$token = null;
if ($auth && preg_match('/Bearer\s(\S+)/', $auth, $m)) $token = $m[1];
$userModel = new User();
$user = $userModel->getByToken($token);
if (!$user) jsonResponse(['error' => 'Unauthorized'], 401);

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;
if (!$id) jsonResponse(['error' => 'Missing shipment id'], 400);

$shipment = new Shipment();
$existing = $shipment->getById($id);
if (!$existing) jsonResponse(['error' => 'Shipment not found'], 404);

if ($user['role'] !== 'admin' && $existing['created_by'] != $user['id']) {
    jsonResponse(['error' => 'Forbidden'], 403);
}

$shipment->delete($id);
jsonResponse(['message' => 'Deleted']);