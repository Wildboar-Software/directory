import type { Context } from "../../types";
import type {
    ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import type {
    ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    ReadResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResultData.ta";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    NameError,
    objectDoesNotExistErrorData,
} from "../errors";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import findEntry from "../../x500/findEntry";
import readEntry from "../../database/readEntry";

// read OPERATION ::= {
//   ARGUMENT  ReadArgument
//   RESULT    ReadResult
//   ERRORS    {attributeError |
//              nameError |
//              serviceError |
//              referral |
//              abandoned |
//              securityError}
//   CODE      id-opcode-read }

// ReadArgument ::= OPTIONALLY-PROTECTED { ReadArgumentData }

// ReadArgumentData ::= SET {
//   object               [0]  Name,
//   selection            [1]  EntryInformationSelection DEFAULT {},
//   modifyRightsRequest  [2]  BOOLEAN DEFAULT FALSE,
//   ...,
//   ...,
//   COMPONENTS OF             CommonArguments }

// ReadResult ::= OPTIONALLY-PROTECTED { ReadResultData }

// ReadResultData ::= SET {
//   entry         [0]  EntryInformation,
//   modifyRights  [1]  ModifyRights OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF      CommonResults }

// ModifyRights ::= SET OF SEQUENCE {
//   item      CHOICE {
//     entry      [0]  NULL,
//     attribute  [1]  AttributeType,
//     value      [2]  AttributeValueAssertion,
//     ...},
//   permission   [3]  BIT STRING {
//     add     (0),
//     remove  (1),
//     rename  (2),
//     move    (3)},
//   ... }

export
async function read (
    ctx: Context,
    arg: ReadArgument,
): Promise<ReadResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    const entry = findEntry(ctx, ctx.database.data.dit, data.object.rdnSequence);
    if (!entry) {
        throw new NameError(
            "No such object.",
            objectDoesNotExistErrorData(ctx, data.object),
        );
    }

    const attributesByType: Map<string, Attribute> = new Map();
    const values = await readEntry(ctx, entry);
    values.forEach((v) => {
        const TYPE_OID: string = v.id.toString();
        const attr = attributesByType.get(TYPE_OID);
        if (!attr) {
            if (v.contexts.size > 0) {
                const contexts: X500Context[] = Array.from(v.contexts.values()).map((c) => {
                    return new X500Context(
                        c.id,
                        c.values,
                        c.fallback,
                    );
                });
                attributesByType.set(TYPE_OID, new Attribute(
                    v.id,
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            v.value,
                            contexts,
                        ),
                    ],
                ));
            } else {
                attributesByType.set(TYPE_OID, new Attribute(
                    v.id,
                    [ v.value ],
                    undefined,
                ));
            }
        } else {
            if (v.contexts.size > 0) {
                const contexts: X500Context[] = Array.from(v.contexts.values()).map((c) => {
                    return new X500Context(
                        c.id,
                        c.values,
                        c.fallback,
                    );
                });
                const vwcItem = new Attribute_valuesWithContext_Item(
                    v.value,
                    contexts,
                );
                if (!attr.valuesWithContext) {
                    attributesByType.set(TYPE_OID, new Attribute(
                        attr.type_,
                        attr.values,
                        [ vwcItem ],
                    ));
                } else {
                    attr.valuesWithContext.push(vwcItem);
                }
            } else {
                attr.values.push(v.value);
            }
        }
    });

    // TODO: entry information selection.

    return {
        unsigned: new ReadResultData(
            new EntryInformation(
                data.object,
                !entry.dseType.shadow,
                Array.from(attributesByType.values()).map((attribute) => ({
                    attribute,
                })),
                false, // TODO: This will have to change when access control, shadowing, or attribute size limits are implemented.
                false, // TODO: Change this when partial name resolution is implemented.
                false,
                [],
            ),
            undefined, // TODO: Return information when access control is implemented.
            [],
            undefined,
            undefined,
            undefined,
            undefined,
        ),
    };
}

export default read;
