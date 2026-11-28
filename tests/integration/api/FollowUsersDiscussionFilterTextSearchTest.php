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

use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use PHPUnit\Framework\Attributes\Test;

#[RunTestsInSeparateProcesses]
class FollowUsersDiscussionFilterTextSearchTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('ianm-follow-users');

        $this->prepareDatabase([
            User::class      => [$this->normalUser()],
            'user_followers' => [
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ],
        ]);

        // MySQL and MariaDB only index FULLTEXT rows on commit, so the searched
        // rows are inserted outside the test transaction, as core's
        // ListWithFulltextSearchTest does, and removed in tearDown().
        $this->database()->rollBack();

        $this->database()->table('users')->insert($this->rowsThroughFactory(User::class, [
            ['id' => 3, 'username' => 'followed', 'email' => 'followed@machine.local', 'is_email_confirmed' => true],
            ['id' => 4, 'username' => 'other', 'email' => 'other@machine.local', 'is_email_confirmed' => true],
        ]));

        $this->database()->table('discussions')->insert($this->rowsThroughFactory(Discussion::class, [
            ['id' => 1, 'title' => 'Alpha by followed', 'user_id' => 3, 'comment_count' => 1],
            ['id' => 2, 'title' => 'Alpha by other', 'user_id' => 4, 'comment_count' => 1],
            ['id' => 3, 'title' => 'Beta by other', 'user_id' => 4, 'comment_count' => 1],
        ]));

        $this->database()->table('posts')->insert($this->rowsThroughFactory(Post::class, [
            ['id' => 1, 'discussion_id' => 1, 'user_id' => 3, 'number' => 1, 'content' => '<t><p>Alpha</p></t>'],
            ['id' => 2, 'discussion_id' => 2, 'user_id' => 4, 'number' => 1, 'content' => '<t><p>Alpha</p></t>'],
            ['id' => 3, 'discussion_id' => 3, 'user_id' => 4, 'number' => 1, 'content' => '<t><p>Beta</p></t>'],
        ]));

        $this->database()->beginTransaction();

        $this->populateDatabase();
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $this->database()->table('posts')->whereIn('id', [1, 2, 3])->delete();
        $this->database()->table('discussions')->whereIn('id', [1, 2, 3])->delete();
        $this->database()->table('users')->whereIn('id', [3, 4])->delete();
    }

    public static function cases(): array
    {
        return [
            'negated'     => ['-following-users', ['2']],
            'not negated' => ['following-users', ['1']],
        ];
    }

    /**
     * @param string[] $expected
     */
    #[Test]
    #[DataProvider('cases')]
    public function filter_combines_with_a_text_search(string $filter, array $expected): void
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 2])
                ->withQueryParams(['filter' => ['q' => 'Alpha', $filter => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $ids = array_column(json_decode($response->getBody()->getContents(), true)['data'], 'id');
        sort($ids);

        $this->assertEquals($expected, $ids);
    }
}
