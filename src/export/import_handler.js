/**
 * Universal Import Handler
 * Receives data from other GML apps
 */

class ImportHandler {
    constructor() {
        this.importQueue = [];
        this.listeners = [];
        if (typeof window !== 'undefined') {
            this._initializeImportDetection();
        }
    }

    _initializeImportDetection() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('import')) {
            try {
                const importData = JSON.parse(
                    decodeURIComponent(urlParams.get('import'))
                );
                this.handleImport(importData);
            } catch (e) {
                console.error('Failed to parse URL import data:', e);
            }
        }
        
        if (urlParams.has('importKey')) {
            const key = urlParams.get('importKey');
            const data = localStorage.getItem(key);
            
            if (data) {
                try {
                    const importData = JSON.parse(data);
                    this.handleImport(importData);
                    localStorage.removeItem(key);
                } catch (e) {
                    console.error('Failed to parse localStorage data:', e);
                }
            }
        }
    }

    handleImport(data) {
        if (data.bulletproof !== '9x3') {
            console.warn('Import data missing BULLETPROOF-9x3 protocol');
        }

        const processed = {
            id: `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            source: data.source,
            target: data.target,
            data: data.data,
            status: 'received'
        };

        this.importQueue.push(processed);
        this._notifyListeners(processed);
        this._autoProcess(processed);

        return processed;
    }

    onImport(callback) {
        this.listeners.push(callback);
    }

    getPendingImports() {
        return this.importQueue.filter(i => i.status === 'received');
    }

    _notifyListeners(importData) {
        this.listeners.forEach(listener => {
            try {
                listener(importData);
            } catch (e) {
                console.error('Import listener error:', e);
            }
        });
    }

    _autoProcess(importData) {
        const contentType = importData.data?.content?.type;
        
        switch (contentType) {
            case 'riff_collection':
                console.log('Auto-processing riff collection...');
                break;
            case 'triad_progression':
                console.log('Auto-processing triad progression...');
                break;
            case 'quartet_score':
                console.log('Auto-processing quartet score...');
                break;
        }

        importData.status = 'processed';
    }
}

const importHandler = new ImportHandler();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = importHandler;
} else if (typeof window !== 'undefined') {
    window.GMLImportHandler = importHandler;
}
