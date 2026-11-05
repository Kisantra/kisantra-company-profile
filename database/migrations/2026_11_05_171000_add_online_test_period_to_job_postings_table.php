<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            // Applicants are asked whether they can take the online test (laptop + camera) in this range.
            $table->date('online_test_start_date')->nullable()->after('required_documents');
            $table->date('online_test_end_date')->nullable()->after('online_test_start_date');
        });
    }

    public function down(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropColumn(['online_test_start_date', 'online_test_end_date']);
        });
    }
};
