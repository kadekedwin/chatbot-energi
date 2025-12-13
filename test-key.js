const { createGroq } = require('@ai-sdk/groq');
const { generateText } = require('ai');

async function testGroq() {
  console.log("------------------------------------------------");
  console.log("MULAI PENGUJIAN KUNCI GROQ...");
  
  // --- GANTI TULISAN DI BAWAH INI DENGAN KUNCI GROQ ANDA ---
  // Pastikan formatnya: "gsk_......"
  const myKey = process.env.GROQ_API_KEY; 

  console.log(`Menguji kunci: ${myKey.substring(0, 10)}...`);

  const groq = createGroq({
    apiKey: myKey,
  });

  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: 'Jawab satu kata: Hidup?',
    });

    console.log("✅ SUKSES! Groq membalas:", text);
  } catch (error) {
    console.error("❌ GAGAL! Pesan Error:", error.message);
  }
  console.log("------------------------------------------------");
}

testGroq();