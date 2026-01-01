<x-mail::plain.notification>
<x-slot:body>
{!! $translator->trans('ianm-follow-users.email.new_follower.plain.body', [
'{follower_display_name}' => $blueprint->getFromUser()->display_name,
'{profile_url}' => $url->to('forum')->route('user', ['username' => $blueprint->getFromUser()->username])
]) !!}
</x-slot:body>
</x-mail::plain.notification>
