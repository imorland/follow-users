<x-mail::html.notification>
    <x-slot:body>
        {!! $translator->trans('ianm-follow-users.email.new_post_body', [
'{recipient_display_name}' => $user->display_name,
'{user_display_name}' => $blueprint->getFromUser()->display_name,
'{discussion_title}' => $blueprint->post->discussion->title,
'{post_url}' => $url->to('forum')->route('discussion', ['id' => $blueprint->post->discussion_id]) . '/' . $blueprint->post->number,
'{post_content}' => $blueprint->post->content,
]) !!}
    </x-slot:body>

    <x-slot:preview><!-- Optional content --></x-slot:preview>
</x-mail::html.notification>
