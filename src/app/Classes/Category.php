<?php

namespace App\Classes;

use PDO;

class Category {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(): array {
        $sql = "SELECT * FROM categories ORDER BY name";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $sql = "SELECT * FROM categories WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): bool {
        $sql = "INSERT INTO categories (name, description, color) VALUES (?, ?, ?)";
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                $data['name'],
                $data['description'] ?? null,
                $data['color'] ?? '#6366f1'
            ]);
        } catch (\PDOException $e) {
            if ($e->getCode() == '23000') {
                throw new \Exception('Category already exists');
            }
            throw $e;
        }
    }

    public function update(int $id, array $data): bool {
        $sql = "UPDATE categories SET name = ?, description = ?, color = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['description'] ?? null,
            $data['color'] ?? '#6366f1',
            $id
        ]);
    }

    public function delete(int $id): bool {
        // Check if category is being used by any transactions
        $checkSql = "SELECT COUNT(*) FROM transactions WHERE category_id = ?";
        $checkStmt = $this->db->prepare($checkSql);
        $checkStmt->execute([$id]);
        
        if ($checkStmt->fetchColumn() > 0) {
            throw new \Exception('Cannot delete category that is being used by transactions');
        }

        $sql = "DELETE FROM categories WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }

    public function getStats(): array {
        $sql = "SELECT c.id, c.name, c.color, COUNT(t.id) as transaction_count, COALESCE(SUM(t.amount), 0) as total_amount
                FROM categories c
                LEFT JOIN transactions t ON c.id = t.category_id
                GROUP BY c.id, c.name, c.color
                ORDER BY total_amount DESC";
        
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    // the following function checks whether a category exist in our database
    // It is useful before file upload
    public function exists(int $categoryId): bool {
        $sql = "SELECT COUNT(*) FROM categories WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$categoryId]);
        return $stmt->fetchColumn() > 0;
    }


    //the following function is use to get the name of a category from out database 
    public function getByName(string $name): ?array {
        $sql = "SELECT * FROM categories WHERE name = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$name]);
        return $stmt->fetch() ?: null;
    }



}
