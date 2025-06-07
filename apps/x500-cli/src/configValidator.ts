import * as ajv from "ajv";
import { schema } from "@wildboar/x500-cli-config";

const ajvInstance: ajv.Ajv = new ajv.Ajv({
    useDefaults: true,
});
ajvInstance.addKeyword({
    validate: (schema: any, data: any): boolean => (
        (typeof schema === "string" && typeof data === "string")
            ? (new RegExp(schema, "u")).test(data) : false
    ),
    async: true,
    errors: false,
    keyword: "unicodePattern",
});

export default ajvInstance.compile(schema);
