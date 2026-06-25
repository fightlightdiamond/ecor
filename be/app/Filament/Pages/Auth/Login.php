<?php

namespace App\Filament\Pages\Auth;

use Filament\Pages\Auth\Login as BaseLogin;

class Login extends BaseLogin
{
    public const DEV_EMAIL = 'admin@thanglongcheviet.vn';

    public const DEV_PASSWORD = 'admin@123';

    public function mount(): void
    {
        parent::mount();

        if (! app()->environment('production')) {
            $this->form->fill([
                'email' => self::DEV_EMAIL,
                'password' => self::DEV_PASSWORD,
                'remember' => true,
            ]);
        }
    }

    public function getSubheading(): ?string
    {
        if (app()->environment('production')) {
            return null;
        }

        return self::DEV_EMAIL . ' / ' . self::DEV_PASSWORD;
    }
}
