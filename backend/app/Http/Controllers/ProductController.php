<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Product::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'notes_top' => 'nullable|string',
            'notes_middle' => 'nullable|string',
            'notes_base' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'longevity' => 'nullable|string',
            'sillage' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $qty = intval($data['quantity']);
        $data['stock_status'] = $this->calculateStockStatus($qty);
        
        if (empty($data['brand'])) {
            $data['brand'] = 'Al-Qadsiya';
        }
        if (empty($data['image'])) {
            $data['image'] = 'assets/images/rose_whisper.jpg';
        }

        $product = Product::create($data);

        return response()->json($product, 211); // Standard created status
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'quantity' => 'sometimes|required|integer|min:0',
            'notes_top' => 'nullable|string',
            'notes_middle' => 'nullable|string',
            'notes_base' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'longevity' => 'nullable|string',
            'sillage' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if (isset($data['quantity'])) {
            $qty = intval($data['quantity']);
            $data['stock_status'] = $this->calculateStockStatus($qty);
        }

        $product->update($data);

        return response()->json($product, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    /**
     * Admin passcode validation endpoint
     */
    public function adminLogin(Request $request)
    {
        $request->validate([
            'passcode' => 'required|string',
        ]);

        if ($request->passcode === 'admin123') {
            return response()->json([
                'success' => true,
                'token' => 'admin_authenticated_session_token_12345'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid admin passcode'
        ], 401);
    }

    /**
     * Helper to compute stock status
     */
    private function calculateStockStatus(int $qty): string
    {
        if ($qty <= 0) {
            return 'Out of Stock';
        } elseif ($qty <= 5) {
            return 'Low Stock';
        }
        return 'In Stock';
    }
}
