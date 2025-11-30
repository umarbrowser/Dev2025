<?php
namespace App;

require_once "Exceptions/RouteNotFoundException.php";
require_once "Classes/View.php";

use App\Exceptions\RouteNotFoundException;
use App\Classes\View;

class Router
{
    private array $routes = [];

    public function register(string $requestMethod, string $route, callable|array|string $action): self
    {
        $this->routes[$requestMethod][$route] = $action;
        return $this;
    }

    public function get(string $route, callable|array|string $action): self
    {
        return $this->register('GET', $route, $action);
    }

    public function post(string $route, callable|array|string $action): self
    {
        return $this->register('POST', $route, $action);
    }

    private function getBasePath(): string
    {
        return '/Dev25Expenies/public';
    }

    public function resolve(string $requestUri, string $requestMethod = 'GET')
    {
        // Remove base path from request URI
        $basePath = $this->getBasePath();
        $route = str_replace($basePath, '', explode('?', $requestUri)[0]);
        
        // Ensure route starts with /
        $route = '/' . ltrim($route, '/');
        
        // First try exact match
        $action = $this->routes[$requestMethod][$route] ?? null;
        $params = [];
        
        // If no exact match, try pattern matching for dynamic routes
        if (!$action) {
            foreach ($this->routes[$requestMethod] ?? [] as $pattern => $action) {
                if ($this->matchRoute($pattern, $route, $params)) {
                    break;
                }
                $action = null;
            }
        }
        
        if (!$action) {
            throw new RouteNotFoundException();
        }

        if (is_callable($action)) {
            return call_user_func($action);
        }

        if (is_array($action)) {
            [$class, $method] = $action;
            if (class_exists($class)) {
                $class = new $class();
                if (method_exists($class, $method)) {
                    // Pass parameters to the method
                    if (!empty($params)) {
                        return call_user_func_array([$class, $method], $params);
                    }
                    return call_user_func_array([$class, $method], []);
                }
            }
        }

        if (is_string($action)) {
            return View::render($action);
        }

        throw new RouteNotFoundException();
    }

    private function matchRoute(string $pattern, string $route, array &$params): bool
    {
        // Convert pattern to regex (e.g., /expenses/{id}/update -> /expenses/(\d+)/update)
        $regex = preg_replace('/\{(\w+)\}/', '(\d+)', $pattern);
        $regex = '#^' . $regex . '$#';
        
        if (preg_match($regex, $route, $matches)) {
            array_shift($matches); // Remove full match
            $params = array_map('intval', $matches); // Convert to integers
            return true;
        }
        
        return false;
    }
}

