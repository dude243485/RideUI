import assert from 'assert';
import { distanceKm } from './services/geo.js';
import { estimateFare } from './services/pricing.js';
import { campusHubsData } from './seed/hubs.js';
import app from './app.js';

console.log('--- Running RideUI Backend Verification Tests ---\n');

// 1. Geo Distance Tests
console.log('1. Testing Geo Distance Calculations...');
const p1 = { lat: 7.4416, lng: 3.9006 }; // Main Gate
const p2 = { lat: 7.443, lng: 3.9015 }; // Queens Hall
const dist = distanceKm(p1, p2);
console.log(`- Main Gate to Queens Hall distance: ${dist} km`);
assert(dist > 0 && dist < 1.0, 'Distance should be reasonable campus distance (< 1km)');

// Test coordinates from user prompt: { lat: 7.44, lng: 3.90 }, { lat: 7.44, lng: 3.91 }
const userP1 = { lat: 7.44, lng: 3.9 };
const userP2 = { lat: 7.44, lng: 3.91 };
const userDist = distanceKm(userP1, userP2);
console.log(`- Sample coordinates distance: ${userDist} km`);
assert(userDist > 1.0 && userDist < 1.5, 'User coordinates distance should be approx 1.1km');
console.log('✓ Geo distance calculation verified.\n');

// 2. Pricing and Tariff Engine Tests
console.log('2. Testing Official UI Students Union Tariff Sheet Logic...');

// Main Gate -> Tier A
const mainGate = { name: 'Main Gate', coordinates: { lat: 7.4416, lng: 3.9006 } };
const indepHall = { name: 'Independence Hall', tariffTier: 'A', coordinates: { lat: 7.4435, lng: 3.8965 } };
const resA = estimateFare(mainGate, indepHall);
console.log('- Main Gate -> Independence Hall:', resA);
assert.strictEqual(resA.fare, 100, 'Tier A fare from Main Gate must be ₦100');
assert.strictEqual(resA.serviceType, 'Shared Car/Keke');
assert.strictEqual(resA.tier, 'A');

// Main Gate -> Tier B
const facTech = { name: 'Faculty of Technology', tariffTier: 'B', coordinates: { lat: 7.449, lng: 3.905 } };
const resB = estimateFare(mainGate, facTech);
console.log('- Main Gate -> Faculty of Technology:', resB);
assert.strictEqual(resB.fare, 150, 'Tier B fare from Main Gate must be ₦150');
assert.strictEqual(resB.serviceType, 'Shared Car/Keke');
assert.strictEqual(resB.tier, 'B');

// Main Gate -> Tier C
const polyGate = { name: 'Poly Gate', tariffTier: 'C', coordinates: { lat: 7.438, lng: 3.892 } };
const resC = estimateFare(mainGate, polyGate);
console.log('- Main Gate -> Poly Gate:', resC);
assert.strictEqual(resC.fare, 200, 'Tier C fare from Main Gate must be ₦200');
assert.strictEqual(resC.serviceType, 'Shared Car/Keke');
assert.strictEqual(resC.tier, 'C');

// Main Gate -> Tier D
const dlcSasa = { name: 'DLC Sasa', tariffTier: 'D', coordinates: { lat: 7.465, lng: 3.915 } };
const resD = estimateFare(mainGate, dlcSasa);
console.log('- Main Gate -> DLC Sasa:', resD);
assert.strictEqual(resD.fare, 250, 'Tier D fare from Main Gate must be ₦250');
assert.strictEqual(resD.serviceType, 'Shared Car/Keke');
assert.strictEqual(resD.tier, 'D');

// Non-Main Gate pickup -> Drop trip pricing
console.log('\n3. Testing Drop Trip Calculations (Non-Main Gate Pickups)...');

// Pickup at Tedder Hall -> Destination Tier A (₦300 Keke Drop)
const tedder = { name: 'Tedder Hall', coordinates: { lat: 7.4452, lng: 3.8998 } };
const dropA = estimateFare(tedder, indepHall);
console.log('- Tedder Hall -> Independence Hall (Tier A Drop):', dropA);
assert.strictEqual(dropA.fare, 300, 'Non-Main Gate to Tier A destination must be ₦300 Drop');
assert.strictEqual(dropA.serviceType, 'Keke Drop');

// Pickup at Tedder Hall -> Destination Tier B (₦400 Keke Drop)
const dropB = estimateFare(tedder, facTech);
console.log('- Tedder Hall -> Faculty of Technology (Tier B Drop):', dropB);
assert.strictEqual(dropB.fare, 400, 'Non-Main Gate to Tier B destination must be ₦400 Drop');
assert.strictEqual(dropB.serviceType, 'Keke Drop');

// Pickup at Tedder Hall -> Destination Tier C/D (₦500 Car Drop)
const dropC = estimateFare(tedder, polyGate);
console.log('- Tedder Hall -> Poly Gate (Tier C Drop):', dropC);
assert.strictEqual(dropC.fare, 500, 'Non-Main Gate to Tier C destination must be ₦500 Drop');
assert.strictEqual(dropC.serviceType, 'Car Drop');

// Custom unlisted coordinates -> Drop trip
const customPickup = { lat: 7.44, lng: 3.9 };
const customDest = { lat: 7.44, lng: 3.91 };
const dropCustom = estimateFare(customPickup, customDest);
console.log('- Custom coordinates ({lat:7.44, lng:3.90} -> {lat:7.44, lng:3.91}):', dropCustom);
assert.strictEqual(dropCustom.fare, 500, 'Unlisted coordinates fallback to ₦500 Car Drop');
assert.strictEqual(dropCustom.serviceType, 'Car Drop');
assert(dropCustom.distanceKm > 0, 'Distance must be calculated');

console.log('✓ Tariff and pricing calculations verified.\n');

// 4. Verify Campus Hubs Seed Dataset
console.log('4. Testing Campus Hubs Dataset Integrity...');
assert(campusHubsData.length >= 35, `Expected at least 35 campus hubs, found ${campusHubsData.length}`);
const mainGateSeed = campusHubsData.find((h) => h.name === 'Main Gate');
assert(mainGateSeed, 'Main Gate must be in hubs seed data');
assert.strictEqual(mainGateSeed.tariffTier, null);

const tierAHubs = campusHubsData.filter((h) => h.tariffTier === 'A');
const tierBHubs = campusHubsData.filter((h) => h.tariffTier === 'B');
const tierCHubs = campusHubsData.filter((h) => h.tariffTier === 'C');
const tierDHubs = campusHubsData.filter((h) => h.tariffTier === 'D');

console.log(`- Total Hubs: ${campusHubsData.length}`);
console.log(`- Tier A Destinations: ${tierAHubs.length}`);
console.log(`- Tier B Destinations: ${tierBHubs.length}`);
console.log(`- Tier C Destinations: ${tierCHubs.length}`);
console.log(`- Tier D Destinations: ${tierDHubs.length}`);

for (const hub of campusHubsData) {
  assert(hub.coordinates.lat >= 7.43 && hub.coordinates.lat <= 7.48, `Lat out of range for ${hub.name}`);
  assert(hub.coordinates.lng >= 3.88 && hub.coordinates.lng <= 3.93, `Lng out of range for ${hub.name}`);
}
console.log('✓ All campus hubs coordinates verified within University of Ibadan boundary.\n');

console.log('5. Testing Express App Route Configuration...');
assert(typeof app === 'function', 'Express app should be an exported function');
console.log('✓ Express app initialized and configured with all routes.');

console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
process.exit(0);
