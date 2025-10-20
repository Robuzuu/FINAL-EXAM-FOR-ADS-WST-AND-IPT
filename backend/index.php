<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'name' => 'Courier Backend',
    'status' => 'ok',
    'time' => date('c')
]);

