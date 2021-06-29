// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const imageExtensionFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const attachmentFilter = (req, file, callback) => {
  if (file.originalname.match(/\.(exe|bat|pif)$/i)) {
    return callback(
      new HttpException(
        'Executable files arent allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  console.log(req.user);
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');
  callback(null, `${name}${randomName}${fileExtName}`);
};

export const profileImage = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  callback(
    null,
    `${req.user.username}_${Math.floor(Date.now() / 1000)}${fileExtName}`,
  );
};
