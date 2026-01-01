import app from 'flarum/common/app';
import followingPageOptionsOriginal from 'ext:fof/follow-tags/common/utils/followingPageOptions';

type FollowingPageOptions = {
  [key: string]: string | any[];
};

// We need to add options to the list of options available on the following page
// As `followingPageOptions` is a function, we cannot really
// extend or override it with the Flarum helpers.
// As the result of this function is cached after its first execution,
// we can use the below version and execute this one to cache the desired options.

// Customized version of the helper with additional options for followed users
export default function followingPageOptions(section: string): FollowingPageOptions {
  // Get the original options
  const options = followingPageOptionsOriginal(section);

  options.users = app.translator.trans('ianm-follow-users.lib.following_link');

  // Return the mutated options list
  return options;
}
