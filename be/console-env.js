import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load file .env
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('='.repeat(60));
console.log('                 ENVIRONMENT VARIABLES');
console.log('='.repeat(60));

// Nhóm các biến môi trường theo chức năng
const envGroups = {
    'DATABASE CONFIGURATION': [
        'DB_HOST',
        'DB_PORT',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME'
    ],
    'CLOUDINARY CONFIGURATION': [
        'CLOUDINARY_URL',
        'CLOUDINARY_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ],
    'JWT CONFIGURATION': [
        'JWT_SECRET',
        'JWT_EXPIRATION'
    ],
    'APPLICATION CONFIGURATION': [
        'NODE_ENV'
    ]
};

// Hiển thị từng nhóm
Object.entries(envGroups).forEach(([groupName, variables]) => {
    console.log(`\n📁 ${groupName}`);
    console.log('-'.repeat(40));
    variables.forEach(varName => {
        const value = process.env[varName];
        if (value !== undefined) {
            // Hiển thị tất cả giá trị bao gồm cả password và secret
            console.log(`   ${varName}: ${value}`);
        } else {
            console.log(`   ${varName}: ❌ NOT SET`);
        }
    });
});

console.log('\n' + '='.repeat(60));

// Kiểm tra các biến bắt buộc
const requiredVars = [
    'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
    'JWT_SECRET', 'CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.log('\n⚠️  MISSING REQUIRED VARIABLES:');
    missingVars.forEach(varName => {
        console.log(`   ❌ ${varName}`);
    });
} else {
    console.log('\n✅ ALL REQUIRED VARIABLES ARE SET');
}

// Hiển thị thống kê
console.log(`\n📊 STATISTICS:`);
console.log(`   Total variables in .env: ${Object.values(envGroups).flat().length}`);
console.log(`   Variables set: ${Object.values(envGroups).flat().filter(v => process.env[v]).length}`);
console.log(`   Variables missing: ${missingVars.length}`);

console.log('\n' + '='.repeat(60));
