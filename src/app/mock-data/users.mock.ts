export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: string;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@fastpass.com',
    password: 'password123',
    name: 'Admin FastPass',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@fastpass.com',
    password: 'password123',
    name: 'User FastPass',
    role: 'user'
  }
];
