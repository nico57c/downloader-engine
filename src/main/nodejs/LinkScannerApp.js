//@flow
'use strict';

import type {AppConfig} from "./models/AppConfig";

const ConfigLoader = require("./services/ConfigLoader");
const http = require('http');
const FileManager = require('./services/FileManager');
const LinkExtractor = require('./services/LinkExtractor');
const LinkDownloader = require('./services/LinkDownloader');

class LinkScannerApp {

    static main(argv: Array<string>) {
        if(argv.length>=4 && argv[2] && argv[2].length>0 && argv[3] && argv[3].length>0) {

            if(!ConfigLoader.configExists(argv[2])){
                console.log("ConfigLoader error : [[ " + argv[2] + " ]] has not been found");
                return  process.exit(1);
            }

            const config: AppConfig = ConfigLoader.load(argv[2]);
            const fileManager: FileManager = new FileManager(argv[3]).openFile();
            const linkExtractor: LinkExtractor = new LinkExtractor(config.detectorConfig, fileManager);
            linkExtractor.extractAllLinks();

            const linkDownloader: LinkDownloader = new LinkDownloader(config.linkDownloaderConfig);
            if(linkExtractor.hasDuplicateLinks()) {
                console.info("<<< DUPLICATE LINKS DETECTED >>>");
                const duplicateLinks = linkExtractor.getDuplicateLinks();
                console.info("Number of duplicate links :" + duplicateLinks.size);
                duplicateLinks.forEach(console.debug);
                console.debug("<<< // >>>");
            }
            linkDownloader.downloadAll(linkExtractor.getNonDuplicateLinks());
        } else {
            LinkScannerApp.help();
            return process.exit(1);
        }
    }

    static help() {
        console.log("Usage: LinkScannerApp [CONFIG_NAME] [INDEX_FILE] [[--verbose]]\n\n" +
            " CONFIG_NAME\t\tConfig files are saved with 'app.[CONFIG_NAME].config.js' is required for scan initializer\n" +
            " INDEX_FILE\t\tPath to the file with list of all links\n" +
            " --verbose\t\tPrint debug information \n\n" +
            "Examples:\n" +
            "  node ./LinkScannerApp.js indexLinksFile ../tmpDir\n");
    }
}

if(process.argv && process.argv.length>2 && (process.argv[2] == 'help' || process.argv[2] == "--help")) {
    LinkScannerApp.help();
} else if(process.argv && process.argv.length>2) {
    LinkScannerApp.main(process.argv);
} else {
    console.error("LinkScannerApp invalid options : config name and index file not found.\nTry with help or --help");
}
