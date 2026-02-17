const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  try {
    // Check if Lead table exists by trying to query it
    const leadCount = await prisma.lead.count();
    console.log(`Lead table exists: ${leadCount >= 0 ? 'YES' : 'NO'}`);
    
    // Check what tables exist
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables in database:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
