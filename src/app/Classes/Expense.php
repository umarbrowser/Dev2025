<?php

namespace App\Classes;

use PDO;

class Expense {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(array $data): bool {
        $sql = "INSERT INTO transactions (user_id, category_id, amount, date) VALUES (?, ?, ?, ?)";
        
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                $data['user_id'],
                $data['category_id'],
                $data['amount'],
                $data['date']
            ]);
        } catch (\PDOException $e) {
            throw new \Exception('Failed to create expense: ' . $e->getMessage());
        }
    }

    public function update(int $id, array $data): bool {
        $sql = "UPDATE transactions SET category_id = ?, amount = ?, date = ? WHERE id = ? AND user_id = ?";
        
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                $data['category_id'],
                $data['amount'],
                $data['date'],
                $id,
                $data['user_id']
            ]);
        } catch (\PDOException $e) {
            throw new \Exception('Failed to update expense: ' . $e->getMessage());
        }
    }

    public function delete(int $id, int $userId): bool {
        $sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
        
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$id, $userId]);
        } catch (\PDOException $e) {
            throw new \Exception('Failed to delete expense: ' . $e->getMessage());
        }
    }

    public function getById(int $id, int $userId): ?array {
        $sql = "SELECT t.*, c.name as category_name 
                FROM transactions t 
                JOIN categories c ON t.category_id = c.id 
                WHERE t.id = ? AND t.user_id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id, $userId]);
        return $stmt->fetch();
    }

    public function getAllForUser(int $userId, ?array $filters = null): array {
        $sql = "SELECT t.*, c.name as category_name 
                FROM transactions t 
                JOIN categories c ON t.category_id = c.id 
                WHERE t.user_id = ?";
        $params = [$userId];

        if (!empty($filters['category_id'])) {
            $sql .= " AND t.category_id = ?";
            $params[] = $filters['category_id'];
        }

        if (!empty($filters['date'])) {
            $sql .= " AND DATE(t.date) = ?";
            $params[] = $filters['date'];
        }

        $sql .= " ORDER BY t.date DESC";

        if (!empty($filters['limit'])) {
            $limit = (int) $filters['limit'];
            if ($limit > 0) {
                $sql .= " LIMIT " . $limit;
            }
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getTotalExpenses(int $userId): float {
        $sql = "SELECT COALESCE(SUM(amount), 0) as total
                FROM transactions
                WHERE user_id = ?";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return (float) $stmt->fetchColumn();
    }

    public function getMonthlyTotal(int $userId): float {
        $sql = "SELECT COALESCE(SUM(amount), 0) as total 
                FROM transactions 
                WHERE user_id = ? 
                AND MONTH(date) = MONTH(CURRENT_DATE()) 
                AND YEAR(date) = YEAR(CURRENT_DATE())";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return (float) $stmt->fetchColumn();
    }

    public function getTotalByCategory(int $userId): array {
        $sql = "SELECT c.name, COALESCE(SUM(t.amount), 0) as total 
                FROM categories c 
                LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = ? 
                GROUP BY c.id, c.name
                ORDER BY total DESC, c.name ASC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }
}
