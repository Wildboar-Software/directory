import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { DitController } from "./admin/dit.controller";
import { HomeController } from "./admin/home.controller";
import { SystemController } from "./admin/system.controller";
import ctx from "./ctx";
import { CONTEXT } from "./constants";

/**
 * @summary The root NestJS module for starting the web admin console
 * @description
 *
 * This is the module that gets "bootstrapped" to start up the NestJS web admin
 * console.
 *
 * @class
 */
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
            provide: CONTEXT,
            useValue: ctx,
        },
    ],
})
export class AppModule {}
