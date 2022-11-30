/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import { IA5String, OBJECT_IDENTIFIER } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';

/* START_OF_SYMBOL_DEFINITION METHOD */
/**
 * @summary METHOD
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * METHOD ::= CLASS {
 *   &InputAttributes   ATTRIBUTE OPTIONAL,
 *   &SpecificInput     OPTIONAL,
 *   &OutputAttributes  ATTRIBUTE OPTIONAL,
 *   &SpecificOutput    OPTIONAL,
 *   &description       IA5String OPTIONAL,
 *   &id                OBJECT IDENTIFIER UNIQUE
 * }
 * WITH SYNTAX {
 *   [INPUT ATTRIBUTES &InputAttributes]
 *   [SPECIFIC-INPUT &SpecificInput]
 *   [OUTPUT ATTRIBUTES &OutputAttributes]
 *   [SPECIFIC-OUTPUT &SpecificOutput]
 *   [BEHAVIOUR &description]
 *   ID &id
 * }
 * ```
 *
 * @interface
 */
export interface METHOD<
    SpecificInput = any /* OBJECT_CLASS_TYPE_FIELD_PARAMETER */,
    SpecificOutput = any /* OBJECT_CLASS_TYPE_FIELD_PARAMETER */
> {
    /**
     * @summary A fixed string that can be used for external programs to determine the object class of this object.
     */
    readonly class: 'METHOD';
    /**
     * @summary A map of type fields to their corresponding decoders.
     */
    readonly decoderFor: Partial<{
        // For decoding types supplied in type fields
        [_K in keyof METHOD<SpecificInput, SpecificOutput>]: $.ASN1Decoder<
            METHOD<SpecificInput, SpecificOutput>[_K]
        >;
    }>;
    /**
     * @summary A map of type fields to their corresponding encoders.
     */
    readonly encoderFor: Partial<{
        // For encoding types supplied in type fields
        [_K in keyof METHOD<SpecificInput, SpecificOutput>]: $.ASN1Encoder<
            METHOD<SpecificInput, SpecificOutput>[_K]
        >;
    }>;
    /**
     * @summary &InputAttributes
     */
    readonly '&InputAttributes'?: ATTRIBUTE[];
    /**
     * @summary &SpecificInput
     */
    readonly '&SpecificInput': SpecificInput;
    /**
     * @summary &OutputAttributes
     */
    readonly '&OutputAttributes'?: ATTRIBUTE[];
    /**
     * @summary &SpecificOutput
     */
    readonly '&SpecificOutput': SpecificOutput;
    /**
     * @summary &description
     */
    readonly '&description'?: IA5String;
    /**
     * @summary &id
     */
    readonly '&id'?: OBJECT_IDENTIFIER;
}
/* END_OF_SYMBOL_DEFINITION METHOD */

/* eslint-enable */
