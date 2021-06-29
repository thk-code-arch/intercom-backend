// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { ArgumentsHost, ExceptionFilter, Catch } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    response.status(404).send({ message: exception.message });
  }
}

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    switch (exception.code) {
      // Unique Constraint Violation
      case '23505':
        response.status(409).send({
          message: 'Duplicate key violation',
          error: exception.message,
        });
        break;

      default:
        throw exception;
    }
  }
}
