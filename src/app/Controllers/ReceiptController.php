<?php

namespace App\Controllers;

use App\Classes\Receipt;
use App\Classes\Expense;
use App\Classes\View;

class ReceiptController {
    private Receipt $receipt;
    private Expense $expense;

    public function __construct() {
        $this->receipt = new Receipt();
        $this->expense = new Expense();
    }

    public function index(): void {
        $this->checkAuth();
        
        $userId = $_SESSION['user']['id'];
        $filters = [
            'date_from' => $_GET['date_from'] ?? null,
            'date_to' => $_GET['date_to'] ?? null,
            'category_id' => $_GET['category'] ?? null
        ];

        $data = [
            'receipts' => $this->receipt->getAllForUser($userId, $filters),
            'totalReceipts' => count($this->receipt->getAllForUser($userId)),
            'monthlyTotal' => $this->receipt->getTotalByMonth($userId, date('Y'), date('n')),
            'view' => 'index'
        ];

        View::render('receipts', $data);
    }

    public function create(): void {
        $this->checkAuth();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $receiptData = [
                    'transaction_id' => $_POST['transaction_id'],
                    'total_amount' => $_POST['total_amount'],
                    'date' => $_POST['date']
                ];

                // Handle file upload if provided
                if (!empty($_FILES['receipt_file']['name'])) {
                    $receiptData['file_path'] = $this->receipt->uploadFile($_FILES['receipt_file']);
                }

                if ($this->receipt->create($receiptData)) {
                    header('Location: /Dev25Expenies/public/receipts');
                    exit;
                }

                throw new \Exception('Failed to create receipt');
            } catch (\Exception $e) {
                View::render('receipts', [
                    'error' => $e->getMessage(),
                    'transactions' => $this->getUserTransactions(),
                    'view' => 'create'
                ]);
            }
        } else {
            View::render('receipts', [
                'transactions' => $this->getUserTransactions(),
                'view' => 'create'
            ]);
        }
    }

    public function edit(int $id): void {
        $this->checkAuth();
        
        $receipt = $this->receipt->getById($id);
        
        if (!$receipt) {
            header('Location: /Dev25Expenies/public/receipts');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $receiptData = [
                    'total_amount' => $_POST['total_amount'],
                    'date' => $_POST['date']
                ];

                // Handle file upload if new file is provided
                if (!empty($_FILES['receipt_file']['name'])) {
                    // Delete old file if exists
                    if (!empty($receipt['file_path'])) {
                        $this->receipt->deleteFile($receipt['file_path']);
                    }
                    $receiptData['file_path'] = $this->receipt->uploadFile($_FILES['receipt_file']);
                }

                if ($this->receipt->update($id, $receiptData)) {
                    header('Location: /Dev25Expenies/public/receipts');
                    exit;
                }

                throw new \Exception('Failed to update receipt');
            } catch (\Exception $e) {
                View::render('receipts', [
                    'error' => $e->getMessage(),
                    'receipt' => $receipt,
                    'view' => 'edit'
                ]);
            }
        } else {
            View::render('receipts', [
                'receipt' => $receipt,
                'view' => 'edit'
            ]);
        }
    }

    public function delete(int $id): void {
        $this->checkAuth();
        
        try {
            $receipt = $this->receipt->getById($id);
            
            if ($receipt) {
                // Delete associated file if exists
                if (!empty($receipt['file_path'])) {
                    $this->receipt->deleteFile($receipt['file_path']);
                }
                
                if ($this->receipt->delete($id)) {
                    header('Location: /Dev25Expenies/public/receipts');
                    exit;
                }
            }

            throw new \Exception('Failed to delete receipt');
        } catch (\Exception $e) {
            View::render('receipts', [
                'error' => $e->getMessage(),
                'receipts' => $this->receipt->getAllForUser($_SESSION['user']['id']),
                'view' => 'index'
            ]);
        }
    }

    public function view(int $id): void {
        $this->checkAuth();
        
        $receipt = $this->receipt->getById($id);
        
        if (!$receipt) {
            header('Location: /Dev25Expenies/public/receipts');
            exit;
        }

        View::render('receipts', [
            'receipt' => $receipt,
            'view' => 'view'
        ]);
    }

    private function getUserTransactions(): array {
        $userId = $_SESSION['user']['id'];
        return $this->expense->getAllForUser($userId);
    }

    private function checkAuth(): void {
        if (!isset($_SESSION['user'])) {
            header('Location: /Dev25Expenies/public/login');
            exit;
        }
    }
}
