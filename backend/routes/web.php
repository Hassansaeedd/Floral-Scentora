<?php

use Illuminate\Support\Facades\Route;

// SPA Fallback Route: Serve index.html for all non-API web routes
Route::get('/{any?}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return file_get_contents($indexPath);
    }
    return response('Application is building. Please refresh in a moment.', 503);
})->where('any', '^(?!api).*$');
