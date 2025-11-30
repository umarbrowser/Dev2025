<?php

namespace App\Classes;

use PDO;

class Receipt {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(array $data): bool {
        $sql = "INSERT INTO receipts (transaction_id, total_amount, date, file_path) VALUES (?, ?, ?, ?)";
        
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                $data['transaction_id'],
                $data['total_amount'],
                $data['date'],
                $data['file_path'] ?? null
            ]);
        } catch (\PDOException $e) {
            throw new \Exception('Failed to create receipt: ' . $e->getMessage());
        }
    }

    public function update(int $id, array $data): bool {
        $sql = "UPDATE receipts SET total_amount = ?, date = ?, file_path = ? WHERE id = ?";
        
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                $data['total_amount'],
                $data['date'],
                $data['file_path'] ?? null,
                $id
            ]);
        } catch (\PDOException $e) {
            throw new \Exception('Failed to update receipt: ' . $e->getMessage());
        }
    }

    public function delete(int $id): bool {
        $sql = "DELETE FROM receipts WHERE id = ?";
        
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$id]);
        } catch (\PDOException $e) {
            throw new \Exception('Failed to delete receipt: ' . $e->getMessage());
        }
    }

    public function getById(int $id): ?array {
        $sql = "SELECT r.*, t.amount as transaction_amount, t.date as transaction_date, c.name as category_name
                FROM receipts r
                JOIN transactions t ON r.transaction_id = t.id
                JOIN categories c ON t.category_id = c.id
                WHERE r.id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function getByTransactionId(int $transactionId): ?array {
        $sql = "SELECT r.*, t.amount as transaction_amount, t.date as transaction_date, c.name as category_name
                FROM receipts r
                JOIN transactions t ON r.transaction_id = t.id
                JOIN categories c ON t.category_id = c.id
                WHERE r.transaction_id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$transactionId]);
        return $stmt->fetch() ?: null;
    }

    public function getAllForUser(int $userId, ?array $filters = null): array {
        $sql = "SELECT r.*, t.amount as transaction_amount, t.date as transaction_date, c.name as category_name
                FROM receipts r
                JOIN transactions t ON r.transaction_id = t.id
                JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ?";
        $params = [$userId];

        if (!empty($filters['date_from'])) {
            $sql .= " AND DATE(r.date) >= ?";
            $params[] = $filters['date_from'];
        }

        if (!empty($filters['date_to'])) {
            $sql .= " AND DATE(r.date) <= ?";
            $params[] = $filters['date_to'];
        }

        if (!empty($filters['category_id'])) {
            $sql .= " AND t.category_id = ?";
            $params[] = $filters['category_id'];
        }

        $sql .= " ORDER BY r.date DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getTotalByMonth(int $userId, int $year, int $month): float {
        $sql = "SELECT COALESCE(SUM(r.total_amount), 0) as total
                FROM receipts r
                JOIN transactions t ON r.transaction_id = t.id
                WHERE t.user_id = ? 
                AND YEAR(r.date) = ? 
                AND MONTH(r.date) = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId, $year, $month]);
        return (float) $stmt->fetchColumn();
    }

    public function uploadFile(array $file): string {
        $uploadDir = '/Applications/XAMPP/xamppfiles/htdocs/Dev25Expenies/public/uploads/receipts/';
        
        // Create upload directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $filepath = $uploadDir . $filename;

        // Validate file type
        $allowedTypes = ['jpg', 'jpeg', 'png', 'pdf', 'gif'];
        if (!in_array(strtolower($extension), $allowedTypes)) {
            throw new \Exception('Invalid file type. Allowed types: ' . implode(', ', $allowedTypes));
        }

        // Validate file size (5MB max)
        if ($file['size'] > 5 * 1024 * 1024) {
            throw new \Exception('File size too large. Maximum size is 5MB.');
        }

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new \Exception('Failed to upload file.');
        }

        return '/Dev25Expenies/public/uploads/receipts/' . $filename;
    }

    public function deleteFile(string $filePath): bool {
        $fullPath = '/Applications/XAMPP/xamppfiles/htdocs' . $filePath;
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        return true; // File doesn't exist, consider it deleted
    }
}
