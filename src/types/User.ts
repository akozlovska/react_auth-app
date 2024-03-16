export interface User {
  id: string,
  username: string,
  email: string,
  authType: 'local' | 'google' | 'github',
  google?: {
    id: string,
    name: string,
  },
  github?: {
    id: string,
    name: string,
  },
}
