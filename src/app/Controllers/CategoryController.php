<?php

namespace App\Controllers;

use App\Classes\Category;
use App\Classes\View;

class CategoryController {
    private Category $category;

    public function __construct() {
        $this->category = new Category();
    }

    public function index(): void {
        $this->checkAuth();
        
        $data = [
            'categories' => $this->category->getAll(),
            'categoryStats' => $this->category->getStats(),
            'view' => 'index'
        ];

        View::render('categories', $data);
    }

    public function create(): void {
        $this->checkAuth();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $categoryData = [
                    'name' => trim($_POST['name'] ?? ''),
                    'description' => trim($_POST['description'] ?? ''),
                    'color' => $_POST['color'] ?? '#6366f1'
                ];

                if (empty($categoryData['name'])) {
                    throw new \Exception('Category name is required');
                }

                if ($this->category->create($categoryData)) {
                    header('Location: /Dev25Expenies/public/categories');
                    exit;
                }

                throw new \Exception('Failed to create category');
            } catch (\Exception $e) {
                View::render('categories', [
                    'error' => $e->getMessage(),
                    'categories' => $this->category->getAll(),
                    'categoryStats' => $this->category->getStats(),
                    'view' => 'index'
                ]);
            }
        } else {
            View::render('categories', [
                'view' => 'create'
            ]);
        }
    }

    public function edit(int $id): void {
        $this->checkAuth();
        
        $category = $this->category->getById($id);
        
        if (!$category) {
            header('Location: /Dev25Expenies/public/categories');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $categoryData = [
                    'name' => trim($_POST['name'] ?? ''),
                    'description' => trim($_POST['description'] ?? ''),
                    'color' => $_POST['color'] ?? '#6366f1'
                ];

                if (empty($categoryData['name'])) {
                    throw new \Exception('Category name is required');
                }

                if ($this->category->update($id, $categoryData)) {
                    header('Location: /Dev25Expenies/public/categories');
                    exit;
                }

                throw new \Exception('Failed to update category');
            } catch (\Exception $e) {
                View::render('categories', [
                    'error' => $e->getMessage(),
                    'category' => $category,
                    'view' => 'edit'
                ]);
            }
        } else {
            View::render('categories', [
                'category' => $category,
                'view' => 'edit'
            ]);
        }
    }

    public function delete(int $id): void {
        $this->checkAuth();
        
        try {
            if ($this->category->delete($id)) {
                header('Location: /Dev25Expenies/public/categories');
                exit;
            }

            throw new \Exception('Failed to delete category');
        } catch (\Exception $e) {
            View::render('categories', [
                'error' => $e->getMessage(),
                'categories' => $this->category->getAll(),
                'categoryStats' => $this->category->getStats(),
                'view' => 'index'
            ]);
        }
    }

    private function checkAuth(): void {
        if (!isset($_SESSION['user'])) {
            header('Location: /Dev25Expenies/public/login');
            exit;
        }
    }
}
