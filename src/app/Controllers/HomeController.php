<?php

namespace App\Controllers;

use App\Classes\Expense;
use App\Classes\Category;
use App\Classes\View;

class HomeController {
    private Expense $expense;
    private Category $category;

    public function __construct() {
        $this->expense = new Expense();
        $this->category = new Category();
    }

    public function dashboard(): void {
        // Check if user is logged in, redirect to login if not
        if (!isset($_SESSION['user'])) {
            header('Location: /Dev25Expenies/public/login');
            exit;
        }

        $userId = $_SESSION['user']['id'];
        
        // Get dashboard data
        $data = [
            'username' => $_SESSION['user']['name'],
            'totalExpenses' => $this->expense->getTotalExpenses($userId),
            'monthlyExpenses' => $this->expense->getMonthlyTotal($userId),
            'categoriesCount' => count($this->category->getAll()),
            'recentTransactions' => $this->expense->getAllForUser($userId, ['limit' => 5]),
            'baseUrl' => '/Dev25Expenies/public'
        ];

        View::render('dashboard', $data);
    }
}
