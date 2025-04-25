/**
 * MongoDB Status Checker
 * Run in browser console to test backend connection
 */

// Simple function to check MongoDB endpoints
async function checkMongo() {
    console.log('🔍 Checking MongoDB connection status...');
    
    try {
        // 1. Try ping endpoint
        console.log('1️⃣ Checking /api/ping...');
        const pingResp = await fetch('/api/ping');
        const pingData = await pingResp.json();
        console.log('Ping response:', pingData);
        
        // 2. Try public DB endpoint
        console.log('2️⃣ Checking /api/health/db-public...');
        const publicResp = await fetch('/api/health/db-public');
        const publicData = await publicResp.json();
        console.log('Public DB status:', publicData);
        
        // 3. Try API status endpoint
        console.log('3️⃣ Checking /api/health/status...');
        const statusResp = await fetch('/api/health/status');
        const statusData = await statusResp.json();
        console.log('API status:', statusData);
        
        // 4. Try authenticated endpoint
        const token = localStorage.getItem('token');
        if (token) {
            console.log('4️⃣ Checking /api/health/db-status (authenticated)...');
            const authResp = await fetch('/api/health/db-status', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (authResp.ok) {
                const authData = await authResp.json();
                console.log('Authenticated DB status:', authData);
            } else {
                console.error('Authentication failed:', authResp.status);
            }
        } else {
            console.warn('No token found, skipping authenticated check');
        }
        
        console.log('✅ Connection check complete');
    } catch (error) {
        console.error('❌ Error checking MongoDB:', error);
    }
}

// Execute the check
checkMongo(); 