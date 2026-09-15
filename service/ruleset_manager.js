/**
 * RulesetManager: Handles loading, validating, and serving media detection rules.
 * Architecture: Local-First, Strict Validation, Zero Remote Dependencies.
 */
export class RulesetManager {
    constructor() {
        this.ruleset = null;
        this.isValid = false;
        this.source = 'none';
        
        // Embedded Safe Fallback (Hardcoded in source)
        this.embeddedDefaults = {
            schema_version: 2,
            patterns: [
                { regex: '\\\\.mp4', flags: 'gi', type: 'video/mp4' },
                { regex: '\\\\.webm', flags: 'gi', type: 'video/webm' },
                { regex: '\\\\.m3u8', flags: 'gi', type: 'application/x-mpegURL' },
                { regex: '\\\\.mpd', flags: 'gi', type: 'application/dash+xml' },
                { regex: '\\\\.mov', flags: 'gi', type: 'video/quicktime' },
                { regex: '\\\\.mp3', flags: 'gi', type: 'audio/mpeg' }
            ],
            detection: {},
            download: {},
            sites: []
        };
    }

    async initialize() {
        console.log('[RulesetManager] Initializing...');
        try {
            // 1. Attempt to load local packaged ruleset
            const rulesetUrl = chrome.runtime.getURL('local_ruleset/ruleset-pretty.json');
            const response = await fetch(rulesetUrl);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const rawData = await response.json();
            
            // 2. Validate Schema & Security
            const validation = this._validateSchema(rawData);
            if (!validation.valid) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }
            
            // 3. Sanitize (Remove unknown fields)
            this.ruleset = this._sanitize(rawData);
            this.isValid = true;
            this.source = 'local';
            console.log('[RulesetManager] Loaded local ruleset successfully.');
            
        } catch (error) {
            console.warn('[RulesetManager] Local load failed, falling back to embedded defaults.', error);
            this.ruleset = JSON.parse(JSON.stringify(this.embeddedDefaults));
            this.isValid = true;
            this.source = 'embedded';
        }
        return this.isValid;
    }

    _validateSchema(data) {
        const errors = [];
        if (!data || typeof data !== 'object') {
            errors.push('Root must be an object');
            return { valid: false, errors };
        }

        // Check Patterns
        if (data.patterns) {
            if (!Array.isArray(data.patterns)) errors.push('patterns must be an array');
            else {
                data.patterns.forEach((p, i) => {
                    if (!p.regex || typeof p.regex !== 'string') errors.push(`patterns[${i}]: invalid regex string`);
                    else {
                        try { new RegExp(p.regex, p.flags || 'gi'); } 
                        catch (e) { errors.push(`patterns[${i}]: invalid regex syntax`); }
                    }
                    if (!p.type || typeof p.type !== 'string') errors.push(`patterns[${i}]: missing type`);
                });
            }
        }

        // Security Checks: Block Dangerous Fields
        if (data.remote_notifications) errors.push('Field "remote_notifications" is forbidden');
        if (data.behaviours) errors.push('Field "behaviours" is forbidden');
        
        if (data.download) {
            for (const [site, config] of Object.entries(data.download)) {
                if (config.transform || config.processors) {
                    errors.push(`download.${site}: executable fields (transform/processors) are forbidden`);
                }
            }
        }

        return { valid: errors.length === 0, errors };
    }

    _sanitize(data) {
        // Deep copy to avoid mutation issues
        const clean = JSON.parse(JSON.stringify(data));
        // Explicitly delete known bad keys if they slipped through
        delete clean.remote_notifications;
        delete clean.behaviours;
        return clean;
    }

    getRuleset() {
        return this.isValid ? this.ruleset : this.embeddedDefaults;
    }

    getSource() {
        return this.source;
    }
}

export const rulesetManager = new RulesetManager();
