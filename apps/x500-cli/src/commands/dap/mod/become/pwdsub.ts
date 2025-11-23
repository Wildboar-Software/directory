import type { Connection, Context } from "../../../../types";
import { ObjectIdentifier } from "@wildboar/asn1";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeBoolean,
    _encodeInteger,
    _encodeUTF8String,
} from "@wildboar/asn1/functional";
import {
    modifyEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    EntryModification,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    objectClass,
} from "@wildboar/x500/InformationFramework";
import printCode from "../../../../printers/Code";
import destringifyDN from "../../../../utils/destringifyDN";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/InformationFramework";
import type {
    PwdSubArgs,
} from "../../../../yargs/dap_mod_become_pwdsub";
import {
    pwdModifyEntryAllowed,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdChangeAllowed,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdMaxAge,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdExpiryAge,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdMinLength,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdAlphabet,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdDictionaries,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdExpiryWarning,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdGraces,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdFailureDuration,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdLockoutDuration,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdMaxFailures,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdMaxTimeInHistory,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdMinTimeInHistory,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdHistorySlots,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdRecentlyExpiredDuration,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdEncAlg,
} from "@wildboar/x500/PasswordPolicy";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";

export
async function do_modify_become_pwdsub (
    ctx: Context,
    conn: Connection,
    argv: PwdSubArgs,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object!);
    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                objectClass["&id"],
                [
                    _encodeObjectIdentifier(pwdAdminSubentry["&id"], DER)
                ],
                undefined,
            ),
        },
    ];
    if (argv.pwdModifyEntryAllowed !== undefined) {
        modifications.push({
            addAttribute: new Attribute(
                pwdModifyEntryAllowed["&id"],
                [
                    _encodeBoolean(argv.pwdModifyEntryAllowed, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdChangeAllowed !== undefined) {
        modifications.push({
            addAttribute: new Attribute(
                pwdChangeAllowed["&id"],
                [
                    _encodeBoolean(argv.pwdChangeAllowed, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdMaxAge) {
        modifications.push({
            addAttribute: new Attribute(
                pwdMaxAge["&id"],
                [
                    _encodeInteger(argv.pwdMaxAge, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdExpiryAge) {
        modifications.push({
            addAttribute: new Attribute(
                pwdExpiryAge["&id"],
                [
                    _encodeInteger(argv.pwdExpiryAge, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdMinLength !== undefined) {
        modifications.push({
            addAttribute: new Attribute(
                pwdMinLength["&id"],
                [
                    _encodeInteger(argv.pwdMinLength, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdAlphabet) {
        modifications.push({
            addAttribute: new Attribute(
                pwdAlphabet["&id"],
                [
                    _encodeUTF8String(argv.pwdAlphabet, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdDictionaries?.length) {
        modifications.push({
            addAttribute: new Attribute(
                pwdDictionaries["&id"],
                argv.pwdDictionaries.map((d) => _encodeUTF8String(d, DER)),
                undefined,
            ),
        });
    }
    if (argv.pwdExpiryWarning) {
        modifications.push({
            addAttribute: new Attribute(
                pwdExpiryWarning["&id"],
                [
                    _encodeInteger(argv.pwdExpiryWarning, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdGraces !== undefined) {
        modifications.push({
            addAttribute: new Attribute(
                pwdGraces["&id"],
                [
                    _encodeInteger(argv.pwdGraces, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdFailureDuration !== undefined) {
        modifications.push({
            addAttribute: new Attribute(
                pwdFailureDuration["&id"],
                [
                    _encodeInteger(argv.pwdFailureDuration, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdLockoutDuration !== undefined) {
        modifications.push({
            addAttribute: new Attribute(
                pwdLockoutDuration["&id"],
                [
                    _encodeInteger(argv.pwdLockoutDuration, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdMaxFailures) {
        modifications.push({
            addAttribute: new Attribute(
                pwdMaxFailures["&id"],
                [
                    _encodeInteger(argv.pwdMaxFailures, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdMaxTimeInHistory) {
        modifications.push({
            addAttribute: new Attribute(
                pwdMaxTimeInHistory["&id"],
                [
                    _encodeInteger(argv.pwdMaxTimeInHistory, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdMinTimeInHistory !== undefined) {
        modifications.push({
            addAttribute: new Attribute(
                pwdMinTimeInHistory["&id"],
                [
                    _encodeInteger(argv.pwdMinTimeInHistory, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdHistorySlots) {
        modifications.push({
            addAttribute: new Attribute(
                pwdHistorySlots["&id"],
                [
                    _encodeInteger(argv.pwdHistorySlots, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdRecentlyExpiredDuration) {
        modifications.push({
            addAttribute: new Attribute(
                pwdRecentlyExpiredDuration["&id"],
                [
                    _encodeInteger(argv.pwdRecentlyExpiredDuration, DER),
                ],
                undefined,
            ),
        });
    }
    if (argv.pwdEncAlg) {
        modifications.push({
            addAttribute: new Attribute(
                pwdEncAlg["&id"],
                [
                    pwdEncAlg.encoderFor["&Type"]!(new AlgorithmIdentifier(
                        ObjectIdentifier.fromString(argv.pwdEncAlg),
                        undefined,
                    ), DER)
                ],
                undefined,
            ),
        });
    }
    const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
        {
            rdnSequence: objectName,
        },
        modifications,
        undefined,
        [],
    );
    const arg: ModifyEntryArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: modifyEntry["&operationCode"]!,
        argument: _encode_ModifyEntryArgument(arg, DER),
    });
    if ("error" in outcome) {
        if (outcome.errcode) {
            ctx.log.error(printCode(outcome.errcode));
        } else {
            ctx.log.error("Uncoded error.");
        }
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    ctx.log.info("Done.");
}

export default do_modify_become_pwdsub;
