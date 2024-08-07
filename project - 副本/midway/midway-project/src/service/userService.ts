import { Provide } from '@midwayjs/decorator';
import * as jwt from 'jsonwebtoken';

export interface User {
  username: string;
  password: string;
}

@Provide()
export class UserService {
  private users: User[] = [
    { username: 'user1', password: '123456' },
    { username: 'user2', password: '123456' },
    { username: 'user3', password: '123456' },
    { username: 'user4', password: '123456' },
    { username: 'user5', password: '123456' },
  ];

  private jwtSecret = 'your-secret-key';

  async login(username: string, password: string) {
    const user = this.users.find(user => user.username === username && user.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ username: user.username }, this.jwtSecret, { expiresIn: '1d' });
    return { username: user.username, token };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (e) {
      return null;
    }
  }
}
