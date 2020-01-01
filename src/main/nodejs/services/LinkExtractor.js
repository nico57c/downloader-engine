// @flow
'use strict';

import type LinkType from "../models/Link";
import type {DetectorConfig} from "../models/DetectorConfig";
import type FileManager from "./FileManager";

const Link = require('../models/Link');

class LinkExtractor {

    config: DetectorConfig;
    fileManager: FileManager;
    detectedLinks: Array<Link>;

    constructor(detectorConfig: DetectorConfig, fileManager: FileManager) {
        this.config = detectorConfig;
        this.fileManager = fileManager;
        this.detectedLinks = [];
    }

    extractAllLinks(): number {
        let data = '';
        while((data = this.fileManager.readNextLine()) !== false) {
            console.debug("Line : " + this.fileManager.currentLine);
            this.extractLineLinks(data);
        }
    }

    extractLineLinks(line: string): number {
        let detections;
        let linksAdded = 0;
        let match = undefined;
        if( (detections = line.matchAll(this.config.regexp)) ) {
            while((match = detections.next()) && !match.done) {
                const detectedLink = match.value[1];
                this.detectedLinks.push(new Link({
                    href: detectedLink.trim().replace("\r", "").replace("\n", "").replace("\t", "").replace("\"", ""),
                    name: detectedLink.substr(detectedLink.lastIndexOf('/')+1, detectedLink.length-2).replace("\"", ""),
                    exists: false,
                    content: detectedLink
                }));
                linksAdded++;
                console.log("Link #" + this.detectedLinks.length,
                    ' detected : ' + this.detectedLinks[this.detectedLinks.length-1].name +
                    ' - ' + this.detectedLinks[this.detectedLinks.length-1].href );
            }
        }
    }

    hasDuplicateLinks(): boolean {
        let set = new Set<LinkType>(this.detectedLinks);
        return this.detectedLinks.length > 0 && set.size !== this.detectedLinks.length;
    }

    getDuplicateLinks(): Set<LinkType> {
        if(!this.hasDuplicateLinks()) return new Set<LinkTypes>();

        let res: Set<LinkType> = new Set<LinkType>();
        this.detectedLinks.forEach((item, index) => {
            if(this.detectedLinks.indexOf(item) !== index) {
                res.add(item);
            }
        });
        return res;
    }

    getNonDuplicateLinks(): Set<LinkType> {
        return new Set<LinkType>(this.detectedLinks);
    }
}

module.exports = LinkExtractor;