<?php

namespace App\Classes;

class View
{
    public static function render(string $view, array $data = []): void
    {
        $baseUrl = '/Dev25Expenies';
        $publicUrl = $baseUrl . '/public';
        $assetsUrl = $baseUrl . '/public/assets';

        $data['baseUrl'] = $publicUrl;
        $data['assetsUrl'] = $assetsUrl;

        $page = $view;
        $pageProps = $data;

        require BASE_PATH . "/src/app/Views/layouts/main.php";
    }
}
