import ajv from "ajv";
import { schema } from "@wildboar/x500-cli-config";

const ajvInstance: ajv.Ajv = ajv({
    useDefaults: true,
});
ajvInstance.addKeyword("unicodePattern", {
    validate: (schema: any, data: any): boolean => (
        (typeof schema === "string" && typeof data === "string")
            ? (new RegExp(schema, "u")).test(data) : false
    ),
    async: true,
    errors: false,
});

export default ajvInstance.compile(schema);
