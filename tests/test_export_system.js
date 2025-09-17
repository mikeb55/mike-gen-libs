/**
 * Tests for Universal Export System
 */

const exportSystem = require('../src/export/universal_export');

console.log('🧪 Testing BULLETPROOF-9x3 Export System...\n');

let passed = 0;
let failed = 0;

// Test 1: RiffGen to Quintet export
try {
    const riffData = {
        source: 'RiffGen',
        riffs: [
            { notes: ['C4', 'E4', 'G4'], duration: 4 },
            { notes: ['D4', 'F4', 'A4'], duration: 4 }
        ]
    };
    
    const result = exportSystem.exportToApp(riffData, 'QuintetComposer');
    
    if (result.success && result.bulletproof) {
        console.log('✅ Test 1: RiffGen → Quintet export PASSED');
        passed++;
    } else {
        console.log('❌ Test 1 FAILED');
        failed++;
    }
} catch (e) {
    console.log('❌ Test 1 Error:', e.message);
    failed++;
}

// Test 2: Validation test
try {
    const invalidData = { invalid: 'data' };
    const result = exportSystem.exportToApp(invalidData, 'QuartetEngine');
    
    if (!result.success && result.bulletproof === 'FAILED_VALIDATION') {
        console.log('✅ Test 2: Invalid data rejection PASSED');
        passed++;
    } else {
        console.log('❌ Test 2 FAILED');
        failed++;
    }
} catch (e) {
    console.log('❌ Test 2 Error:', e.message);
    failed++;
}

console.log('\n═══════════════════════════════');
console.log('BULLETPROOF-9x3 Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Status: ${failed === 0 ? '🚀 READY' : '⚠️ NEEDS FIXES'}`);
console.log('═══════════════════════════════\n');
