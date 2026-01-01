<x-mail::html.notification>
    <x-slot:body>
        {!! $formatter->convert($translator->trans('ianm-follow-users.email.new_follower.html.body', [
            '{follower_display_name}' => $blueprint->getFromUser()->display_name
        ])) !!}
    </x-slot:body>
</x-mail::html.notification>
