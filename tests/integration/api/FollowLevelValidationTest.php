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
use Psr\Http\Message\ResponseInterface;

#[RunTestsInSeparateProcesses]
class FollowLevelValidationTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('ianm-follow-users');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'followed', 'email' => 'followed@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'notfollowed', 'email' => 'notfollowed@machine.local', 'is_email_confirmed' => true],
            ],
            'user_followers' => [
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'subscription' => 'lurk', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ],
        ]);
    }

    private function setFollowLevel(int $userId, mixed $level): ResponseInterface
    {
        return $this->send(
            $this->request('PATCH', "/api/users/$userId", [
                'authenticatedAs' => 2,
                'json'            => ['data' => ['attributes' => ['followUsers' => $level]]],
            ])
        );
    }

    private function storedLevel(int $userId): ?string
    {
        return $this->database()->table('user_followers')
            ->where('user_id', 2)
            ->where('followed_user_id', $userId)
            ->value('subscription');
    }

    private function isFollowing(int $userId): bool
    {
        return $this->database()->table('user_followers')
            ->where('user_id', 2)
            ->where('followed_user_id', $userId)
            ->exists();
    }

    public static function invalidLevels(): array
    {
        return [
            'unknown word'   => ['bogus'],
            'different case' => ['Follow'],
            'zero'           => ['0'],
            'too long'       => [str_repeat('x', 300)],
        ];
    }

    #[Test]
    #[DataProvider('invalidLevels')]
    public function an_invalid_level_is_rejected_and_nothing_changes(string $level): void
    {
        $response = $this->setFollowLevel(3, $level);

        $this->assertEquals(422, $response->getStatusCode());
        $errors = json_decode($response->getBody()->getContents(), true)['errors'];
        $this->assertEquals('/data/attributes/followUsers', $errors[0]['source']['pointer']);

        $this->assertEquals('lurk', $this->storedLevel(3));
    }

    #[Test]
    #[DataProvider('invalidLevels')]
    public function an_invalid_level_does_not_create_a_follow(string $level): void
    {
        $response = $this->setFollowLevel(4, $level);

        $this->assertEquals(422, $response->getStatusCode());
        $this->assertFalse($this->isFollowing(4));
    }

    public static function validLevels(): array
    {
        return [
            'follow' => ['follow'],
            'lurk'   => ['lurk'],
        ];
    }

    #[Test]
    #[DataProvider('validLevels')]
    public function a_valid_level_is_stored(string $level): void
    {
        $response = $this->setFollowLevel(4, $level);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals($level, $this->storedLevel(4));
    }

    public static function unfollowValues(): array
    {
        return [
            'null'       => [null],
            'unfollow'   => ['unfollow'],
            'empty'      => [''],
            'whitespace' => [" \t\n"],
        ];
    }

    #[Test]
    #[DataProvider('unfollowValues')]
    public function unfollow_values_remove_the_follow(?string $level): void
    {
        $response = $this->setFollowLevel(3, $level);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertFalse($this->isFollowing(3));
        $this->assertNull(json_decode($response->getBody()->getContents(), true)['data']['attributes']['followed']);
    }

    #[Test]
    #[DataProvider('unfollowValues')]
    public function unfollow_values_are_a_noop_when_not_following(?string $level): void
    {
        $response = $this->setFollowLevel(4, $level);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertFalse($this->isFollowing(4));
        $this->assertEquals(0, $this->database()->table('notifications')->where('user_id', 4)->count());
    }
}
