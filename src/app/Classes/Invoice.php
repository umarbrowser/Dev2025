<?php
namespace App\Classes;

class Invoice
{
    public function index(): string
    {
        echo "Invoices";
        return 'Invoices';
    }


    public function create(): string
    {
        echo "Invoices/create";
        return 'Invoices\create';
    }
}