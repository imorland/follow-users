import app from 'flarum/common/app';
import { utils } from 'ext:fof/follow-tags/forum/utils';

// We need to add options to the list of options available on the following page
// As `utils.followingPageOptions` is a function, we cannot really
// extend or override it with the Flarum helpers.
// As the result of this function is cached after its first execution,
// we can use the below version and execute this one to cache the desired options.

// Save the reference to the original function, as it will be overriden
const original = utils.followingPageOptions;

// Customized version of the helper with addition options for followed users
export default (section: string): Record<string, string> => {
  // Get the original options
  const options = original(section);

  options.users = app.translator.trans('ianm-follow-users.lib.following_link');

  // Return the mutated options list
  return options;
};
