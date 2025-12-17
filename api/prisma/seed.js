const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('⚠️  Database already seeded. Skipping...');
    return;
  }

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin EnerNova',
      email: 'admin@enernova.id',
      password: adminPassword,
      role: 'ADMIN'
    }
  });
  console.log('✅ Created admin user:', admin.email);

  const contributorPassword = await bcrypt.hash('kontributor123', 10);
  const contributor = await prisma.user.create({
    data: {
      name: 'Bhayu Pramana',
      email: 'kontributor@enernova.id',
      password: contributorPassword,
      role: 'CONTRIBUTOR'
    }
  });
  console.log('✅ Created contributor user:', contributor.email);

  const researcherPassword = await bcrypt.hash('peneliti123', 10);
  const researcher = await prisma.user.create({
    data: {
      name: 'Dr. Peneliti',
      email: 'peneliti@enernova.id',
      password: researcherPassword,
      role: 'RESEARCHER'
    }
  });
  console.log('✅ Created researcher user:', researcher.email);

  const sampleJournals = [
    {
      filename: 'renewable-energy-2024.pdf',
      title: 'Advances in Solar Photovoltaic Technology',
      detectedAuthor: 'Dr. John Smith',
      authorInstitution: 'MIT Energy Initiative',
      publicationYear: '2024',
      journalSource: 'Nature Energy',
      doi: '10.1038/s41560-024-00001-0',
      pdfUrl: '/data_jurnal/renewable-energy-2024.pdf',
      status: 'APPROVED',
      fileSize: '2.5 MB',
      contentPreview: 'This study presents novel approaches to improving solar cell efficiency...',
      uploaderId: contributor.id
    },
    {
      filename: 'wind-power-optimization.pdf',
      title: 'Wind Power Optimization Using AI',
      detectedAuthor: 'Prof. Maria Garcia',
      authorInstitution: 'Stanford University',
      publicationYear: '2024',
      journalSource: 'Renewable Energy Journal',
      doi: '10.1016/j.renene.2024.00123',
      pdfUrl: '/data_jurnal/wind-power-optimization.pdf',
      status: 'APPROVED',
      fileSize: '3.1 MB',
      contentPreview: 'Machine learning algorithms can significantly enhance wind turbine performance...',
      uploaderId: researcher.id
    },
    {
      filename: 'battery-storage-tech.pdf',
      title: 'Next-Generation Battery Storage Systems',
      detectedAuthor: 'Dr. Wei Chen',
      authorInstitution: 'Tsinghua University',
      publicationYear: '2024',
      journalSource: 'Energy Storage Materials',
      doi: '10.1016/j.ensm.2024.00456',
      pdfUrl: '/data_jurnal/battery-storage-tech.pdf',
      status: 'PENDING',
      fileSize: '1.8 MB',
      contentPreview: 'Novel lithium-ion battery architectures promise higher energy density...',
      uploaderId: contributor.id
    }
  ];

  for (const journalData of sampleJournals) {
    const journal = await prisma.journal.create({
      data: journalData
    });
    console.log(`✅ Created journal: ${journal.title}`);
  }

  console.log('\n✨ Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Journals: ${await prisma.journal.count()}`);
  console.log('\n🔐 Login credentials:');
  console.log('   Admin:        admin@enernova.id / admin123');
  console.log('   Contributor:  kontributor@enernova.id / kontributor123');
  console.log('   Researcher:   peneliti@enernova.id / peneliti123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
