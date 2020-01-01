// @flow
'use strict';

import type {DetectorConfig} from "./DetectorConfig";

class Link {
    href: string;
    name: string;
    exists: boolean;
    content: string;

    toHttp(): Link {
        return {...this, href: this.href.replace('https', 'http')};
    }

    hostname(): string|undefined {
        const httpHost: Array<string> = this.href.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img);
        if(httpHost!==undefined && httpHost.length > 0) {
            return httpHost[0].replace('https://', '').replace('http://', '');
        } else {
            return undefined;
        }
    }

    type(): string|undefined {
        const extension: Array<string> = this.href.match(/(\.[a-zA-Z0-9\-]*)/ig);
        return extension.length>0?extension.slice(-1):undefined;
    }

    constructor(link: Link) {
        this.href = '' + link.href;
        this.name = '' + link.name;
        this.exists = link.exists?true:false;
        this.content = '' + link.content;
    }
}

module.exports = Link;