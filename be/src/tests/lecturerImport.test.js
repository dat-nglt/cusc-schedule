import request from 'supertest';
import app from '../src/server.js';
import db from '../src/models/index.js';
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';

const { Lecturer } = db;

describe('Lecturer Import Excel Tests', () => {
    let authToken;
    let testFilePath;

    beforeAll(async () => {
        // Setup database
        await db.sequelize.sync({ force: true });

        // Create test admin user và get token
        // (Giả sử bạn đã có hàm để tạo token test)
        authToken = 'test-admin-token';

        // Tạo test Excel file
        testFilePath = path.join(__dirname, 'test-lecturers.xlsx');
        createTestExcelFile(testFilePath);
    });

    afterAll(async () => {
        // Cleanup
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
        await db.sequelize.close();
    });

    beforeEach(async () => {
        // Clear lecturers table before each test
        await Lecturer.destroy({ where: {} });
    });

    describe('POST /api/lecturers/template/download', () => {
        it('should download template Excel file', async () => {
            const response = await request(app)
                .get('/api/lecturers/template/download')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.headers['content-type']).toBe(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            expect(response.headers['content-disposition']).toContain('lecturer_template.xlsx');
        });

        it('should require authentication', async () => {
            await request(app)
                .get('/api/lecturers/template/download')
                .expect(401);
        });
    });

    describe('POST /api/lecturers/import', () => {
        it('should import lecturers successfully', async () => {
            const response = await request(app)
                .post('/api/lecturers/import')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('excel_file', testFilePath)
                .expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.data.summary.success).toBeGreaterThan(0);
            expect(response.body.data.summary.errors).toBe(0);

            // Verify data was inserted
            const lecturers = await Lecturer.findAll();
            expect(lecturers.length).toBeGreaterThan(0);
        });

        it('should handle duplicate lecturer_id', async () => {
            // Import once
            await request(app)
                .post('/api/lecturers/import')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('excel_file', testFilePath);

            // Import again (should have duplicates)
            const response = await request(app)
                .post('/api/lecturers/import')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('excel_file', testFilePath)
                .expect(207);

            expect(response.body.data.summary.errors).toBeGreaterThan(0);
            expect(response.body.data.errorRecords).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        error: 'Mã giảng viên đã tồn tại'
                    })
                ])
            );
        });

        it('should validate required fields', async () => {
            const invalidFile = path.join(__dirname, 'invalid-lecturers.xlsx');
            createInvalidExcelFile(invalidFile);

            const response = await request(app)
                .post('/api/lecturers/import')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('excel_file', invalidFile)
                .expect(207);

            expect(response.body.data.summary.errors).toBeGreaterThan(0);
            expect(response.body.data.errorRecords).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        error: expect.stringContaining('bắt buộc')
                    })
                ])
            );

            fs.unlinkSync(invalidFile);
        });

        it('should validate email format', async () => {
            const invalidEmailFile = path.join(__dirname, 'invalid-email-lecturers.xlsx');
            createInvalidEmailExcelFile(invalidEmailFile);

            const response = await request(app)
                .post('/api/lecturers/import')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('excel_file', invalidEmailFile)
                .expect(207);

            expect(response.body.data.summary.errors).toBeGreaterThan(0);
            expect(response.body.data.errorRecords).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        error: 'Email không đúng định dạng'
                    })
                ])
            );

            fs.unlinkSync(invalidEmailFile);
        });

        it('should reject non-Excel files', async () => {
            const textFile = path.join(__dirname, 'test.txt');
            fs.writeFileSync(textFile, 'This is not an Excel file');

            const response = await request(app)
                .post('/api/lecturers/import')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('excel_file', textFile)
                .expect(400);

            expect(response.body.message).toContain('Chỉ chấp nhận file Excel');

            fs.unlinkSync(textFile);
        });

        it('should reject files without required columns', async () => {
            const noHeaderFile = path.join(__dirname, 'no-header-lecturers.xlsx');
            createNoHeaderExcelFile(noHeaderFile);

            const response = await request(app)
                .post('/api/lecturers/import')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('excel_file', noHeaderFile)
                .expect(400);

            expect(response.body.message).toContain('Template không hợp lệ');

            fs.unlinkSync(noHeaderFile);
        });

        it('should require authentication', async () => {
            await request(app)
                .post('/api/lecturers/import')
                .attach('excel_file', testFilePath)
                .expect(401);
        });
    });
});

// Helper functions to create test files
function createTestExcelFile(filePath) {
    const data = [
        {
            lecturer_id: 'GV001',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@test.com',
            day_of_birth: '1980-01-15',
            gender: 'Nam',
            address: '123 Test Street',
            phone_number: '0123456789',
            department: 'Khoa CNTT',
            hire_date: '2020-09-01',
            degree: 'Tiến sỹ',
            status: 'active'
        },
        {
            lecturer_id: 'GV002',
            name: 'Trần Thị B',
            email: 'tranthib@test.com',
            day_of_birth: '1985-05-20',
            gender: 'Nữ',
            address: '456 Test Avenue',
            phone_number: '0987654321',
            department: 'Khoa Kinh Tế',
            hire_date: '2021-02-15',
            degree: 'Thạc sỹ',
            status: 'active'
        }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lecturers');
    XLSX.writeFile(workbook, filePath);
}

function createInvalidExcelFile(filePath) {
    const data = [
        {
            lecturer_id: 'GV003',
            name: '', // Missing name
            email: 'test@test.com'
        },
        {
            lecturer_id: '', // Missing lecturer_id
            name: 'Test Name',
            email: 'test2@test.com'
        }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lecturers');
    XLSX.writeFile(workbook, filePath);
}

function createInvalidEmailExcelFile(filePath) {
    const data = [
        {
            lecturer_id: 'GV004',
            name: 'Test Name',
            email: 'invalid-email' // Invalid email format
        }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lecturers');
    XLSX.writeFile(workbook, filePath);
}

function createNoHeaderExcelFile(filePath) {
    const data = [
        {
            wrong_column: 'GV005',
            another_column: 'Test Name'
        }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lecturers');
    XLSX.writeFile(workbook, filePath);
}
