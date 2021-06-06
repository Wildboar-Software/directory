import IDMVersion from "./IDMVersion";

export default
interface IDMSegment {
    version: IDMVersion;
    final: boolean;
    encoding: number;
    length: number;
    data: Buffer;
}
