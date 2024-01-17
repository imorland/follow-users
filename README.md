# Follow Users

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/ianm/follow-users.svg)](https://packagist.org/packages/ianm/follow-users)

![Extiverse](https://extiverse.com/extension/ianm/follow-users/open-graph-image)

A [Flarum](http://flarum.org) extension. Follow users and be notified of new discussions

Building on top of `fof/follow-tags`, this extension allows for following of individual users.

### Features
- Adds a 'Followed User' badge to users that _you_ follow, forum wide
- Adds A 'Followed Users' filter to the following filter
- Permission for which groups can be followed
- User preference to block followers
- Notifications for 'Followed', 'Unfollowed', 'Followed User Started Discussion' and 'Followed User Posted'
- Integration with `fof/user-directory`
- Provides a search gambit `is:followeduser`
- [Developers] events dispatched for `Following` and `Unfollowing`

##### Discussion list
![image](https://user-images.githubusercontent.com/16573496/102770472-2161df00-437c-11eb-8274-6f73d58b1042.png)

##### Following dropdown
![image](https://user-images.githubusercontent.com/16573496/102770549-40f90780-437c-11eb-801e-a7fb9e08e704.png)

##### User profile page following view
![image](https://user-images.githubusercontent.com/16573496/184591121-c11ec7ea-91fc-4836-9ded-4b33bc230fca.png)

##### User card integration
![image](https://user-images.githubusercontent.com/16573496/184591272-4295dbc3-5a79-4213-9d06-d7de8f444ab5.png)

##### `fof/user-directory` integration
![image](https://user-images.githubusercontent.com/16573496/184591023-effd4e19-8719-48b8-8be1-11a1c38e5c74.png)

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

## Support

Please consider supporting my extension development and maintenance work.

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/default-orange.png)](https://www.buymeacoffee.com/ianm1)
