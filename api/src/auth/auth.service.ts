import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
		//TODO return payload
		//
		//{"id":1,"username":"admin","email":"admin@bim-cloud.org","profile_image":"https://icapi.bim-cloud.org/static/profile_image/admin.jpg","roles":["ROLE_USER","ROLE_ADMIN"],"projects":["Assigned_Project:_InterACT","Assigned_Project:_Haus","Assigned_Project:_New
		//Project","Assigned_Project:_New Project","Assigned_Project:_New
		//Project"],"accessToken":""}
    return {
      username: user.username,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
