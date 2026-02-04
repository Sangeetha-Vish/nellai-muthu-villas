// Native fetch used in Node 24+

const BASE_URL = 'http://localhost:3000';

async function runTest() {
    console.log('🧪 Starting Branch Isolation Test...');

    // 1. Login/Register Customer
    console.log('👤 Registering Customer...');
    let cookie = '';
    const uniqueEmail = `cust${Date.now()}@test.com`;

    // Login or Signup (simplifying by just hitting login endpoint if user exists, but here we assume fresh db or unique email)
    // Actually, seed cleared users. So we create one via API or use a known one.
    // The previous E2E script used register. Let's use register.
    const regRes = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Customer', email: uniqueEmail, password: 'password123', phone: '9998887776' })
    });

    if (regRes.status === 200 || regRes.status === 201) {
        cookie = regRes.headers.get('set-cookie');
    } else {
        // Try login
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: uniqueEmail, password: 'password123' })
        });
        if (!loginRes.ok) throw new Error('Customer Login Failed');
        cookie = loginRes.headers.get('set-cookie');
    }

    // 2. Get Branches
    const branchesRes = await fetch(`${BASE_URL}/api/branches`);
    const { branches } = await branchesRes.json();
    const rsPuram = branches.find(b => b.name === 'RS Puram');
    const gandhipuram = branches.find(b => b.name === 'Gandhipuram');

    if (!rsPuram || !gandhipuram) throw new Error('Branches not found in seed data');

    // 3. Place Order at RS Puram
    console.log('🛒 Placing Order at RS Puram...');
    const order1 = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        body: JSON.stringify({
            branchId: rsPuram.id,
            items: [{ productId: 'test-product', quantity: 1, price: 100 }], // Mock product ID, will fail if validation strict?
            // Wait, we need real product ID.
            totalAmount: 100,
            pickupTime: new Date().toISOString()
        })
    });
    // Note: This might fail if product validation is strict. Seed created products.
    // We need to fetch products first.

    // Fetch Products
    const prodRes = await fetch(`${BASE_URL}/api/products`); // Assuming public endpoint? Prompt implied global catalog.
    // Check seed: it creates products.
    // Assuming /api/products exists or /api/admin/products (protected). 
    // Customer usually gets products via simple server comp or API.
    // Let's assume we can pass a dummy ID or we need to fetch real ID.
    // Actually, let's login as Admin first to get Product ID.

    // Login Owner
    console.log('🔑 Logging in Owner to get Data...');
    const ownerRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@nmv.com', password: 'admin123' })
    });
    const ownerCookie = ownerRes.headers.get('set-cookie');
    const productsRes = await fetch(`${BASE_URL}/api/admin/products`, { headers: { Cookie: ownerCookie } });
    const products = await productsRes.json();
    const productId = products[0].id; // Use first product

    // Retry Order 1
    await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        body: JSON.stringify({
            branchId: rsPuram.id,
            items: [{ productId: productId, quantity: 1, price: 100 }],
            totalAmount: 100,
            pickupTime: new Date().toISOString(),
            paymentMethod: 'CASH'
        })
    });

    // 4. Place Order at Gandhipuram
    console.log('🛒 Placing Order at Gandhipuram...');
    await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        body: JSON.stringify({
            branchId: gandhipuram.id,
            items: [{ productId: productId, quantity: 1, price: 100 }],
            totalAmount: 100,
            pickupTime: new Date().toISOString(),
            paymentMethod: 'CASH'
        })
    });

    // 5. Login as Manager (RS Puram)
    console.log('👮 Logging in Branch Manager (RS Puram)...');
    const mgrRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'manager@nmv.com', password: 'manager123' })
    });
    const mgrCookie = mgrRes.headers.get('set-cookie');
    const mgrBody = await mgrRes.json();

    if (mgrBody.user.branchId !== rsPuram.id) {
        throw new Error('Manager login did not return correct branchId');
    }
    console.log('✅ Manager assigned to correct branch');

    // 6. Fetch Orders as Manager
    console.log('👀 fetching Manager Orders...');
    const mgrOrdersRes = await fetch(`${BASE_URL}/api/admin/orders?type=IMMEDIATE`, {
        headers: { Cookie: mgrCookie }
    });
    const mgrOrders = await mgrOrdersRes.json();

    // 7. Verify Isolation
    console.log(`📊 Manager sees ${mgrOrders.length} orders`);

    const seesRsPuram = mgrOrders.some(o => o.branchId === rsPuram.id);
    const seesGandhipuram = mgrOrders.some(o => o.branchId === gandhipuram.id);

    if (seesRsPuram && !seesGandhipuram) {
        console.log('✅ SUCCESS: Isolation Verified! Manager sees only RS Puram orders.');
    } else {
        console.error('❌ FAILURE: Isolation Broken.');
        console.log('Sees RS Puram:', seesRsPuram);
        console.log('Sees Gandhipuram:', seesGandhipuram);
        process.exit(1);
    }
}

runTest().catch(e => {
    console.error(e);
    process.exit(1);
});
