<?php

namespace App\Classes;

use PDO;

class User {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function register(array $data): bool {
        $sql = "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)";
        
        try {
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                $data['name'],
                $data['email'],
                $password,
                $data['phone'] ?? null
            ]);
        } catch (\PDOException $e) {
            // Handle unique email constraint
            if ($e->getCode() == '23000') {
                throw new \Exception('Email already exists');
            }
            throw $e;
        }
    }

    public function login(string $email, string $password): ?array {
        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']); // Don't store password in session
            return $user;
        }

        return null;
    }

    public function getById(int $id): ?array {
        $sql = "SELECT id, name, email, phone FROM users WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
}
