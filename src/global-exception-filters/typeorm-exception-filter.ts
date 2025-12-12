import { Catch, ExceptionFilter, ArgumentsHost} from "@nestjs/common";
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { CannotCreateEntityIdMapError } from 'typeorm/error/CannotCreateEntityIdMapError';

/**
 * Custom exception filter to convert EntityNotFoundError from TypeOrm to NestJs responses
 * @see also @https://docs.nestjs.com/exception-filters
 */
@Catch(EntityNotFoundError, QueryFailedError, CannotCreateEntityIdMapError )
export class TypeOrmExceptionFilter implements ExceptionFilter {
    catch(exception: EntityNotFoundError | QueryFailedError | CannotCreateEntityIdMapError, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        return response.status(500).json({ message: { statusCode: 500, error: 'Typeorm error', message: exception.message } });
    }
}