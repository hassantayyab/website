export interface User {
  username: string;
  email: string;
  password: string;
}

export interface SignedUser {
  displayName: any;
  email: any;
  emailVerified: any;
  photoURL: any;
  isAnonymous: any;
  uid: any;
  providerData: any;
}

export interface Folder {
  name: string;
  updated: Date;
}

export interface Item {
  content: Folder[];
}
