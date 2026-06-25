<x-mail::message>
# {{ $heading }}

@foreach($lines as $line)
- {{ $line }}
@endforeach

<x-mail::button :url="config('app.url') . '/admin'">
Mở Admin
</x-mail::button>

{{ $siteName }}
</x-mail::message>
