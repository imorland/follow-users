declare module 'flarum/common/models/User' {
  export default interface User {
    followed(): boolean;
    blocksFollow(): boolean;
    canBeFollowed(): boolean;
    followingCount(): number;
    followerCount(): number;
  }
}
