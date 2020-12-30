import { IsNumber, IsString } from 'class-validator';

export class SocketUserDto {
  id: number;
  username: string;
  profile_image: string;
  roles: [];
  projects: [];
  chatrooms: [];
}

export class MessageDto {
  @IsString()
  message: string;
  user: SocketUserDto;
}

export class SwitchRoomDto {
  @IsNumber()
  oldRoom: number;
  @IsNumber()
  newRoom: number;
}
