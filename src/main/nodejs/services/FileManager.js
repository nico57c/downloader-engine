//@flow
'use strict';

const fs = require('fs');

class FileManager {

    stream: number;
    chunkSize: number;
    position: number;
    currentFile: number;
    currentLine: number;
    chunkBuffer: Buffer;
    path: string;
    EOF: boolean;

    constructor(path: string) {
        this.stream = null;
        this.chunkSize = 100;
        this.position = 0;
        this.chunkBuffer = Buffer.allocUnsafe(this.chunkSize);
        this.path = path;
        this.EOF = false;
        this.currentLine = 0;
    }

    openFile(): FileManager {
        this.stream = fs.openSync(this.path, 'r');
        return this;
    }

    readBuffer(): string|false {
        if(this.EOF === true) return false;

        let bytesRead = 0;
        bytesRead = fs.readSync(this.stream, this.chunkBuffer, 0, this.chunkSize, this.position);
        this.position += bytesRead;
        this.EOF = (bytesRead !== this.chunkSize);
        return this.chunkBuffer.slice(0, this.chunkSize).toString();
    }

    readNextLine(): string|false {
        if(this.EOF === true) return false;

        let buf = '';
        let res = '';
        let indexStop = 0;
        while((buf = this.readBuffer()) !== false) {
            if((indexStop = buf.indexOf("\n"))>=0) {
                this.position -= buf.length - indexStop - 1;
                this.currentLine++;
                return res + buf.substr(0, indexStop);
            }
        }

        this.currentLine++;
        return res;
    }
}

module.exports = FileManager;
