<?php

namespace App\Controllers;

use App\Classes\Expense;
use App\Classes\Category;
use App\Classes\View;

class ExpenseController {
    private Expense $expense;
    private Category $category;

    public function __construct() {
        $this->expense = new Expense();
        $this->category = new Category();
    }

    public function index(): void {
        $this->checkAuth();
        
        $userId = $_SESSION['user']['id'];
        $filters = [
            'category_id' => $_GET['category'] ?? null,
            'date' => $_GET['date'] ?? null
        ];

        $data = [
            'expenses' => $this->expense->getAllForUser($userId, $filters),
            'categories' => $this->category->getAll(),
            'monthlyTotal' => $this->expense->getMonthlyTotal($userId),
            'categoryTotals' => $this->expense->getTotalByCategory($userId),
            'filters' => $filters
        ];

        View::render('expenses', $data);
    }

    public function store(): void {
        $this->checkAuth();
        
        try {
            $expenseData = [
                'user_id' => $_SESSION['user']['id'],
                'category_id' => $_POST['category_id'],
                'amount' => $_POST['amount'],
                'date' => $_POST['date']
            ];

            if ($this->expense->create($expenseData)) {
                header('Location: /Dev25Expenies/public/expenses');
                exit;
            }

            throw new \Exception('Failed to create expense');
        } catch (\Exception $e) {
            View::render('expenses', [
                'error' => $e->getMessage(),
                'expenses' => $this->expense->getAllForUser($_SESSION['user']['id']),
                'categories' => $this->category->getAll(),
                'monthlyTotal' => $this->expense->getMonthlyTotal($_SESSION['user']['id']),
                'categoryTotals' => $this->expense->getTotalByCategory($_SESSION['user']['id']),
                'filters' => ['category_id' => null, 'date' => null]
            ]);
        }
    }

    public function update(int $id): void {
        $this->checkAuth();
        
        try {
            $expenseData = [
                'user_id' => $_SESSION['user']['id'],
                'category_id' => $_POST['category_id'],
                'amount' => $_POST['amount'],
                'date' => $_POST['date']
            ];

            if ($this->expense->update($id, $expenseData)) {
                header('Location: /Dev25Expenies/public/expenses');
                exit;
            }

            throw new \Exception('Failed to update expense');
        } catch (\Exception $e) {
            View::render('expenses', [
                'error' => $e->getMessage(),
                'expenses' => $this->expense->getAllForUser($_SESSION['user']['id']),
                'categories' => $this->category->getAll(),
                'monthlyTotal' => $this->expense->getMonthlyTotal($_SESSION['user']['id']),
                'categoryTotals' => $this->expense->getTotalByCategory($_SESSION['user']['id']),
                'filters' => ['category_id' => null, 'date' => null]
            ]);
        }
    }

    public function delete(int $id): void {
        $this->checkAuth();
        
        try {
            $userId = $_SESSION['user']['id'];

            if ($this->expense->delete($id, $userId)) {
                header('Location: /Dev25Expenies/public/expenses');
                exit;
            }

            throw new \Exception('Failed to delete expense');
        } catch (\Exception $e) {
            View::render('expenses', [
                'error' => $e->getMessage(),
                'expenses' => $this->expense->getAllForUser($_SESSION['user']['id']),
                'categories' => $this->category->getAll(),
                'monthlyTotal' => $this->expense->getMonthlyTotal($_SESSION['user']['id']),
                'categoryTotals' => $this->expense->getTotalByCategory($_SESSION['user']['id'])
            ]);
        }
    }

    private function checkAuth(): void {
        if (!isset($_SESSION['user'])) {
            header('Location: /Dev25Expenies/public/login');
            exit;
        }
    }

    // this method download user's expenses as a csv file
    // with S/N, category, amount, and date of transaction
    public function exportCSV(): void 
    {
        $this->checkAuth();
        $userId = $_SESSION['user']['id'];
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="expenses_export.csv"');
        
        $expenses = $this->expense->getAllForUser($userId);
        
        $output = fopen('php://output', 'w');
        fputcsv($output, ['S/N', 'Category', 'Amount', 'Date']);
        $s_number = 0;
        
        foreach ($expenses as $row) {
            $s_number += 1;
            fputcsv($output, [$s_number, $row['category_name'], $row['amount'], $row['date']]);
        }
        
        fclose($output);
        exit;
    }
    
    // this method download user's expenses as a csv file
    // with S/N, category, amount, and date of transaction
    public function importCSV(): void
    {
        $this->checkAuth();
        $userId = $_SESSION['user']['id'];

        if (!isset($_FILES['csv_file']) || $_FILES['csv_file']['error'] !== UPLOAD_ERR_OK) {
            View::render('expenses', [
                'error' => 'CSV upload failed.',
                'expenses' => $this->expense->getAllForUser($userId),
                'categories' => $this->category->getAll(),
                'monthlyTotal' => $this->expense->getMonthlyTotal($userId),
                'categoryTotals' => $this->expense->getTotalByCategory($userId),
                'filters' => ['category_id' => null, 'date' => null]
            ]);
            return;
        }

        $file = fopen($_FILES['csv_file']['tmp_name'], 'r');
        fgets($file); // Skip header safely

        $rowCount = 0;
        $skipped = 0;

        while (($line = fgets($file)) !== false) {
            $row = str_getcsv($line);
            if (count($row) < 4 || empty(array_filter($row))) {
                $skipped++;
                continue;
            }

            [$sn, $categoryName, $amount, $date] = array_map('trim', $row);

            // Lookup category by name
            $category = $this->category->getByName($categoryName);
            if (!$category || !is_numeric($amount) || !\DateTime::createFromFormat('Y-m-d', $date)) {
                $skipped++;
                continue;
            }

            $this->expense->create([
                'user_id' => $userId,
                'category_id' => $category['id'],
                'amount' => $amount,
                'date' => $date
            ]);

            $rowCount++;
        }

        fclose($file);

        View::render('expenses', [
            'success' => "$rowCount expenses imported successfully. $skipped rows skipped.",
            'expenses' => $this->expense->getAllForUser($userId),
            'categories' => $this->category->getAll(),
            'monthlyTotal' => $this->expense->getMonthlyTotal($userId),
            'categoryTotals' => $this->expense->getTotalByCategory($userId),
            'filters' => ['category_id' => null, 'date' => null]
        ]);
    }
}
