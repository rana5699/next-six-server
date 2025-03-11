export const user_role = {
  customer: 'customer',
  admin: 'admin',
} as const;

export type TUserRole = keyof typeof user_role;

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImg: string;
  role: 'admin' | 'customer';
}
