/**
 * mike-gen-libs V1.0 - Core Music Theory Library
 * Comprehensive music theory engine with multi-book knowledge integration
 */

const MikeGenLibs = (function() {
    'use strict';
    
    // Core Constants
    const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const FREQUENCIES = {
        'A4': 440,
        baseOctave: 4
    };
    
    // Book Registry
    const BOOKS = {
        'fux': {
            name: 'Gradus ad Parnassum',
            author: 'Johann Joseph Fux',
            rules: {
                counterpoint: {
                    forbidden: ['parallel_fifths', 'parallel_octaves', 'hidden_fifths'],
                    required: ['contrary_motion_preferred', 'resolve_dissonance'],
                    species: [1, 2, 3, 4, 5]
                }
            }
        },
        'schoenberg': {
            name: 'Fundamentals of Musical Composition',
            author: 'Arnold Schoenberg',
            concepts: {
                motif: 'smallest_musical_idea',
                phrase: 'musical_sentence',
                developing_variation: true
            }
        },
        'rimsky': {
            name: 'Principles of Orchestration',
            author: 'Nikolai Rimsky-Korsakov',
            ranges: {
                violin: { low: 'G3', high: 'E7' },
                viola: { low: 'C3', high: 'E6' },
                cello: { low: 'C2', high: 'A5' }
            }
        }
    };
    
    // Core Functions
    const Core = {
        /**
         * Convert note name to MIDI number
         */
        noteToMidi: function(note) {
            if (!note || typeof note !== 'string') return null;
            const match = note.match(/([A-G]#?)(\-?\d+)/);
            if (!match) return null;
            
            const noteName = match[1];
            const octave = parseInt(match[2]);
            const noteIndex = NOTES.indexOf(noteName);
            
            if (noteIndex === -1) return null;
            const midi = (octave + 1) * 12 + noteIndex;
            return (midi >= 0 && midi <= 127) ? midi : null;
        },
        
        /**
         * Convert MIDI number to note name
         */
        midiToNote: function(midi) {
            if (typeof midi !== 'number' || midi < 0 || midi > 127) return null;
            const octave = Math.floor(midi / 12) - 1;
            const noteIndex = midi % 12;
            return NOTES[noteIndex] + octave;
        },
        
        /**
         * Convert note to frequency (Hz)
         */
        noteToFrequency: function(note) {
            const midi = this.noteToMidi(note);
            if (midi === null) return null;
            return 440 * Math.pow(2, (midi - 69) / 12);
        },
        
        /**
         * Convert frequency to nearest note
         */
        frequencyToNote: function(freq) {
            if (typeof freq !== 'number' || freq <= 0) return null;
            const midi = Math.round(12 * Math.log2(freq / 440) + 69);
            return this.midiToNote(midi);
        }
    };
    
    // Scale Generation
    const Scales = {
        patterns: {
            major: [2, 2, 1, 2, 2, 2, 1],
            minor: [2, 1, 2, 2, 1, 2, 2],
            dorian: [2, 1, 2, 2, 2, 1, 2],
            phrygian: [1, 2, 2, 2, 1, 2, 2],
            lydian: [2, 2, 2, 1, 2, 2, 1],
            mixolydian: [2, 2, 1, 2, 2, 1, 2],
            locrian: [1, 2, 2, 1, 2, 2, 2],
            harmonic_minor: [2, 1, 2, 2, 1, 3, 1],
            melodic_minor: [2, 1, 2, 2, 2, 2, 1],
            pentatonic_major: [2, 2, 3, 2, 3],
            pentatonic_minor: [3, 2, 2, 3, 2],
            blues: [3, 2, 1, 1, 3, 2],
            chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        },
        
        /**
         * Generate scale from root note
         */
        generate: function(root, type = 'major') {
            const pattern = this.patterns[type];
            if (!pattern || !root) return null;
            
            const rootMidi = Core.noteToMidi(root);
            if (rootMidi === null) return null;
            
            const scale = [root];
            let currentMidi = rootMidi;
            
            for (let interval of pattern) {
                currentMidi += interval;
                if (currentMidi > 127) break;
                scale.push(Core.midiToNote(currentMidi));
            }
            
            return scale;
        }
    };
    
    // Chord Construction
    const Chords = {
        intervals: {
            // Triads
            major: [0, 4, 7],
            minor: [0, 3, 7],
            dim: [0, 3, 6],
            aug: [0, 4, 8],
            sus2: [0, 2, 7],
            sus4: [0, 5, 7],
            // Seventh chords
            maj7: [0, 4, 7, 11],
            min7: [0, 3, 7, 10],
            dom7: [0, 4, 7, 10],
            min7b5: [0, 3, 6, 10],
            dim7: [0, 3, 6, 9],
            // Extended chords
            maj9: [0, 4, 7, 11, 14],
            min9: [0, 3, 7, 10, 14],
            dom9: [0, 4, 7, 10, 14],
            maj11: [0, 4, 7, 11, 14, 17],
            min11: [0, 3, 7, 10, 14, 17],
            dom11: [0, 4, 7, 10, 14, 17],
            maj13: [0, 4, 7, 11, 14, 17, 21],
            dom13: [0, 4, 7, 10, 14, 17, 21]
        },
        
        /**
         * Build chord from root note
         */
        build: function(root, type = 'major') {
            const intervals = this.intervals[type];
            if (!intervals || !root) return null;
            
            const rootMidi = Core.noteToMidi(root);
            if (rootMidi === null) return null;
            
            const chord = [];
            for (let interval of intervals) {
                const noteMidi = rootMidi + interval;
                if (noteMidi > 127) break;
                chord.push(Core.midiToNote(noteMidi));
            }
            
            return chord;
        },
        
        /**
         * Analyze chord from notes
         */
        analyze: function(notes) {
            if (!notes || notes.length < 2) return null;
            
            const midis = notes.map(n => Core.noteToMidi(n)).filter(m => m !== null);
            if (midis.length !== notes.length) return null;
            
            midis.sort((a, b) => a - b);
            const root = midis[0];
            const intervals = midis.map(m => m - root);
            
            // Check against known chord types
            for (let [chordType, chordIntervals] of Object.entries(this.intervals)) {
                if (intervals.length === chordIntervals.length &&
                    intervals.every((val, idx) => val === chordIntervals[idx])) {
                    return {
                        root: Core.midiToNote(root),
                        type: chordType,
                        notes: notes
                    };
                }
            }
            
            return { root: Core.midiToNote(root), type: 'unknown', intervals };
        }
    };
    
    // Voice Leading (from multiple books)
    const VoiceLeading = {
        /**
         * Check for parallel fifths/octaves (Fux rule)
         */
        checkParallels: function(voice1Start, voice1End, voice2Start, voice2End) {
            const startInterval = Math.abs(Core.noteToMidi(voice1Start) - Core.noteToMidi(voice2Start)) % 12;
            const endInterval = Math.abs(Core.noteToMidi(voice1End) - Core.noteToMidi(voice2End)) % 12;
            
            // Parallel fifths
            if (startInterval === 7 && endInterval === 7) {
                return { valid: false, error: 'parallel_fifths', book: 'fux' };
            }
            
            // Parallel octaves
            if (startInterval === 0 && endInterval === 0) {
                return { valid: false, error: 'parallel_octaves', book: 'fux' };
            }
            
            return { valid: true };
        },
        
        /**
         * Suggest voice leading (Schoenberg + jazz approach)
         */
        suggest: function(chord1, chord2, options = {}) {
            const book = options.book || 'schoenberg';
            const voicings = [];
            
            // Simple closest voice leading
            const chord2Midis = chord2.map(n => Core.noteToMidi(n));
            
            for (let note1 of chord1) {
                const midi1 = Core.noteToMidi(note1);
                let closest = chord2Midis.reduce((prev, curr) => 
                    Math.abs(curr - midi1) < Math.abs(prev - midi1) ? curr : prev
                );
                voicings.push(Core.midiToNote(closest));
            }
            
            return {
                from: chord1,
                to: voicings,
                method: 'closest',
                book: book
            };
        }
    };
    
    // Counterpoint Rules (Fux)
    const Counterpoint = {
        species: {
            1: 'note_against_note',
            2: 'two_against_one',
            3: 'four_against_one',
            4: 'syncopation',
            5: 'florid'
        },
        
        /**
         * Validate counterpoint line
         */
        validate: function(cantus, counterpoint, species = 1) {
            const errors = [];
            
            // Check each interval
            for (let i = 0; i < Math.min(cantus.length, counterpoint.length); i++) {
                const interval = Math.abs(Core.noteToMidi(counterpoint[i]) - Core.noteToMidi(cantus[i])) % 12;
                
                // Dissonances on strong beats (species 1)
                if (species === 1 && [1, 2, 5, 6, 10, 11].includes(interval)) {
                    errors.push({
                        measure: i,
                        type: 'dissonance_on_strong_beat',
                        book: 'fux'
                    });
                }
                
                // Check voice leading between successive notes
                if (i > 0) {
                    const parallel = VoiceLeading.checkParallels(
                        cantus[i-1], cantus[i],
                        counterpoint[i-1], counterpoint[i]
                    );
                    if (!parallel.valid) {
                        errors.push({
                            measure: i,
                            type: parallel.error,
                            book: 'fux'
                        });
                    }
                }
            }
            
            return { valid: errors.length === 0, errors };
        }
    };
    
    // Query System
    const Query = {
        /**
         * Query knowledge from specific or all books
         */
        ask: function(question, options = {}) {
            const books = options.books || Object.keys(BOOKS);
            const results = {};
            
            // Simple keyword matching for now
            const keywords = question.toLowerCase().split(' ');
            
            if (keywords.includes('range') && keywords.includes('violin')) {
                if (books.includes('rimsky')) {
                    results.rimsky = BOOKS.rimsky.ranges.violin;
                }
            }
            
            if (keywords.includes('parallel') && keywords.includes('fifths')) {
                if (books.includes('fux')) {
                    results.fux = 'Forbidden: parallel fifths destroy independence of voices';
                }
            }
            
            if (keywords.includes('motif')) {
                if (books.includes('schoenberg')) {
                    results.schoenberg = BOOKS.schoenberg.concepts.motif;
                }
            }
            
            return results;
        },
        
        /**
         * Get recommendations from books
         */
        recommend: function(context, options = {}) {
            const recommendations = [];
            
            if (context.type === 'voice_leading') {
                recommendations.push({
                    book: 'fux',
                    advice: 'Avoid parallel fifths and octaves'
                });
                recommendations.push({
                    book: 'schoenberg',
                    advice: 'Use developing variation to maintain coherence'
                });
            }
            
            if (context.type === 'orchestration') {
                recommendations.push({
                    book: 'rimsky',
                    advice: 'Consider instrument ranges and timbral combinations'
                });
            }
            
            return recommendations;
        }
    };
    
    // GML Tool Adapters
    const GMLAdapters = {
        fromRiffGen: function(riffData) {
            // Convert RiffGen frequency format
            if (!riffData || !riffData.frequencies) return null;
            return riffData.frequencies.map(f => Core.frequencyToNote(f));
        },
        
        fromQuartet: function(quartetData) {
            // Convert Quartet MIDI format
            if (!quartetData || !quartetData.notes) return null;
            return quartetData.notes.map(m => Core.midiToNote(m));
        },
        
        toRiffGen: function(notes) {
            // Convert to RiffGen frequency format
            if (!notes) return null;
            return notes.map(n => Core.noteToFrequency(n));
        },
        
        toQuartet: function(notes) {
            // Convert to Quartet MIDI format
            if (!notes) return null;
            return notes.map(n => Core.noteToMidi(n));
        }
    };
    
    // Public API
    return {
        version: '1.0.0',
        Core,
        Scales,
        Chords,
        VoiceLeading,
        Counterpoint,
        Query,
        Books: BOOKS,
        Adapters: GMLAdapters,
        
        // Convenience methods
        note: Core.noteToMidi,
        freq: Core.noteToFrequency,
        scale: Scales.generate,
        chord: Chords.build,
        analyze: Chords.analyze,
        query: Query.ask,
        recommend: Query.recommend,
        
        // Integration helpers
        fromRiffGen: GMLAdapters.fromRiffGen,
        fromQuartet: GMLAdapters.fromQuartet,
        toRiffGen: GMLAdapters.toRiffGen,
        toQuartet: GMLAdapters.toQuartet
    };
})();

// Export for use in other GML tools
if (typeof window !== 'undefined') {
    window.MikeGenLibs = MikeGenLibs;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MikeGenLibs;
}