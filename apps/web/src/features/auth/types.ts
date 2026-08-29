export interface DevLoginUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface DevLoginResponse {
  accessToken: string;
  user: DevLoginUser;
}
