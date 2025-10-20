<?php
require_once __DIR__ . '/../config/database.php';


class User {
private $conn;
private $table = 'users';


public function __construct($db){
$this->conn = $db;
}


public function create($name, $email, $password, $role = 'user'){
$sql = "INSERT INTO {$this->table} (name, email, password, role, created_at) VALUES (:name, :email, :password, :role, NOW())";
$stmt = $this->conn->prepare($sql);
$stmt->bindValue(':name', $name);
$stmt->bindValue(':email', $email);
$stmt->bindValue(':password', $password);
$stmt->bindValue(':role', $role);
return $stmt->execute();
}


public function findByEmail($email){
$sql = "SELECT id, name, email, password, role FROM {$this->table} WHERE email = :email LIMIT 1";
$stmt = $this->conn->prepare($sql);
$stmt->bindValue(':email', $email);
$stmt->execute();
return $stmt->fetch(PDO::FETCH_ASSOC);
}


public function getById($id){
$sql = "SELECT id, name, email, role FROM {$this->table} WHERE id = :id LIMIT 1";
$stmt = $this->conn->prepare($sql);
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->execute();
return $stmt->fetch(PDO::FETCH_ASSOC);
}
}