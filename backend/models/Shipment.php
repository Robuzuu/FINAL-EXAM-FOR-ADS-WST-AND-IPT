<?php
// backend/models/Shipment.php
require_once __DIR__ . '/../config/database.php';

class Shipment {
    private $db;
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    private function generateTracking() {
        return 'TRK' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6)) . time()%10000;
    }

    public function create($data, $userId = null) {
        if (empty($data['sender_name']) || empty($data['receiver_name']) || empty($data['origin']) || empty($data['destination'])) {
            return ['error' => 'Missing required fields'];
        }
        $tn = $this->generateTracking();
        $sql = "INSERT INTO shipments (tracking_number, sender_name, sender_phone, receiver_name, receiver_phone, origin, destination, weight, description, status_id, created_by)
                VALUES (:tn,:sname,:sphone,:rname,:rphone,:origin,:destination,:weight,:desc,1,:created_by)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':tn' => $tn,
            ':sname' => $data['sender_name'],
            ':sphone' => $data['sender_phone'] ?? null,
            ':rname' => $data['receiver_name'],
            ':rphone' => $data['receiver_phone'] ?? null,
            ':origin' => $data['origin'],
            ':destination' => $data['destination'],
            ':weight' => $data['weight'] ?? 0,
            ':desc' => $data['description'] ?? null,
            ':created_by' => $userId ?? ($data['created_by'] ?? null)
        ]);
        $id = $this->db->lastInsertId();
        return $this->getById($id);
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT s.*, st.name as status FROM shipments s LEFT JOIN statuses st ON s.status_id = st.id WHERE s.id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function listAll($user = null) {
        if ($user && $user['role'] === 'admin') {
            $stmt = $this->db->query("SELECT s.*, st.name as status, u.name as creator, d.name as driver FROM shipments s LEFT JOIN statuses st ON s.status_id = st.id LEFT JOIN users u ON s.created_by = u.id LEFT JOIN users d ON s.assigned_to = d.id ORDER BY s.created_at DESC");
            return $stmt->fetchAll();
        } elseif ($user) {
            $stmt = $this->db->prepare("SELECT s.*, st.name as status, u.name as creator, d.name as driver FROM shipments s LEFT JOIN statuses st ON s.status_id = st.id LEFT JOIN users u ON s.created_by = u.id LEFT JOIN users d ON s.assigned_to = d.id WHERE s.created_by = :uid OR s.assigned_to = :uid ORDER BY s.created_at DESC");
            $stmt->execute([':uid' => $user['id']]);
            return $stmt->fetchAll();
        } else {
            $stmt = $this->db->query("SELECT s.*, st.name as status FROM shipments s LEFT JOIN statuses st ON s.status_id = st.id ORDER BY s.created_at DESC");
            return $stmt->fetchAll();
        }
    }


    public function getAll() {
        return $this->listAll();
    }

    public function update($id, $data) {
        $sql = "UPDATE shipments SET sender_name=:sname, sender_phone=:sphone, receiver_name=:rname, receiver_phone=:rphone, origin=:origin, destination=:destination, weight=:weight, description=:desc, status_id=:status_id, updated_at=NOW() WHERE id=:id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':sname' => $data['sender_name'],
            ':sphone' => $data['sender_phone'] ?? null,
            ':rname' => $data['receiver_name'],
            ':rphone' => $data['receiver_phone'] ?? null,
            ':origin' => $data['origin'],
            ':destination' => $data['destination'],
            ':weight' => $data['weight'] ?? 0,
            ':desc' => $data['description'] ?? null,
            ':status_id' => $data['status_id'] ?? 1,
            ':id' => $id
        ]);
        return $this->getById($id);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM shipments WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return true;
    }

    public function assign($id, $driverId) {
        $stmt = $this->db->prepare("UPDATE shipments SET assigned_to = :driver WHERE id = :id");
        $stmt->execute([':driver' => $driverId, ':id' => $id]);
        return $this->getById($id);
    }

    public function findByTracking($tracking) {
        $stmt = $this->db->prepare("SELECT s.*, st.name as status FROM shipments s LEFT JOIN statuses st ON s.status_id = st.id WHERE s.tracking_number = :tn");
        $stmt->execute([':tn' => $tracking]);
        return $stmt->fetch();
    }

    public function updateStatus($id, $status) {
     
        if (is_numeric($status)) {
            $statusId = (int)$status;
        } else {
            $stmt = $this->db->prepare("SELECT id FROM statuses WHERE name = :name LIMIT 1");
            $stmt->execute([':name' => $status]);
            $row = $stmt->fetch();
            if (!$row) return false;
            $statusId = (int)$row['id'];
        }
        $stmt = $this->db->prepare("UPDATE shipments SET status_id = :sid, updated_at = NOW() WHERE id = :id");
        return $stmt->execute([':sid' => $statusId, ':id' => $id]);
    }
}