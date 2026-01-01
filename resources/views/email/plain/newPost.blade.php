<x-mail::plain.notification>
<x-slot:body>
{!! $translator->trans('ianm-follow-users.email.new_post.plain.body', [
'{user_display_name}' => $blueprint->getFromUser()->display_name,
'{discussion_title}' => $blueprint->post->discussion->title,
'{post_url}' => $url->to('forum')->route('discussion', ['id' => $blueprint->post->discussion_id, 'near' => $blueprint->post->number]),
'{post_content}' => $blueprint->post->content
]) !!}
</x-slot:body>
</x-mail::plain.notification>
