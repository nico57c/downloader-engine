// @flow
'use strict';

import type {Link} from "../models/Link";
import type {WriteStream} from "fs";
import type {LinkDownloaderConfig} from "../models/LinkDownloaderConfig";
import type {IncomingMessage} from 'http';

const http = require('http');
const https = require('https');
const fs = require('fs');

class LinkDownloader {

    config: LinkDownloaderConfig;

    constructor(config: LinkDownloaderConfig = {}) {
        this.config = {
            ...{
                maxSockets: 10,
                cookie: '',
               userAgent: 'Mozilla/5.0 (Windows NT 10.0, Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0',
                lang: 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3'
            }, config
        };
        console.log("load LinkDownloader with config :", this.config);
        http.globalAgent.maxSockets = this.config.maxSockets;
    }

    downloadAll(detectedLinks: Set<Link>): void {
        console.log("Number of detected links : " + detectedLinks.size);
        if(fs.existsSync('./downloadTarget/') === false) {
            fs.mkdirSync('./downloadTarget');
        }
        detectedLinks.forEach(value => this.downloadLinkContent(value));
    }

    downloadLinkContent(link: Link): void {
        console.log(" - " + link.name + " in progress");
        const options = this.getOptions(link);
        if(options.path.indexOf('https')>=0) {
            https.get(options, this.readLinkContent(link))
                .on('error', this.catchHttpError(link));
        } else {
            http.get(options, this.readLinkContent(link))
                .on('error', this.catchHttpError(link));
        }
    }

    readLinkContent(link: Link): (response: IncomingMessage) => void {
        return function(response: IncomingMessage) {
            link.exists = true;
            const file: WriteStream = fs.createWriteStream('./target/' + link.name);
            response.pipe(file);
            file.on('finish', function() {})
            file.close(function() {
                console.log("Done : " + './target/' + link.name);
            })
        }
    }

    catchHttpError(link: Link): (error: any) => void {
        return function(error) {
            console.error("Connection error \n", link, "\n", error);
            process.exit();
        }
    }

    getOptions(link: Link) {
        return {
            hostname: this.config.hostname===undefined?link.hostname():this.config.hostname,
            path: link.toHttp().href,
            headers: {
                'User-Agent': this.config.userAgent,
                'Accept-Language': this.config.lang,
                'Cookie': this.config.cookie
            }
        }
    }
}

module.exports = LinkDownloader;
