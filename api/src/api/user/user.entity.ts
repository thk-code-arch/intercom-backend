import { Column, Entity, PrimaryGeneratedColumn , BeforeInsert} from 'typeorm';
import * as bcrypt from 'bcrypt';
var gravatar = require('gravatar');

export class UserRO {
    id: number;
    email: string;
    username: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 320 ,unique: true})
  username: string;

  @Column("varchar", { length: 320 ,unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  profile_image: string;

  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  async initUser() {
    this.password = await bcrypt.hash(this.password, 10);
    this.profile_image = await gravatar.url(this.email, {s: '100', r: 'x', d: 'retro'}, true);
  }

  async log(){
  console.log("usermodule",this);
  }
  async addProfileImage() {
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, username, email } = this;
    const responseObject: UserRO = {
      id,
      username,
      email,
    };

    return responseObject;
  }
}
