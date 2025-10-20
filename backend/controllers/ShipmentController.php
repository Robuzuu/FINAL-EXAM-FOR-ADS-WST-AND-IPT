<?php
require_once __DIR__ . '/../models/Shipment.php';
require_once __DIR__ . '/../config/database.php';


class ShipmentController {
private $db;
private $model;


public function __construct(){
$database = new Database();
$this->db = $database->getConnection();
$this->model = new Shipment();
}


public function create($input){

$required = ['sender_name','receiver_name','origin','destination'];
foreach($required as $r){
if(empty($input[$r])) return ['error' => "$r is required"];
}
$ok = $this->model->create($input, $input['created_by'] ?? null);
return isset($ok['error']) ? $ok : ['success' => true, 'shipment' => $ok];
}


public function list(){
return $this->model->getAll();
}


public function track($tracking){
return $this->model->findByTracking($tracking);
}


public function updateStatus($id, $status){
$ok = $this->model->updateStatus($id, $status);
return $ok ? ['success' => true] : ['error' => 'Unable to update'];
}


public function delete($id){
$ok = $this->model->delete($id);
return $ok ? ['success' => true] : ['error' => 'Unable to delete'];
}


public function assign($id, $driverId){
    $shipment = $this->model->assign($id, $driverId);
    if (!$shipment) return ['error' => 'Unable to assign'];
    return ['success' => true, 'shipment' => $shipment];
}
}