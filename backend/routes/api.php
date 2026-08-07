<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// Public and Admin Product Endpoints (passcode authentication is handled by the client)
Route::apiResource('products', ProductController::class);

// Admin Passcode Verification Endpoint
Route::post('admin/login', [ProductController::class, 'adminLogin']);

// Image proxy — fetches external product images and streams through our server
// This bypasses hotlink protection on the source site
Route::get('image-proxy', function (Request $request) {
    $url = $request->query('url');
    if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
        return response('Invalid URL', 400);
    }

    // Only allow images from alqadsiya.com for security
    $host = parse_url($url, PHP_URL_HOST);
    if (!str_ends_with($host, 'alqadsiya.com')) {
        return response('Forbidden domain', 403);
    }

    try {
        $context = stream_context_create([
            'http' => [
                'header' => implode("\r\n", [
                    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                    'Referer: https://alqadsiya.com/',
                    'Accept: image/webp,image/apng,image/*,*/*;q=0.8',
                ]),
                'timeout' => 10,
                'follow_location' => true,
            ]
        ]);

        $imageData = @file_get_contents($url, false, $context);
        if ($imageData === false) {
            return response('Image fetch failed', 502);
        }

        // Detect content type from URL extension
        $ext = strtolower(pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION));
        $mimeMap = [
            'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png', 'webp' => 'image/webp',
            'gif' => 'image/gif', 'svg' => 'image/svg+xml',
        ];
        $mime = $mimeMap[$ext] ?? 'image/jpeg';

        return response($imageData, 200)
            ->header('Content-Type', $mime)
            ->header('Cache-Control', 'public, max-age=86400')
            ->header('Access-Control-Allow-Origin', '*');
    } catch (\Exception $e) {
        return response('Error: ' . $e->getMessage(), 500);
    }
});
