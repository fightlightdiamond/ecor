<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(['email' => 'admin@thanglongcheviet.vn'], [
            'name' => 'Admin Thăng Long Trà',
            'password' => bcrypt('admin@123'),
            'is_admin' => true,
        ]);
        
        if (!$admin->email_verified_at) {
            $admin->email_verified_at = now();
            $admin->save();
        }

        $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $admin->syncRoles([$role]);

        $category = \TomatoPHP\FilamentCms\Models\Category::firstOrCreate([
            'slug' => 'tra-xanh',
        ], [
            'name' => ['vi' => 'Trà xanh', 'en' => 'Green Tea'],
            'for' => 'products',
            'type' => 'category',
            'is_active' => true,
        ]);

        // Trà xanh Thái Nguyên
        $teaImages = [
            'https://images.unsplash.com/photo-1594631252845-29fc4cc8c011?q=80&w=800',
            'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=800',
            'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800',
            'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800',
            'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800',
        ];

        for ($i = 1; $i <= 100; $i++) {
            $name = "Trà đặc sản siêu hạng số $i";
            \App\Models\Product::firstOrCreate([
                'slug' => Str::slug($name),
            ], [
                'name' => $name,
                'price' => rand(150, 1500) * 1000,
                'stock' => rand(10, 500),
                'sku' => "TRA-" . str_pad($i, 5, '0', STR_PAD_LEFT),
                'category_id' => $category->id,
                'status' => 'published',
                'description' => "<p>Mô tả siêu chi tiết cho loại trà đỉnh cao số $i. Trà được trồng trên núi cao, thu hoạch thủ công vào buổi sáng sớm tinh sương. Vị chát nhẹ, hậu ngọt sâu, mang đến cảm giác thư thái tuyệt vời.</p>",
                'images' => [$teaImages[array_rand($teaImages)]],
                'custom_fields' => [
                    'features' => ['Hương vị tinh khiết', 'Lá trà nguyên bản', 'Sản xuất thủ công 100%', 'Đóng gói sang trọng']
                ]
            ]);
        }

        // Posts
        $postImages = [
            'https://images.unsplash.com/photo-1594631252845-29fc4cc8c011?q=80&w=800',
            'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800',
            'https://images.unsplash.com/photo-1544787219-7f47ccb7fae6?q=80&w=800',
            'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800',
            'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800',
        ];

        for ($j = 1; $j <= 50; $j++) {
            $title = "Nghệ thuật thưởng trà và câu chuyện số $j";
            $post = \TomatoPHP\FilamentCms\Models\Post::firstOrCreate([
                'slug' => Str::slug($title),
            ], [
                'title' => ['vi' => $title, 'en' => "The art of tea and story $j"],
                'short_description' => ['vi' => "Đoạn trích dẫn ngắn gọn giới thiệu bài viết số $j. Cùng tìm hiểu những bí quyết pha trà chuẩn vị và phong cách thưởng trà của người xưa.", 'en' => 'Short excerpt for the post'],
                'body' => ['vi' => "<p>Nội dung chi tiết bài viết số $j về văn hóa thưởng trà truyền thống Việt Nam. Đây là những chia sẻ đầy tâm huyết từ những nghệ nhân làm trà lâu năm. Không chỉ là thức uống, trà còn là một nghệ thuật sống, giúp tâm hồn tĩnh lặng và gắn kết con người.</p>", 'en' => '<p>Detailed content.</p>'],
                'is_published' => true,
                'type' => 'post',
                'published_at' => now()->subDays(rand(1, 300)),
                'author_id' => $admin->id,
                'author_type' => get_class($admin),
//                'meta' => [
//                    'image' => $postImages[array_rand($postImages)]
//                ]
            ]);
        }
    }
}
