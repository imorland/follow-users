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

namespace IanM\FollowUsers\Api;

use Flarum\Api\Controller\AbstractSerializeController;
use Flarum\Http\RequestUtil;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;

class LoadRelations
{
    public function __invoke(AbstractSerializeController $controller, User $data, ServerRequestInterface $request): User
    {
        RequestUtil::getActor($request)
            ->load('followedUsers');

        $data->load('followedUsers');

        return $data;
    }
}
