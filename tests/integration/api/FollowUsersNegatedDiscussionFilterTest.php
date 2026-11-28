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

class FollowUsersNegatedDiscussionFilterTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('flarum-tags', 'ianm-follow-users');

        $discussions = [
            [1, 'Alpha by followed', 3, null, 1],
            [2, 'Beta by followed', 3, null, 1],
            [3, 'Alpha by other', 4, null, 1],
            [4, 'Beta by actor', 2, null, 3],
            [5, 'Hidden by followed', 3, '2024-01-02 00:00:00', 1],
            [6, 'Restricted by followed', 3, null, 2],
            [7, 'Hidden by other', 4, '2024-01-02 00:00:00', 1],
            [8, 'Restricted by other', 4, null, 2],
            [9, 'By a deleted user', null, null, 1],
        ];

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'followed', 'email' => 'followed@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'other', 'email' => 'other@machine.local', 'is_email_confirmed' => true],
            ],
            'tags' => [
                ['id' => 1, 'name' => 'General', 'slug' => 'general', 'color' => '#000', 'position' => 0],
                ['id' => 2, 'name' => 'Staff', 'slug' => 'staff', 'color' => '#000', 'position' => 1, 'is_restricted' => true],
                ['id' => 3, 'name' => 'Other', 'slug' => 'other', 'color' => '#000', 'position' => 2],
            ],
            'discussions' => array_map(fn ($d) => [
                'id'                => $d[0],
                'title'             => $d[1],
                'user_id'           => $d[2],
                'hidden_at'         => $d[3],
                'hidden_user_id'    => $d[3] ? 1 : null,
                'participant_count' => 1,
                'comment_count'     => 1,
                'created_at'        => '2024-01-01 00:00:00',
                'last_posted_at'    => '2024-01-01 00:00:00',
            ], $discussions),
            'posts' => array_map(fn ($d) => [
                'id'            => $d[0],
                'discussion_id' => $d[0],
                'user_id'       => $d[2],
                'type'          => 'comment',
                'content'       => '<t><p>'.$d[1].'</p></t>',
                'is_private'    => 0,
                'number'        => 1,
                'created_at'    => '2024-01-01 00:00:00',
            ], $discussions),
            'discussion_tag' => array_map(fn ($d) => ['discussion_id' => $d[0], 'tag_id' => $d[4]], $discussions),
            'user_followers' => [
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ],
        ]);
    }

    private function discussionIds(?int $actorId, array $filter): array
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions', $actorId ? ['authenticatedAs' => $actorId] : [])
                ->withQueryParams(['filter' => $filter])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $ids = array_column(json_decode($response->getBody()->getContents(), true)['data'], 'id');
        sort($ids);

        return $ids;
    }

    public function negatedFilterCases(): array
    {
        return [
            'alone'          => [[], ['3', '4', '9']],
            'with an author' => [['author' => 'other'], ['3']],
            'with a tag'     => [['tag' => 'general'], ['3', '9']],
        ];
    }

    /**
     * @test
     *
     * @dataProvider negatedFilterCases
     */
    public function negated_filter_excludes_followed_users_discussions(array $otherFilters, array $expected): void
    {
        $this->assertEquals($expected, $this->discussionIds(2, $otherFilters + ['-following-users' => '1']));
    }

    /**
     * @test
     */
    public function negated_filter_keeps_every_visible_discussion_when_actor_follows_nobody(): void
    {
        // Discussion 7 is hidden, but user 4 started it.
        $this->assertEquals(['1', '2', '3', '4', '7', '9'], $this->discussionIds(4, ['-following-users' => '1']));
    }

    /**
     * @test
     */
    public function negated_filter_is_a_noop_for_guests(): void
    {
        $this->assertEquals(['1', '2', '3', '4', '9'], $this->discussionIds(null, ['-following-users' => '1']));
    }
}
