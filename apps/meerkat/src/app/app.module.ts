import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HomeController } from "./controllers/home.controller";
import ctx from "./ctx";

@Module({
    controllers: [
        HomeController,
    ],
    imports: [
        ConfigModule,
        TerminusModule,
    ],
    providers: [
        {
            provide: "CONTEXT",
            useValue: ctx,
        },
    ],
})
export class AppModule {}
