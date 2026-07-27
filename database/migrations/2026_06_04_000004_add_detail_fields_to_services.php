<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('subtitle')->nullable()->after('name');
            $table->string('hero_image')->nullable()->after('slug');
            $table->longText('overview')->nullable()->after('description');
            $table->json('process_steps')->nullable()->after('features');
            $table->json('examples')->nullable()->after('process_steps');
            $table->json('faqs')->nullable()->after('examples');
            $table->text('seo_description')->nullable()->after('faqs');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['subtitle', 'hero_image', 'overview', 'process_steps', 'examples', 'faqs', 'seo_description']);
        });
    }
};
