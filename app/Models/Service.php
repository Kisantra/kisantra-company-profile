<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'subtitle',
        'slug',
        'hero_image',
        'category',
        'description',
        'overview',
        'price',
        'price_note',
        // 'icon', // REMOVED - Icons now auto-generated based on category
        'features',
        'process_steps',
        'examples',
        'faqs',
        'seo_description',
        'target_business_types',
        'target_pkp_status',
        'search_keywords',
        'recommendation_priority',
        'is_active',
        'order',
    ];

    protected $casts = [
        'features' => 'array',
        'process_steps' => 'array',
        'examples' => 'array',
        'faqs' => 'array',
        'target_business_types' => 'array',
        'target_pkp_status' => 'array',
        'search_keywords' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
        'recommendation_priority' => 'integer',
    ];

    // Accessors
    public function getHeroImageAttribute($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        return '/storage/' . ltrim($value, '/');
    }

    // Automatically generate slug when creating
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->name);
            }
        });
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('name', 'asc');
    }

    public function scopeByCategory($query, $category)
    {
        if ($category && $category !== 'all') {
            return $query->where('category', $category);
        }
        return $query;
    }

    public function scopeSearch($query, $search)
    {
        if (!empty($search)) {
            $searchTerms = explode(' ', $search);
            
            return $query->where(function ($q) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    $q->orWhere('name', 'like', "%{$term}%")
                      ->orWhere('description', 'like', "%{$term}%")
                      ->orWhere('category', 'like', "%{$term}%")
                      ->orWhereJsonContains('search_keywords', $term);
                }
            });
        }
        return $query;
    }

    // Smart Filter Scopes
    public function scopeForBusinessType($query, $businessType)
    {
        if (!empty($businessType)) {
            return $query->where(function ($q) use ($businessType) {
                $q->whereJsonContains('target_business_types', $businessType)
                  ->orWhereNull('target_business_types'); // null means "for all business types"
            });
        }
        return $query;
    }

    public function scopeForPkpStatus($query, $pkpStatus)
    {
        if (!empty($pkpStatus)) {
            return $query->where(function ($q) use ($pkpStatus) {
                $q->whereJsonContains('target_pkp_status', $pkpStatus)
                  ->orWhereNull('target_pkp_status'); // null means "for all PKP statuses"
            });
        }
        return $query;
    }

    public function scopeRecommended($query)
    {
        return $query->orderBy('recommendation_priority', 'desc');
    }

    // Helper Methods
    public function isForBusinessType($businessType)
    {
        if (empty($this->target_business_types)) {
            return true; // Available for all business types
        }
        return in_array($businessType, $this->target_business_types);
    }

    public function isForPkpStatus($pkpStatus)
    {
        if (empty($this->target_pkp_status)) {
            return true; // Available for all PKP statuses
        }
        return in_array($pkpStatus, $this->target_pkp_status);
    }

    public function matchesKeywords(array $keywords)
    {
        if (empty($this->search_keywords)) {
            return false;
        }
        
        foreach ($keywords as $keyword) {
            if (in_array(strtolower($keyword), array_map('strtolower', $this->search_keywords))) {
                return true;
            }
        }
        return false;
    }

    // Accessors
    public function getCategoryDisplayAttribute()
    {
        return match($this->category) {
            'Perpajakan' => 'Perpajakan',
            'Keuangan' => 'Keuangan',
            'Perizinan' => 'Perizinan',
            'Digital' => 'Digital',
            default => $this->category
        };
    }

    // Auto-generate icon based on category
    public function getIconAttribute()
    {
        // Return icon based on category - using primary brand color
        return match($this->category) {
            'Perpajakan' => '<svg class="w-6 h-6 text-[#42B2CD]" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 4h7v5h5v11H6V4zm2 8h8v2H8v-2zm0 4h8v2H8v-2z" /></svg>',
            'Keuangan' => '<svg class="w-6 h-6 text-[#42B2CD]" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 2h2v2H6V8zm0 4h2v2H6v-2zm4-4h8v2h-8V8zm0 4h8v2h-8v-2z" /></svg>',
            'Perizinan' => '<svg class="w-6 h-6 text-[#42B2CD]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>',
            'Digital' => '<svg class="w-6 h-6 text-[#42B2CD]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 9h10.5v3.5H4V9zm0 5.5h10.5V18H4v-3.5zM20 18h-3.5V9H20v9z" /></svg>',
            default => '<svg class="w-6 h-6 text-[#42B2CD]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
        };
    }
}