import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import app from 'flarum/forum/app';
import extend from '../../../src/common/extend';

beforeAll(() => {
  bootstrapForum();
  app.bootExtensions({ 'ianm-follow-users': { extend } });
  app.boot();
  app.translator.addTranslations({
    'core.lib.gambits.group_keys.is': 'статус',
    'ianm-follow-users.lib.gambits.followeduser.key': 'подписан',
  });
});

it('turns the translated gambit into the followeduser filter', () => {
  expect(app.search.gambits.apply('users', { q: 'статус:подписан' })).toStrictEqual({ q: '', followeduser: true });
});

// The user directory's "following" button sends the English form whatever the locale.
it('still turns the English is:followeduser into the followeduser filter on a translated forum', () => {
  expect(app.search.gambits.apply('users', { q: 'is:followeduser' })).toStrictEqual({ q: '', followeduser: true });
});

it('still turns the negated English -is:followeduser into the negated filter on a translated forum', () => {
  expect(app.search.gambits.apply('users', { q: '-is:followeduser' })).toStrictEqual({ q: '', '-followeduser': true });
});
