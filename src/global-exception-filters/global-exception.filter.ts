import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    constructor(private configService: ConfigService){}

    catch(exception: any, host: ArgumentsHost) {  // here is for any exception, change to 'HttpException' to filter only http e
        //ArgumentsHost: the execution context for a NestJS request. It contains information about the current request and response objects, among other things.
    
        // console.log('exp from filter: ', exception)
        const ctx = host.switchToHttp(); //ctx = context
        // The switchToHttp() method is used to switch the context to the HTTP layer of the application. NestJS is a versatile framework that can handle various types of protocols, including HTTP, WebSockets, and more. By calling switchToHttp(), you are explicitly indicating that you want to work with the HTTP-related objects.
        const response = ctx.getResponse<Response>();
        const status = exception.status? exception.getStatus() : 500;
        
        const message = exception.response?.message? exception.response.message : exception.message;
        const error = exception.response?.error? exception.response.error : exception.error;


        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

        this.logger.error(`Exception: ${exception.message}, status: ${status}`);
        response.status(status).json(
            {
                statusCode: status,
                timestamp: new Date().toISOString(),
                message: {message: message, error: error},
            }
        );
        /*
        response.status(status).json(
            isProduction
                ? {
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    message: message,
                }
                : {
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    message: message,
                    stacktrace: exception.stack,
                }
        )
        */
    }
}