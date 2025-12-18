const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

let result = dotenv.config();

if (result.error) {
    result = dotenv.config({ path: path.join(__dirname, '../../.env') });
}

if (result.error) {
    result = dotenv.config({ path: path.join(process.cwd(), '.env') });
}

const API_KEY = process.env.GROQ_API_KEY;

console.log('📂 Loaded env from:', result.parsed ? 'File Found' : 'Environment/System');
console.log('----------------------------------------');

if (!API_KEY) {
    console.error('❌ Error: GROQ_API_KEY is missing from environment variables.');
    console.error('Make sure you have a .env file with GROQ_API_KEY=...');
    process.exit(1);
}

console.log('🔍 Diagnostics Info:');
console.log(`- API Key length: ${API_KEY.length}`);
console.log(`- API Key prefix: ${API_KEY.substring(0, 4)}...`);
console.log(`- Node version: ${process.version}`);
console.log('----------------------------------------');

const HEADERS = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'User-Agent': 'EnerNova-Diagnostic/1.0'
};

const testAuthOnly = async () => {
    console.log('1️⃣  TEST 1: Checking Authentication (GET /v1/models)...');
    try {
        const response = await axios.get(
            'https://api.groq.com/openai/v1/models',
            { headers: HEADERS, timeout: 10000 }
        );
        console.log('✅ Success! Authentication is working.');
        console.log(`   Found ${response.data.data.length} available models:`);
        response.data.data.forEach(m => console.log(`   - ${m.id}`));
        return true;
    } catch (error) {
        console.error('❌ Authentication Check Failed!');
        logError(error);
        return false;
    }
};

const testChatCompletion = async (modelId) => {
    console.log(`\n👉 Testing Model: ${modelId}`);

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: modelId,
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 10
            },
            { headers: HEADERS, timeout: 10000 }
        );

        console.log(`✅ Success! ${modelId} is working.`);
        console.log('   Response:', response.data.choices[0].message.content);
        return true;
    } catch (error) {
        console.error(`❌ Failed: ${modelId}`);
        logError(error);
        return false;
    }
};

const logError = (error) => {
    if (error.response) {
        console.error('   Status:', error.response.status, error.response.statusText);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
        console.error('   Network Error (No Response):', error.message);
    } else {
        console.error('   Error:', error.message);
    }
};

const runAllTests = async () => {
    const authSuccess = await testAuthOnly();
    if (authSuccess) {
        console.log('\n2️⃣  TEST 2: Checking Specific Models...');
        await testChatCompletion('llama-3.3-70b-versatile');
        await testChatCompletion('llama-3.1-8b-instant');
    } else {
        console.log('\n⚠️  Skipping Chat test because Authentication failed.');
        console.log('    -> Possible causes: Invalid API Key or IP Address Block.');
    }
};

runAllTests();
