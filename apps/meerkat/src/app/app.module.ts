import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { DitController } from "./controllers/dit.controller";
import { HomeController } from "./controllers/home.controller";
import { SystemController } from "./controllers/system.controller";
import ctx from "./ctx";

@Module({
    controllers: [
        DitController,
        HomeController,
        SystemController,
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
