import IDMVersion from "./IDMVersion";

export
interface IDMSegment {
    version: IDMVersion;
    final: boolean;
    encoding: number;
    length: number;
    data: Buffer;
}

export default IDMSegment;
