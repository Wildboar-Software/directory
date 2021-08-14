import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";

export
function print (code: Code): string {
    if ("local" in code) {
        return code.local.toString();
    } else if ("global" in code) {
        return code.global.toString();
    } else {
        return code.toString();
    }
}

export default print;
