//@flow
'use strict';

import type {LinkDownloaderConfig} from './LinkDownloaderConfig';
import type {DetectorConfig} from './DetectorConfig';

export type AppConfig = {
    linkDownloaderConfig: LinkDownloaderConfig,
    detectorConfig: DetectorConfig
}
