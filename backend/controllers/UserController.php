<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/database.php';


class AuthController {
private $db;
private $userModel;


public function __construct(){
$database = new Database();
$this->db = $database->getConnection();
$this->userModel = new User($this->db);
}


public function register($input){

if(empty($input['name']) || empty($input['email']) || empty($input['password'])){
return ['error' => 'All fields are required'];
}
if(!filter_var($input['email'], FILTER_VALIDATE_EMAIL)){
return ['error' => 'Invalid email'];
}
if($this->userModel->findByEmail($input['email'])){
return ['error' => 'Email already exists'];
}
$hashed = password_hash($input['password'], PASSWORD_DEFAULT);
$created = $this->userModel->create($input['name'], $input['email'], $hashed);
if(!$created) return ['error' => 'Unable to create user'];

$user = $this->userModel->findByEmail($input['email']);
if (isset($user['password'])) unset($user['password']);
return ['success' => true, 'user' => $user];
}


public function login($input){
if(empty($input['email']) || empty($input['password'])){
return ['error' => 'Email and password required'];
}
$found = $this->userModel->findByEmail($input['email']);
if(!$found) return ['error' => 'Invalid credentials'];
if(!password_verify($input['password'], $found['password'])){
return ['error' => 'Invalid credentials'];
}

unset($found['password']);
return ['success' => true, 'user' => $found];
}
}