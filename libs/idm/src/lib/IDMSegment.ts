import IDMVersion from "./IDMVersion";

/**
 * @summary An IDM segment
 * @description
 *
 * An Internet Directly-Mapped (IDM) protocol segment
 *
 * @interface
 */
export
interface IDMSegment {

    /** The IDM version of this segment */
    version: IDMVersion;

    /**
     * Whether this segment is the final one that finishes the transport of an
     * IDM PDU.
     */
    final: boolean;

    /**
     * The IDM presentation encoding, according to the 16-bit field.
     */
    encoding: number;

    /** The length in bytes of the data field */
    length: number;

    /** The encoded data within the IDM segment */
    data: Buffer;

}

export default IDMSegment;
