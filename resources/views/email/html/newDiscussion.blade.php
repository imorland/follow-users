<x-mail::html.notification>
    <x-slot:body>
        {!! $formatter->convert($translator->trans('ianm-follow-users.email.new_discussion_by_user.html.body', [
            '{user_display_name}' => $blueprint->getFromUser()->display_name,
            '{discussion_title}' => $blueprint->discussion->title,
            '{discussion_url}' => $url->to('forum')->route('discussion', ['id' => $blueprint->discussion->id])
        ])) !!}
    </x-slot:body>

    <x-slot:preview>
        {!! $blueprint->post->formatContent() !!}
    </x-slot:preview>
</x-mail::html.notification>
