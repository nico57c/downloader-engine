// @flow
'use strict';

import type {AppConfig} from '../models/AppConfig';

const appConfig: AppConfig = {
    detectorConfig: {
        regexp: /(https:\/\/www\.example\.com\/[a-zA-Z0-9\_\-]*\.html)/gi,
    },
    linkDownloaderConfig: {
        maxSockets: 10,
        cookie: ''
    }
};

module.exports = appConfig;