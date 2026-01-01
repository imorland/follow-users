<x-mail::html.notification>
    <x-slot:body>
        {!! $translator->trans('ianm-follow-users.email.new_follower_body', [
'{recipient_display_name}' => $user->display_name,
'{follower_display_name}' => $blueprint->getFromUser()->display_name,
'{profile_url}' => $url->to('forum')->route('user', ['username' => $blueprint->getFromUser()->username]),
]) !!}
    </x-slot:body>

    <x-slot:preview><!-- Optional content --></x-slot:preview>
</x-mail::html.notification>
