const { PrismaClient } = require('@prisma/client');

async function checkLeadTable() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    // Try to create a simple lead to test if table exists
    const testLead = await prisma.lead.create({
      data: {
        name: 'Test Lead',
        phone: '123456789',
        message: 'Test message',
        status: 'NEW'
      }
    });
    
    console.log('✅ Lead table exists and works!');
    console.log('Created test lead:', testLead);
    
    // Clean up - delete the test lead
    await prisma.lead.delete({
      where: { id: testLead.id }
    });
    
    console.log('✅ Test lead deleted');
    
  } catch (error) {
    console.error('❌ Lead table does not exist or has issues:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLeadTable();
