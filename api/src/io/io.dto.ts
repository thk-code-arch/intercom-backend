// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { IsNumber, IsString } from 'class-validator';

export class SocketUserDto {
  id: number;
  username: string;
  profile_image: string;
  roles: [];
  projects: [];
  chatrooms: [];
}
export class lastSendInRoom {
  [key: number]: Date; //theChatroomId
}
export class Avatar {
  //userId
  [key: number]: {
    userId: number;
    username: string;
    profile_image: string;
    position: AvatarPosition;
  };
}
export class AvatarPosition {
  x: number;
  y: number;
  z: number;
  dir: {
    x: number;
    y: number;
    z: number;
  };
}
export class OnlineUsers {
  [key: number]: Avatar; //theChatroomId
}

export class MessageDto {
  @IsString()
  message: string;

  @IsNumber()
  chatroomId: number;

  user: SocketUserDto;
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

export class SwitchRoomDto {
  @IsNumber()
  oldRoom: number;
  @IsNumber()
  newRoom: number;
  user: SocketUserDto;
}

export class LeaveViewport {
  @IsNumber()
  projectId: number;
  user: SocketUserDto;
}

export class viewSubprojectsLoaded {
  @IsNumber()
  projectId: number;

  user: SocketUserDto;

  @IsNumber()
  loadedModels: number;
}
