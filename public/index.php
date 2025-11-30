<?php
// Show all errors (for development)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Define constants
define('BASE_PATH', dirname(__DIR__));
define('PUBLIC_PATH', __DIR__);

// Require all necessary files
require_once BASE_PATH . '/src/app/Router.php';
require_once BASE_PATH . '/src/app/Classes/View.php';
require_once BASE_PATH . '/src/app/Classes/Database.php';
require_once BASE_PATH . '/src/app/Classes/User.php';
require_once BASE_PATH . '/src/app/Classes/Expense.php';
require_once BASE_PATH . '/src/app/Classes/Category.php';
require_once BASE_PATH . '/src/app/Classes/Receipt.php';
require_once BASE_PATH . '/src/app/Controllers/AuthController.php';
require_once BASE_PATH . '/src/app/Controllers/ExpenseController.php';
require_once BASE_PATH . '/src/app/Controllers/HomeController.php';
require_once BASE_PATH . '/src/app/Controllers/CategoryController.php';
require_once BASE_PATH . '/src/app/Controllers/ReceiptController.php';

use App\Router;
use App\Controllers\AuthController;
use App\Controllers\ExpenseController;
use App\Controllers\HomeController;
use App\Controllers\CategoryController;
use App\Controllers\ReceiptController;

// Start session
session_start();

$router = new Router();

// Auth routes
$router->get('/login', [AuthController::class, 'showLogin'])
       ->post('/login', [AuthController::class, 'login'])
       ->get('/register', [AuthController::class, 'showRegister'])
       ->post('/register', [AuthController::class, 'register'])
       ->get('/logout', [AuthController::class, 'logout']);

// Expense routes
$router->get('/expenses', [ExpenseController::class, 'index'])
       ->post('/expenses', [ExpenseController::class, 'store'])
       ->post('/expenses/{id}/update', [ExpenseController::class, 'update'])
       ->post('/expenses/{id}/delete', [ExpenseController::class, 'delete'])
       ->get('/expenses/export', [ExpenseController::class, 'exportCSV'])
       ->post('/expenses/import', [ExpenseController::class, 'importCSV']);

// Category routes
$router->get('/categories', [CategoryController::class, 'index'])
       ->post('/categories', [CategoryController::class, 'create'])
       ->get('/categories/create', [CategoryController::class, 'create'])
       ->get('/categories/{id}/edit', [CategoryController::class, 'edit'])
       ->post('/categories/{id}/edit', [CategoryController::class, 'edit'])
       ->post('/categories/{id}/delete', [CategoryController::class, 'delete']);

// Receipt routes
$router->get('/receipts', [ReceiptController::class, 'index'])
       ->post('/receipts', [ReceiptController::class, 'create'])
       ->get('/receipts/create', [ReceiptController::class, 'create'])
       ->get('/receipts/{id}/view', [ReceiptController::class, 'view'])
       ->get('/receipts/{id}/edit', [ReceiptController::class, 'edit'])
       ->post('/receipts/{id}/edit', [ReceiptController::class, 'edit'])
       ->post('/receipts/{id}/delete', [ReceiptController::class, 'delete']);
       

       
// Dashboard route
$router->get('/', [HomeController::class, 'dashboard']);

try {
    $router->resolve($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
} catch (\App\Exceptions\RouteNotFoundException $e) {
    http_response_code(404);
    echo 'Page not found';
}
