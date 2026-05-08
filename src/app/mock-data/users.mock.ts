export type UserRole = 'super_admin' | 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'superadmin@fastpass.com',
    password: 'password123',
    name: 'Super Admin FastPass',
    role: 'super_admin'
  },
  {
    id: '2',
    email: 'admin@fastpass.com',
    password: 'password123',
    name: 'Admin FastPass',
    role: 'admin'
  },
  {
    id: '3',
    email: 'user@fastpass.com',
    password: 'password123',
    name: 'User FastPass',
    role: 'user'
  }
];
