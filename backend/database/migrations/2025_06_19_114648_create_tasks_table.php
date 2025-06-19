<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary(); // 同様に UUID にする
            $table->uuid('project_id'); // projects.id を参照
            $table->string('title');
            $table->text('description');
            $table->string('priority'); // 'low' | 'medium' | 'high'
            $table->date('due_date');
            $table->boolean('completed')->default(false);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // 外部キー制約
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
