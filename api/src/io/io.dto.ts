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

  @IsNumber()
  chatroomId: number;

  user: SocketUserDto;
}

export class activeAvatar {
  chatroomId: number;
  userId: number;
  username: string;
  profile_image: string;
}

export class moveTo {
  position: {
    x: number;
    y: number;
    z: number;
    dir: {
      x: number;
      y: number;
      z: number;
    };
  };
  @IsNumber()
  chatroomId: number;
  user: SocketUserDto;
}

export class getPlayers {
  position: {
    x: number;
    y: number;
    z: number;
    dir: {
      x: number;
      y: number;
      z: number;
    };
  };
  chatroomId: number;
  userId: number;
  username: string;
  profile_image: string;
}

export class SwitchRoomDto {
  @IsNumber()
  oldRoom: number;
  @IsNumber()
  newRoom: number;
}
