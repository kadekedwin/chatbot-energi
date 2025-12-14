const axios = require('axios');
const logger = require('../utils/logger');
const prisma = require('../config/database');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required'
      });
    }

    const searchLower = message.toLowerCase();
    const journals = await prisma.journal.findMany({
      where: {
        status: 'APPROVED',
        OR: [
          { title: { contains: searchLower } },
          { detectedAuthor: { contains: searchLower } },
          { contentPreview: { contains: searchLower } }
        ]
      },
      take: 5, 
      select: {
        title: true,
        detectedAuthor: true,
        authorInstitution: true,
        publicationYear: true,
        contentPreview: true,
        doi: true
      }
    });

    let contextInfo = '';
    if (journals.length > 0) {
      contextInfo = '\n\n🔬 **KONTEKS DARI DATABASE JURNAL:**\n';
      journals.forEach((j, idx) => {
        contextInfo += `\n${idx + 1}. "${j.title}" by ${j.detectedAuthor} (${j.publicationYear || 'N/A'})`;
        if (j.contentPreview) {
          contextInfo += `\n   Preview: ${j.contentPreview.substring(0, 200)}...`;
        }
      });
      contextInfo += '\n\n';
    }

    const systemPrompt = `Kamu adalah **EnerNova AI**, asisten Eco-Futurist yang sangat ahli dalam:
🔋 Energi Terbarukan Indonesia (Solar, Wind, Hydro, Geothermal)
⚡ Teknologi Baterai (LFP vs NMC, Lithium-ion, Solid-state)
🌿 Hilirisasi Nikel & Value Chain
🚗 Electric Vehicles & E-Mobility
📊 Analisis Riset Akademis Energi

**MODE: HYBRID RAG (Retrieval-Augmented Generation)**
- Gunakan konteks jurnal yang tersedia untuk jawaban yang akurat
- Jika ada data dari database, referensikan dengan format: [Author, Year]
- Berikan jawaban yang cepat, responsif, dan data-driven
- Gunakan emoji yang relevan untuk readability
- Format tabel menggunakan markdown jika diperlukan

**RESPONSE STYLE:**
✅ Langsung to-the-point
✅ Sertakan data numerik jika tersedia
✅ Referensi akademis yang jelas
✅ Bahasa Indonesia profesional namun friendly
✅ Maksimal 500 kata untuk kecepatan`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { 
        role: 'user', 
        content: contextInfo + message 
      }
    ];

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile', 
        messages: messages,
        temperature: 0.7,
        max_tokens: 800, 
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 
      }
    );
    
    const aiResponse = response.data.choices[0].message.content;
    
    logger.info(`Chat processed - User: ${req.user?.email || 'Anonymous'} - Retrieved: ${journals.length} journals`);
    
    res.json({
      status: 'success',
      data: {
        message: aiResponse,
        model: 'llama-3.3-70b-versatile',
        metadata: {
          retrievedJournals: journals.length,
          mode: 'HYBRID_RAG',
          processingTime: response.data.usage?.total_tokens || 0
        }
      }
    });
    
  } catch (error) {
    logger.error('Chat Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(500).json({
        status: 'error',
        message: 'Groq API key is invalid or missing'
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        status: 'error',
        message: 'Request timeout - please try again'
      });
    }
    
    next(error);
  }
};
