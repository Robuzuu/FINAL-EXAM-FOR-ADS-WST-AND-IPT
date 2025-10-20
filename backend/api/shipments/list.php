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

$shipment = new Shipment();
$list = $shipment->listAll($user);

jsonResponse(['shipments' => $list]);