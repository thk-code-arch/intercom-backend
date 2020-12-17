import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class LoginService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: "demo",
        password: "123456"
      }
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
