<?php

// declare(strict_type=1);
namespace App\Exceptions;

class RouteNotFoundException extends \Exception
{
    protected $message = '404 Not Found';
}