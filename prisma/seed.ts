// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, 'schools.csv');

const prisma = new PrismaClient();

async function createSuperadmin() {
  console.log('🔐 Creating superadmin account...');
  
  const superadminEmail = 'superadmin@mail.com'; // You can change this email
  const superadminPassword = '123superadmin'; // *** CHANGE THIS TO A STRONG PASSWORD ***

  const existingSuperadmin = await prisma.user.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingSuperadmin) {
    const hashedPassword = await bcrypt.hash(superadminPassword, 10); // Hash the password
    await prisma.user.create({
      data: {
        email: superadminEmail,
        passwordHash: hashedPassword,
        role: 'SUPERADMIN', // Assign the SUPERADMIN role
        name: 'Super-Admin', // Optional: Add a name
      },
    });
    console.log(`✅ Superadmin account created with email: ${superadminEmail}`);
  } else {
    console.log(`ℹ️  Superadmin account with email: ${superadminEmail} already exists.`);
  }
}

async function seedSchools() {
  console.log('🏫 Seeding schools data...');
  
  // Check if CSV file exists
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  CSV file not found at: ${filePath}`);
    console.log('Skipping school seeding. Please ensure schools.csv exists in the prisma folder.');
    return;
  }

  const schools: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // CSV headers: name,lat,lng,status,npsn,bentuk,telp,alamat,kelurahan,kecamatan
        schools.push({
          name: data.name?.trim() || '',
          status: data.status?.trim() || '',
          npsn: data.npsn?.trim() || '',
          bentuk: data.bentuk?.trim() || '',
          telp: data.telp?.trim() || '',
          alamat: data.alamat?.trim() || '',
          kelurahan: data.kelurahan?.trim() || '',
          kecamatan: data.kecamatan?.trim() || '',
          lat: data.lat && data.lat.trim() !== '' ? parseFloat(data.lat) : null,
          lng: data.lng && data.lng.trim() !== '' ? parseFloat(data.lng) : null,
          // Optional fields from schema (set to null initially)
          achievements: null,
          contact: data.telp?.trim() || null, // Use telp as contact if available
          description: null,
          programs: null,
          website: null,
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  if (schools.length === 0) {
    console.log('⚠️  No school data found in CSV file.');
    return;
  }

  console.log(`📊 Found ${schools.length} schools in CSV file.`);
  
  // Check if schools already exist to avoid duplicates
  const existingSchoolsCount = await prisma.school.count();
  
  if (existingSchoolsCount > 0) {
    console.log(`ℹ️  ${existingSchoolsCount} schools already exist in database.`);
    console.log('Skipping school seeding to avoid duplicates.');
    return;
  }

  console.log(`🚀 Seeding ${schools.length} schools...`);
  
  // Use createMany for better performance
  try {
    await prisma.school.createMany({
      data: schools,
      skipDuplicates: true, // Skip duplicates based on unique constraints
    });
    console.log('✅ Successfully seeded all schools.');
  } catch (error) {
    console.error('❌ Error seeding schools:', error);
    // Fallback to individual creates if createMany fails
    console.log('🔄 Attempting individual school creation...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const school of schools) {
      try {
        await prisma.school.create({ data: school });
        successCount++;
      } catch (err) {
        errorCount++;
        console.error(`❌ Failed to create school: ${school.name}`, err);
      }
    }
    
    console.log(`✅ Successfully created ${successCount} schools.`);
    if (errorCount > 0) {
      console.log(`⚠️  Failed to create ${errorCount} schools.`);
    }
  }
}

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // First create superadmin
    await createSuperadmin();
    
    // Then seed schools
    await seedSchools();
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('💥 Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
  });