<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'category',
        'price',
        'quantity',
        'stock_status',
        'notes_top',
        'notes_middle',
        'notes_base',
        'description',
        'image',
        'longevity',
        'sillage',
    ];

    protected $casts = [
        'price' => 'float',
        'quantity' => 'integer',
    ];
}
