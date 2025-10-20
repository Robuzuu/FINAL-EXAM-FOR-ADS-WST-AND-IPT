<?php
require_once __DIR__ . '/../config/database.php';

class AdminController {
    private $pdo;

    public function __construct() {
        $this->pdo = (new Database())->getConnection();
    }

 
    public function users() {
        try {
            $sql = "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC";
            $stmt = $this->pdo->query($sql);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
            return ['users' => $rows];
        } catch (Throwable $e) {
            return ['error' => $e->getMessage()];
        }
    }

  
    public function paymentsSummary($range = 'month') {
        try {
            if (!$this->tableExists('payments')) {
                return ['count' => 0, 'total' => 0];
            }

            $dateCol = $this->columnExists('payments', 'paid_at') ? 'paid_at' : 'created_at';
            $where = '1=1';
            if ($range === 'today') {
                $where = "DATE($dateCol) = CURDATE()";
            } elseif ($range === 'week') {
                $where = "YEARWEEK($dateCol, 1) = YEARWEEK(CURDATE(), 1)";
            } else { // month
                $where = "DATE_FORMAT($dateCol, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')";
            }

            $countSql = "SELECT COUNT(*) AS c FROM payments WHERE $where";
            $sumSql = "SELECT COALESCE(SUM(amount),0) AS s FROM payments WHERE $where";
            $count = (int)$this->pdo->query($countSql)->fetchColumn();
            $total = (float)$this->pdo->query($sumSql)->fetchColumn();
            return ['count' => $count, 'total' => $total];
        } catch (Throwable $e) {
            return ['error' => $e->getMessage()];
        }
    }

    
    public function activity($limit = 20) {
        try {
            if ($this->tableExists('shipment_events')) {
                $sql = "SELECT se.id, se.shipment_id, se.user_id, se.event_type, se.details, se.created_at,
                               s.tracking_number, u.name AS user_name
                        FROM shipment_events se
                        LEFT JOIN shipments s ON s.id = se.shipment_id
                        LEFT JOIN users u ON u.id = se.user_id
                        ORDER BY se.created_at DESC
                        LIMIT :lim";
                $stmt = $this->pdo->prepare($sql);
                $stmt->bindValue(':lim', (int)$limit, PDO::PARAM_INT);
                $stmt->execute();
                return ['events' => $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []];
            } else {
                $sql = "SELECT id, tracking_number, origin, destination, updated_at FROM shipments ORDER BY updated_at DESC LIMIT :lim";
                $stmt = $this->pdo->prepare($sql);
                $stmt->bindValue(':lim', (int)$limit, PDO::PARAM_INT);
                $stmt->execute();
                return ['shipments' => $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []];
            }
        } catch (Throwable $e) {
            return ['error' => $e->getMessage()];
        }
    }

  
    private function tableExists($table) {
        $sql = "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':t', $table);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    private function columnExists($table, $column) {
        $sql = "SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t AND COLUMN_NAME = :c";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':t', $table);
        $stmt->bindValue(':c', $column);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }
}

