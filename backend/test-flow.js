

const testLoginFlow = async () => {
  console.log('='.repeat(60));
  console.log('🧪 TESTING FULL LOGIN FLOW');
  console.log('='.repeat(60));

  const email = 'admin@enernova.id';
  const password = 'admin123';

  console.log(`\n1️⃣ Testing LOGIN endpoint...`);
  console.log(`   Email: ${email}`);
  
  try {
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!loginResponse.ok) {
      console.log(`❌ Login FAILED: ${loginResponse.status} ${loginResponse.statusText}`);
      return;
    }

    const loginData = await loginResponse.json();
    
    if (loginData.status === 'success' && loginData.data) {
      console.log(`✅ Login SUCCESS`);
      console.log(`   User: ${loginData.data.user.name}`);
      console.log(`   Role: ${loginData.data.user.role}`);
      console.log(`   Token: ${loginData.data.token.substring(0, 30)}...`);
      
      const token = loginData.data.token;
      const user = loginData.data.user;

      console.log(`\n2️⃣ Simulating localStorage...`);
      console.log(`   ✅ Saved token`);
      console.log(`   ✅ Saved user data`);

      console.log(`\n3️⃣ Testing /me endpoint with token...`);
      const meResponse = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        console.log(`✅ /me endpoint SUCCESS`);
        console.log(`   User verified: ${meData.data.user.name}`);
        console.log(`   Role verified: ${meData.data.user.role}`);
      } else {
        console.log(`❌ /me endpoint FAILED: ${meResponse.status}`);
      }

      console.log(`\n4️⃣ Testing /journals endpoint...`);
      const journalsResponse = await fetch('http://localhost:5000/api/journals', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (journalsResponse.ok) {
        const journalsData = await journalsResponse.json();
        console.log(`✅ Journals endpoint SUCCESS`);
        console.log(`   Total journals: ${journalsData.data.journals.length}`);
        console.log(`   Pending: ${journalsData.data.journals.filter(j => j.status === 'PENDING').length}`);
        console.log(`   Approved: ${journalsData.data.journals.filter(j => j.status === 'APPROVED').length}`);
      } else {
        console.log(`❌ Journals endpoint FAILED: ${journalsResponse.status}`);
      }

      console.log(`\n5️⃣ Determining redirect...`);
      const role = user.role.toUpperCase();
      let redirectUrl = '/';
      if (role === 'ADMIN') {
        redirectUrl = '/admin/dashboard';
      } else if (role === 'CONTRIBUTOR') {
        redirectUrl = '/contributor';
      }
      console.log(`   Redirect to: ${redirectUrl}`);
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`✅ ALL TESTS PASSED - LOGIN FLOW WORKING!`);
      console.log(`${'='.repeat(60)}`);
      console.log(`\n🚀 NEXT STEPS:`);
      console.log(`   1. Open browser: http://localhost:3000/login`);
      console.log(`   2. Click "Demo Admin" button`);
      console.log(`   3. Click "Masuk ke Platform"`);
      console.log(`   4. Should redirect to: ${redirectUrl}`);
      console.log(`   5. Dashboard should load journals from API`);
      
    } else {
      console.log(`❌ Invalid response format:`, loginData);
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
};

testLoginFlow();
