{!! $translator->trans('ianm-follow-users.email.new_discussion_by_user_body', [
'{recipient_display_name}' => $user->display_name,
'{user_display_name}' => $blueprint->getFromUser()->display_name,
'{discussion_title}' => $blueprint->discussion->title,
'{discussion_url}' => $url->to('forum')->route('discussion', ['id' => $blueprint->discussion->id]),
'{post_content}' => $blueprint->post->content,
]) !!}
