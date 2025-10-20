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

if ($user['role'] !== 'admin') jsonResponse(['error' => 'Forbidden'], 403);

$input = json_decode(file_get_contents('php://input'), true);
$shipmentId = $input['id'] ?? null;
$driverId = $input['driver_id'] ?? null;
if (!$shipmentId || !$driverId) jsonResponse(['error' => 'Missing parameters'], 400);

$shipment = new Shipment();
$updated = $shipment->assign($shipmentId, $driverId);

jsonResponse(['message' => 'Assigned', 'shipment' => $updated]);