import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { I18nService } from "nestjs-i18n";
import { EntityNotFoundError } from "typeorm";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly i18n: I18nService) {}

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    // Log da stack trace
    this.logger.error(exception.stack);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: exception.name,
      });
      return;
    }
    if (exception instanceof EntityNotFoundError) {
      // Tratamento específico para EntityNotFoundError
      response.status(404).json({
        statusCode: 404,
        message: this.i18n.t("events.commons.notFound"), // Mensagem traduzida
        error: "EntityNotFoundError",
      });
      return;
    }

    this.logger.error(exception);
    response.status(500).json({
      statusCode: 500,
      message: this.i18n.t("events.commons.error"),
    });
  }
}
