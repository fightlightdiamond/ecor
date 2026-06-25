<?php

namespace App\Console\Commands;

use App\Support\StorefrontContent;
use Illuminate\Console\Command;

class ImportStorefrontSections extends Command
{
    protected $signature = 'storefront:import-sections';

    protected $description = 'Import storefront JSON files into the database';

    public function handle(): int
    {
        $imported = StorefrontContent::importFromFiles();

        $this->info('Imported sections: ' . implode(', ', $imported));

        return self::SUCCESS;
    }
}
