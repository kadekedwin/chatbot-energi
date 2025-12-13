

const testLogin = async (email, password, expectedRole) => {
  console.log(`\n🧪 Testing login: ${email}`);
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      console.log(`✅ SUCCESS`);
      console.log(`   Name: ${data.data.user.name}`);
      console.log(`   Role: ${data.data.user.role}`);
      console.log(`   Token: ${data.data.token.substring(0, 30)}...`);
      
      if (data.data.user.role === expectedRole) {
        console.log(`   ✅ Role matches expected: ${expectedRole}`);
      } else {
        console.log(`   ❌ Role mismatch! Expected: ${expectedRole}, Got: ${data.data.user.role}`);
      }
    } else {
      console.log(`❌ FAILED: ${data.message}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
};

(async () => {
  console.log('='.repeat(60));
  console.log('🚀 TESTING LOGIN ENDPOINTS');
  console.log('='.repeat(60));

  await testLogin('admin@enernova.id', 'admin123', 'ADMIN');

  await testLogin('kontributor@enernova.id', 'kontributor123', 'CONTRIBUTOR');

  await testLogin('peneliti@enernova.id', 'peneliti123', 'RESEARCHER');

  console.log(`\n🧪 Testing invalid credentials`);
  await testLogin('admin@enernova.id', 'wrongpassword', 'ADMIN');

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL TESTS COMPLETED');
  console.log('='.repeat(60));
})();
