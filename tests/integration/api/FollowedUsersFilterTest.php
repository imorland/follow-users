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
use PHPUnit\Framework\Attributes\Test;

/**
 * Tests for FollowedUsersFilter (the `followeduser` search filter on users).
 *
 * The bug (issue #47): on PostgreSQL, the filter uses an unqualified `id` column
 * inside a query that has a JOIN between `users` and `user_followers`, causing:
 *   PDOException: SQLSTATE[42702]: Ambiguous column: column reference "id" is ambiguous
 *
 * The column references must be qualified as `users.id`.
 *
 * Note: SQLite (used in CI) does not raise an ambiguity error, so these tests
 * will appear to pass on the current (buggy) code under SQLite. They exist to:
 *   1. Document and lock in the correct behaviour.
 *   2. Fail on PostgreSQL until the fix is applied.
 *   3. Act as a regression guard going forward.
 */
class FollowedUsersFilterTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('ianm-follow-users');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'followed1', 'email' => 'followed1@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'followed2', 'email' => 'followed2@machine.local', 'is_email_confirmed' => true],
                ['id' => 5, 'username' => 'notfollowed', 'email' => 'notfollowed@machine.local', 'is_email_confirmed' => true],
            ],
            'user_followers' => [
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'created_at' => '2020-01-01 00:00:00', 'updated_at' => '2020-01-01 00:00:00', 'subscription' => 'follow'],
                ['id' => 2, 'user_id' => 2, 'followed_user_id' => 4, 'created_at' => '2020-01-01 00:00:00', 'updated_at' => '2020-01-01 00:00:00', 'subscription' => 'follow'],
            ],
        ]);
    }

    #[Test]
    public function followeduser_filter_returns_only_followed_users()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users',
                [
                    'authenticatedAs' => 2,
                    'queryParams'     => [
                        'filter' => ['followeduser' => '1'],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $returnedIds = array_column($json['data'], 'id');

        $this->assertContains('3', $returnedIds, 'followed1 (id=3) should be in results');
        $this->assertContains('4', $returnedIds, 'followed2 (id=4) should be in results');
        $this->assertNotContains('5', $returnedIds, 'notfollowed (id=5) should not be in results');
    }

    #[Test]
    public function negated_followeduser_filter_excludes_followed_users()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users',
                [
                    'authenticatedAs' => 2,
                    'queryParams'     => [
                        'filter' => ['-followeduser' => '1'],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $returnedIds = array_column($json['data'], 'id');

        $this->assertNotContains('3', $returnedIds, 'followed1 (id=3) should be excluded');
        $this->assertNotContains('4', $returnedIds, 'followed2 (id=4) should be excluded');
        $this->assertContains('5', $returnedIds, 'notfollowed (id=5) should be in results');
    }

    #[Test]
    public function followeduser_filter_returns_empty_when_actor_follows_nobody()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users',
                [
                    'authenticatedAs' => 5,
                    'queryParams'     => [
                        'filter' => ['followeduser' => '1'],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertEmpty($json['data'], 'User with no follows should get empty results');
    }
}
