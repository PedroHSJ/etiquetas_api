import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from "nestjs-i18n";
@Module({
  imports: [
    ConfigModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage:
          configService.get("I18N_FALLBACK_LANGUAGE") || "pt-br",
        fallbacks: {
          "es-*": "es",
          "en-*": "en",
          "pt-*": "pt-br",
        },
        loaderOptions: {
          path: join(__dirname, "../../i18n/"),
          watch: true,
        },
      }),
      resolvers: [AcceptLanguageResolver],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [],
})
export class LanguageModule {}
