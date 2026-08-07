<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand')->default('Al-Qadsiya');
            $table->string('category');
            $table->decimal('price', 8, 2);
            $table->integer('quantity')->default(0);
            $table->string('stock_status')->default('Out of Stock');
            $table->string('notes_top')->nullable();
            $table->string('notes_middle')->nullable();
            $table->string('notes_base')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->default('assets/images/rose_whisper.jpg');
            $table->string('longevity')->nullable();
            $table->string('sillage')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
