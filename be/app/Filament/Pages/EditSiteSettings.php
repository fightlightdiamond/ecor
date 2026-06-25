<?php

namespace App\Filament\Pages;

use App\Models\StorefrontSection;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class EditSiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationGroup = 'Website';

    protected static ?string $navigationLabel = 'Site settings';

    protected static ?int $navigationSort = 1;

    protected static string $view = 'filament.pages.edit-site-settings';

    public ?array $data = [];

    public function mount(): void
    {
        if (! StorefrontSection::query()->where('key', 'settings')->exists()) {
            \App\Support\StorefrontContent::importFromFiles();
        }

        $settings = StorefrontSection::query()->where('key', 'settings')->first();
        $content = $settings?->content ?? [];

        $this->form->fill([
            'salon_name_vi' => data_get($content, 'salon.name.vi'),
            'salon_name_en' => data_get($content, 'salon.name.en'),
            'salon_tagline_vi' => data_get($content, 'salon.tagline.vi'),
            'salon_tagline_en' => data_get($content, 'salon.tagline.en'),
            'salon_description_vi' => data_get($content, 'salon.description.vi'),
            'salon_description_en' => data_get($content, 'salon.description.en'),
            'contact_phone' => data_get($content, 'contact.phone'),
            'contact_phone_display' => data_get($content, 'contact.phoneDisplay'),
            'contact_mobile' => data_get($content, 'contact.mobile'),
            'contact_email' => data_get($content, 'contact.email'),
            'contact_address_vi' => data_get($content, 'contact.address.vi'),
            'contact_address_en' => data_get($content, 'contact.address.en'),
            'contact_map_embed' => data_get($content, 'contact.mapEmbed'),
            'social_facebook' => data_get($content, 'social.facebook'),
            'social_instagram' => data_get($content, 'social.instagram'),
            'social_zalo' => data_get($content, 'social.zalo'),
            'social_youtube' => data_get($content, 'social.youtube'),
            'hours' => data_get($content, 'hours', []),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Salon')->schema([
                    Forms\Components\TextInput::make('salon_name_vi')->label('Name (Vietnamese)')->required(),
                    Forms\Components\TextInput::make('salon_name_en')->label('Name (English)'),
                    Forms\Components\TextInput::make('salon_tagline_vi')->label('Tagline (Vietnamese)'),
                    Forms\Components\TextInput::make('salon_tagline_en')->label('Tagline (English)'),
                    Forms\Components\Textarea::make('salon_description_vi')->label('Description (Vietnamese)')->rows(3),
                    Forms\Components\Textarea::make('salon_description_en')->label('Description (English)')->rows(3),
                ])->columns(2),

                Forms\Components\Section::make('Contact')->schema([
                    Forms\Components\TextInput::make('contact_phone')->label('Phone'),
                    Forms\Components\TextInput::make('contact_phone_display')->label('Phone display'),
                    Forms\Components\TextInput::make('contact_mobile')->label('Mobile'),
                    Forms\Components\TextInput::make('contact_email')->label('Email')->email(),
                    Forms\Components\TextInput::make('contact_address_vi')->label('Address (Vietnamese)'),
                    Forms\Components\TextInput::make('contact_address_en')->label('Address (English)'),
                    Forms\Components\Textarea::make('contact_map_embed')->label('Google Maps embed URL')->rows(2)->columnSpanFull(),
                ])->columns(2),

                Forms\Components\Section::make('Opening hours')->schema([
                    Forms\Components\Repeater::make('hours')
                        ->schema([
                            Forms\Components\TextInput::make('days.vi')->label('Days (Vietnamese)')->required(),
                            Forms\Components\TextInput::make('days.en')->label('Days (English)'),
                            Forms\Components\TextInput::make('time')->label('Hours')->required(),
                        ])
                        ->columns(3)
                        ->columnSpanFull(),
                ]),

                Forms\Components\Section::make('Social links')->schema([
                    Forms\Components\TextInput::make('social_facebook')->label('Facebook')->url(),
                    Forms\Components\TextInput::make('social_instagram')->label('Instagram')->url(),
                    Forms\Components\TextInput::make('social_zalo')->label('Zalo')->url(),
                    Forms\Components\TextInput::make('social_youtube')->label('YouTube')->url(),
                ])->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $state = $this->form->getState();

        $section = StorefrontSection::query()->firstOrCreate(
            ['key' => 'settings'],
            ['label' => 'Site settings', 'content' => []],
        );

        $content = $section->content ?? [];

        data_set($content, 'salon.name.vi', $state['salon_name_vi']);
        data_set($content, 'salon.name.en', $state['salon_name_en'] ?: $state['salon_name_vi']);
        data_set($content, 'salon.tagline.vi', $state['salon_tagline_vi']);
        data_set($content, 'salon.tagline.en', $state['salon_tagline_en']);
        data_set($content, 'salon.description.vi', $state['salon_description_vi']);
        data_set($content, 'salon.description.en', $state['salon_description_en']);
        data_set($content, 'contact.phone', $state['contact_phone']);
        data_set($content, 'contact.phoneDisplay', $state['contact_phone_display']);
        data_set($content, 'contact.mobile', $state['contact_mobile']);
        data_set($content, 'contact.email', $state['contact_email']);
        data_set($content, 'contact.address.vi', $state['contact_address_vi']);
        data_set($content, 'contact.address.en', $state['contact_address_en'] ?: $state['contact_address_vi']);
        data_set($content, 'contact.mapEmbed', $state['contact_map_embed']);
        data_set($content, 'social.facebook', $state['social_facebook']);
        data_set($content, 'social.instagram', $state['social_instagram']);
        data_set($content, 'social.zalo', $state['social_zalo']);
        data_set($content, 'social.youtube', $state['social_youtube']);
        $content['hours'] = $state['hours'] ?? [];

        $section->update(['content' => $content]);

        Notification::make()->title('Site settings saved')->success()->send();
    }
}
