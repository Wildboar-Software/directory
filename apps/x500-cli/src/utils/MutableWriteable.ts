import { Writable } from "node:stream";

export
class MutableWriteable extends Writable {
    public muted: boolean = false;
    constructor () {
        super({
            write: (data: string, encoding, callback: (...args: any[]) => any) => {
                if (!this.muted) {
                    process.stdout.write(data, encoding);
                }
                callback();
            },
        });
    }
}

export default MutableWriteable;
