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

namespace IanM\FollowUsers\Middleware;

use IanM\FollowUsers\FollowState;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Discards FollowState's memoised data at the start of every request.
 *
 * The caches exist to collapse per-user queries within a single serialized
 * document, so their useful life is exactly one request. Under php-fpm or the
 * CLI that happens for free — the process ends with the request. Under a
 * persistent runtime (Swoole, FrankenPHP worker mode, Octane) the process is
 * reused, and without this the second request served by a worker would read
 * follow state and counts captured during the first, returning data that may
 * since have changed.
 *
 * Flushing on the way in rather than on the way out means a request always
 * starts clean, even if an earlier one aborted before it could tidy up.
 */
class FlushFollowStateCache implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        FollowState::flushCache();

        return $handler->handle($request);
    }
}
