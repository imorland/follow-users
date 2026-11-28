<?php

/*
 * This file is part of ianm/follow-users
 *
 *  Copyright (c) Ian Morland.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 *
 */

namespace IanM\FollowUsers\Tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use PHPUnit\Framework\Attributes\Test;

#[RunTestsInSeparateProcesses]
class FollowUsersNegatedDiscussionFilterTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('flarum-tags', 'ianm-follow-users');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'followed', 'email' => 'followed@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'other', 'email' => 'other@machine.local', 'is_email_confirmed' => true],
            ],
            'tags' => [
                ['id' => 1, 'name' => 'General', 'slug' => 'general', 'color' => '#000', 'position' => 0],
                ['id' => 2, 'name' => 'Staff', 'slug' => 'staff', 'color' => '#000', 'position' => 1, 'is_restricted' => true],
                ['id' => 3, 'name' => 'Other', 'slug' => 'other', 'color' => '#000', 'position' => 2],
            ],
            'discussions' => [
                ['id' => 1, 'title' => 'Alpha by followed', 'slug' => 'alpha-by-followed', 'user_id' => 3, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00'],
                ['id' => 2, 'title' => 'Beta by followed', 'slug' => 'beta-by-followed', 'user_id' => 3, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00'],
                ['id' => 3, 'title' => 'Alpha by other', 'slug' => 'alpha-by-other', 'user_id' => 4, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00'],
                ['id' => 4, 'title' => 'Beta by actor', 'slug' => 'beta-by-actor', 'user_id' => 2, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00'],
                ['id' => 5, 'title' => 'Hidden by followed', 'slug' => 'hidden-by-followed', 'user_id' => 3, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00', 'hidden_at' => '2024-01-02 00:00:00', 'hidden_user_id' => 1],
                ['id' => 6, 'title' => 'Restricted by followed', 'slug' => 'restricted-by-followed', 'user_id' => 3, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00'],
                ['id' => 7, 'title' => 'Hidden by other', 'slug' => 'hidden-by-other', 'user_id' => 4, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00', 'hidden_at' => '2024-01-02 00:00:00', 'hidden_user_id' => 1],
                ['id' => 8, 'title' => 'Restricted by other', 'slug' => 'restricted-by-other', 'user_id' => 4, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00'],
                ['id' => 9, 'title' => 'By a deleted user', 'slug' => 'by-a-deleted-user', 'user_id' => null, 'participant_count' => 1, 'comment_count' => 1, 'created_at' => '2024-01-01 00:00:00', 'last_posted_at' => '2024-01-01 00:00:00'],
            ],
            'posts' => [
                ['id' => 1, 'discussion_id' => 1, 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>Alpha by followed</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 2, 'discussion_id' => 2, 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>Beta by followed</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 3, 'discussion_id' => 3, 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>Alpha by other</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 4, 'discussion_id' => 4, 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>Beta by actor</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 5, 'discussion_id' => 5, 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>Hidden by followed</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 6, 'discussion_id' => 6, 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>Restricted by followed</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 7, 'discussion_id' => 7, 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>Hidden by other</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 8, 'discussion_id' => 8, 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>Restricted by other</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 9, 'discussion_id' => 9, 'user_id' => null, 'type' => 'comment', 'content' => '<t><p>By a deleted user</p></t>', 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
            ],
            'discussion_tag' => [
                ['discussion_id' => 1, 'tag_id' => 1],
                ['discussion_id' => 2, 'tag_id' => 1],
                ['discussion_id' => 3, 'tag_id' => 1],
                ['discussion_id' => 4, 'tag_id' => 3],
                ['discussion_id' => 5, 'tag_id' => 1],
                ['discussion_id' => 6, 'tag_id' => 2],
                ['discussion_id' => 7, 'tag_id' => 1],
                ['discussion_id' => 8, 'tag_id' => 2],
                ['discussion_id' => 9, 'tag_id' => 1],
            ],
            'user_followers' => [
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ],
        ]);
    }

    public static function negatedFilterCases(): array
    {
        return [
            'alone'          => [[], ['3', '4', '9']],
            'with an author' => [['author' => 'other'], ['3']],
            'with a tag'     => [['tag' => 'general'], ['3', '9']],
        ];
    }

    /**
     * @param array<string, string> $otherFilters
     * @param string[]              $expected
     */
    #[Test]
    #[DataProvider('negatedFilterCases')]
    public function negated_filter_excludes_followed_users_discussions(array $otherFilters, array $expected): void
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 2])
                ->withQueryParams(['filter' => $otherFilters + ['-following-users' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $ids = array_column(json_decode($response->getBody()->getContents(), true)['data'], 'id');
        sort($ids);

        $this->assertEquals($expected, $ids);
    }

    #[Test]
    public function negated_filter_keeps_every_visible_discussion_when_actor_follows_nobody(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 4])
                ->withQueryParams(['filter' => ['-following-users' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $ids = array_column(json_decode($response->getBody()->getContents(), true)['data'], 'id');
        sort($ids);

        // Discussion 7 is hidden, but user 4 started it.
        $this->assertEquals(['1', '2', '3', '4', '7', '9'], $ids);
    }

    #[Test]
    public function negated_filter_is_a_noop_for_guests(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions')
                ->withQueryParams(['filter' => ['-following-users' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $ids = array_column(json_decode($response->getBody()->getContents(), true)['data'], 'id');
        sort($ids);

        $this->assertEquals(['1', '2', '3', '4', '9'], $ids);
    }
}
