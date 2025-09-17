/**
 * BULLETPROOF-9x3 Universal Export System
 * Seamless data transfer between GML ecosystem apps
 */

class UniversalExportSystem {
    constructor() {
        this.appRegistry = {
            'RiffGen': {
                path: 'gml-riffgen',
                port: 3001,
                exports: ['riffs', 'patterns', 'motifs']
            },
            'TriadGen': {
                path: 'triadgen',
                port: 3002,
                exports: ['triads', 'progressions']
            },
            'QuartetEngine': {
                path: 'quartet-engine',
                port: 3003,
                exports: ['scores', 'parts', 'arrangements']
            },
            'QuintetComposer': {
                path: 'quintet-composer',
                port: 3004,
                exports: ['compositions', 'ensembles']
            },
            'GML-ACE': {
                path: 'gml-ace',
                port: 3005,
                exports: ['advanced', 'orchestrations']
            }
        };
    }

    exportToApp(data, targetApp) {
        const validation = this.validateExportData(data);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
                bulletproof: 'FAILED_VALIDATION'
            };
        }

        const standardizedData = this.standardizeDataFormat(data);
        const targetUrl = this.getAppUrl(targetApp);
        
        const exportPayload = {
            timestamp: new Date().toISOString(),
            source: data.source || 'mike-gen-libs',
            target: targetApp,
            format: 'GML_UNIVERSAL_v1',
            bulletproof: '9x3',
            data: standardizedData
        };

        if (JSON.stringify(exportPayload).length < 2000) {
            const encoded = encodeURIComponent(JSON.stringify(exportPayload));
            return {
                success: true,
                method: 'url_params',
                url: `${targetUrl}?import=${encoded}`,
                bulletproof: 'READY'
            };
        }

        const exportKey = `gml_export_${Date.now()}`;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(exportKey, JSON.stringify(exportPayload));
        }
        
        return {
            success: true,
            method: 'localStorage',
            url: `${targetUrl}?importKey=${exportKey}`,
            storageKey: exportKey,
            bulletproof: 'SECURED'
        };
    }

    getAppUrl(appName) {
        const app = this.appRegistry[appName];
        if (!app) {
            throw new Error(`Unknown app: ${appName}`);
        }
        
        const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        
        if (isLocal) {
            return `http://localhost:${app.port}`;
        }
        
        return `https://${app.path}.gml-ecosystem.com`;
    }

    standardizeDataFormat(musicData) {
        const standardized = {
            version: '1.0.0',
            schema: 'GML_UNIVERSAL',
            metadata: {
                created: musicData.created || new Date().toISOString(),
                modified: new Date().toISOString(),
                author: musicData.author || 'mike-gen-libs',
                tags: musicData.tags || [],
                bulletproof: '9x3_VERIFIED'
            },
            content: {}
        };

        if (musicData.riffs) {
            standardized.content.type = 'riff_collection';
            standardized.content.riffs = musicData.riffs;
        } else if (musicData.triads) {
            standardized.content.type = 'triad_progression';
            standardized.content.triads = musicData.triads;
        } else if (musicData.quartet) {
            standardized.content.type = 'quartet_score';
            standardized.content.quartet = musicData.quartet;
        } else {
            standardized.content.type = 'generic';
            standardized.content.data = musicData;
        }

        return standardized;
    }

    validateExportData(data) {
        const errors = [];
        
        if (!data || typeof data !== 'object') {
            errors.push('Data must be an object');
        }

        const contentTypes = ['riffs', 'triads', 'quartet', 'patterns', 'motifs'];
        const hasContent = contentTypes.some(type => data[type]);
        
        if (!hasContent && !data.content) {
            errors.push('Data must contain musical content');
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            bulletproof: errors.length === 0 ? 'VALIDATED' : 'FAILED'
        };
    }
}

const exportSystem = new UniversalExportSystem();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportSystem;
} else if (typeof window !== 'undefined') {
    window.GMLExportSystem = exportSystem;
}
