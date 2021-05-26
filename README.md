# Follow Users

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/ianm/follow-users.svg)](https://packagist.org/packages/ianm/follow-users) [![Total Downloads](https://img.shields.io/packagist/dt/ianm/follow-users.svg)](https://packagist.org/packages/ianm/follow-users)

A [Flarum](http://flarum.org) extension. Follow users and be notified of new discussions

Building on top of `fof/follow-tags`, this extension allows for following of individual users.

### Features
- Requires Flarum beta 15 or above
- Adds a 'Followed User' badge to users that _you_ follow, forum wide
- Adds A 'Followed Users' filter to the following filter
- Permission for which groups can be followed
- User preference to block followers
- Notifications for 'Followed', 'Unfollowed', 'Followed User Started Discussion' and 'Followed User Posted'
- [Developers] events dispatched for `Following` and `Unfollowing`

##### Discussion list
![image](https://user-images.githubusercontent.com/16573496/102770472-2161df00-437c-11eb-8274-6f73d58b1042.png)

##### Following dropdown
![image](https://user-images.githubusercontent.com/16573496/102770549-40f90780-437c-11eb-801e-a7fb9e08e704.png)

##### Notification preferences
![image](https://user-images.githubusercontent.com/16573496/102770611-55d59b00-437c-11eb-8d57-408770c34d69.png)

##### Privacy setting
![image](https://user-images.githubusercontent.com/16573496/102770745-8e757480-437c-11eb-903b-4a999bdb5228.png)

### Installation

Install with composer:

```sh
composer require ianm/follow-users:"*"
```

`fof/follow-tags` *must* be enabled *before* this extension is enabled.

### Updating

```sh
composer update ianm/follow-users
```
