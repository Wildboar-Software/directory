import { EventEmitter } from "node:events";

/**
 * Runtime stand-in for tiny-typed-emitter. That package's JavaScript is
 * `exports.TypedEmitter = require("events").EventEmitter`, which esbuild
 * cannot express as a static import in an ESM bundle.
 */
export const TypedEmitter = EventEmitter;
