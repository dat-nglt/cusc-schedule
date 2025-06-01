
-- Bảng người dùng chính - lưu thông tin cơ bản của tất cả người dùng trong hệ thống
create table users (
	user_id VARCHAR(30) NOT NULL PRIMARY KEY,        -- Mã định danh người dùng
	name VARCHAR(50),                                -- Họ và tên
	email VARCHAR(70) UNIQUE,                        -- Địa chỉ email (duy nhất)
	phone_number VARCHAR(20),                        -- Số điện thoại liên lạc
	day_of_birth DATE,                              -- Ngày sinh
	gender VARCHAR(30),                             -- Giới tính
	address VARCHAR(100),                           -- Địa chỉ thường trú
	role VARCHAR(20) CHECK (role IN ('admin', 'training_officer','student','lecturer')), -- Vai trò: quản trị viên, nhân viên, sinh viên, giảng viên
	status VARCHAR(30),                             -- Trạng thái tài khoản (active/inactive/suspended)
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo tài khoản
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Thời gian cập nhật cuối cùng
);

--quản trị viên - kế thừa từ bảng users, bổ sung thông tin riêng cho quản trị viên
create table admins (
	admin_id VARCHAR(30) NOT NULL UNIQUE
) INHERITS (users);

-- Thiết lập khóa chính cho bảng admin
ALTER TABLE admins ADD CONSTRAINT admin_pkey PRIMARY KEY (user_id);

--cán bộ đào tạo - kế thừa từ bảng users, bổ sung thông tin riêng cho cán bộ đào tạo
create table training_officers (
	staff_id VARCHAR(30) UNIQUE NOT NULL,
	department VARCHAR(30), -- Phòng ban
	position VARCHAR(30) -- chức vụ
) INHERITS (users);

-- Thiết lập khóa chính cho bảng training_officers
ALTER TABLE training_officers ADD CONSTRAINT training_officers_pkey PRIMARY KEY (user_id);

-- Bảng giảng viên - kế thừa từ bảng users, bổ sung thông tin riêng cho giảng viên
CREATE TABLE lecturers (
    lecturer_id VARCHAR(50) UNIQUE NOT NULL,       -- Mã giảng viên (ví dụ: GV001)
    department VARCHAR(100),                       -- Bộ môn/Khoa công tác
    hire_date DATE,                               -- Ngày vào làm việc
    degree VARCHAR(100)                          -- Bằng cấp cao nhất (Thạc sĩ, Tiến sĩ, Giáo sư...)
) INHERITS (users);

-- Thiết lập khóa chính cho bảng lecturers
ALTER TABLE lecturers ADD CONSTRAINT lecturers_pkey PRIMARY KEY (user_id);

-- Bảng sinh viên - kế thừa từ bảng users, bổ sung thông tin riêng cho sinh viên
CREATE TABLE students (
    student_id VARCHAR(50) UNIQUE NOT NULL,        -- Mã sinh viên (ví dụ: SV2023001)
    class VARCHAR(100),                           -- Lớp học hành chính
    admission_year DATE,                         -- Năm nhập học
    gpa NUMERIC(3, 2)                           -- Điểm trung bình tích lũy (thang điểm 4.0)
) INHERITS (users);

-- Thiết lập khóa chính cho bảng students
ALTER TABLE students ADD CONSTRAINT students_pkey PRIMARY KEY (user_id);

-- Bảng thông báo
create table notifications (
	noti_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- hàm tự tăng chuẩn SQL và an toàn
	title VARCHAR(50), -- tiêu đề
	description VARCHAR(100), -- mô tả
	type VARCHAR(40), -- loại thông báo
	priority VARCHAR(30), --mức độ ưu tiên
	channel VARCHAR(30), --kênh gửi
	send_time TIMESTAMP, --thời gian gửi
	status VARCHAR(30), --trạng thái
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian cập nhật cuối cùng
	user_id VARCHAR(30) REFERENCES users(user_id)
);

-- Bảng khóa học - quản lý các khóa học trong trường
create table courses (
	course_id VARCHAR(30) NOT NULL PRIMARY KEY,     -- Mã khóa học
	course_name VARCHAR(50),                        -- Tên khóa học
	start_date DATE,                               -- Ngày bắt đầu khóa học
	end_date DATE,                                -- Ngày kết thúc khóa học
	status VARCHAR(30),                           -- Trạng thái khóa học (đang diễn ra/đã kết thúc/tạm dừng)
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lớp học - quản lý thông tin các lớp học
create table classes (
	class_id VARCHAR(30) NOT NULL PRIMARY KEY,      -- Mã lớp học
	class_size SMALLINT,                           -- Sĩ số lớp
	status VARCHAR(30),                           -- Trạng thái lớp học
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	student_id VARCHAR(30) REFERENCES students(student_id), -- Liên kết với sinh viên
	course_id VARCHAR(30) REFERENCES courses(course_id)     -- Liên kết với khóa học
);

-- Bảng phòng học - quản lý thông tin các phòng học và phòng thi
CREATE TABLE rooms (
	room_id VARCHAR(30) NOT NULL PRIMARY KEY,       -- Mã phòng
	room_name VARCHAR(30),                          -- Tên phòng (ví dụ: A101, B205)
	location VARCHAR(200),                         -- Vị trí phòng (tòa nhà, tầng)
	capacity INTEGER,                             -- Sức chứa tối đa
	status VARCHAR(30),                          -- Trạng thái phòng (sẵn sàng/bảo trì/đã đặt)
	type VARCHAR(30),                           -- Loại phòng (lý thuyết/thực hành/hội thảo)
	note VARCHAR(100),                         -- Ghi chú thêm về phòng
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng chương trình đào tạo - quản lý các chương trình đào tạo của trường
create table training_programs (
	training_program_id VARCHAR(30) NOT NULL PRIMARY KEY, -- Mã chương trình đào tạo
	training_program_name VARCHAR(50),                    -- Tên chương trình (Công nghệ thông tin, Kế toán...)
	description VARCHAR(200),                            -- Mô tả chi tiết chương trình
	status VARCHAR(30),                                 -- Trạng thái chương trình
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng học kỳ - quản lý thông tin các học kỳ trong năm học
create table semesters (
	semester_id VARCHAR(30) NOT NULL PRIMARY KEY,         -- Mã học kỳ
	semester_name VARCHAR(50),                            -- Tên học kỳ (HK1 2023-2024, HK2 2023-2024)
	start_date DATE,                                     -- Ngày bắt đầu học kỳ
	end_date DATE,                                      -- Ngày kết thúc học kỳ
	status VARCHAR(30),                                -- Trạng thái học kỳ
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	training_program_id VARCHAR(30) REFERENCES training_programs(training_program_id) -- Thuộc chương trình đào tạo nào
);

-- Bảng môn học - quản lý thông tin các môn học
create table subjects (
	subject_id VARCHAR(30) NOT NULL PRIMARY KEY,          -- Mã môn học
	subject_name VARCHAR(50),                             -- Tên môn học
	credit SMALLINT,                                     -- Số tín chỉ
	status VARCHAR(30),                                 -- Trạng thái môn học
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	semester_id VARCHAR(30) REFERENCES semesters(semester_id) -- Thuộc học kỳ nào
);

-- Bảng lớp học phần - quản lý các lớp học phần cụ thể cho từng môn
create table class_sections(
	class_section_id VARCHAR(30) NOT NULL PRIMARY KEY,    -- Mã lớp học phần
	max_students SMALLINT,                               -- Số sinh viên tối đa
	status VARCHAR(30),                                 -- Trạng thái lớp học phần
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	class_id VARCHAR(30) REFERENCES classes(class_id),           -- Thuộc lớp học nào
	subject_id VARCHAR(30) REFERENCES subjects(subject_id)       -- Học môn gì
);

-- Bảng ca học - định nghĩa các khung giờ học trong ngày
create table time_slots(
	slot_id VARCHAR(30) NOT NULL PRIMARY KEY,             -- Mã ca học
	slot_name VARCHAR(50),                                -- Tên ca học (Ca 1, Ca 2, Chiều...)
	start_time TIME WITHOUT TIME ZONE,                   -- Giờ bắt đầu
	end_time TIME WITHOUT TIME ZONE,                     -- Giờ kết thúc
	description VARCHAR(50),                             -- Mô tả ca học
	status VARCHAR(30),                                 -- Trạng thái ca học
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lịch nghỉ - quản lý các kỳ nghỉ trong năm học
create table break_schedule(
	break_id VARCHAR(30) NOT NULL PRIMARY KEY,            -- Mã kỳ nghỉ
	break_start_date DATE,                               -- Ngày bắt đầu nghỉ
	break_end_date DATE,                                -- Ngày kết thúc nghỉ
	number_of_days SMALLINT,                           -- Số ngày nghỉ
	break_type VARCHAR(50),                           -- Loại nghỉ (Tết, hè, lễ...)
	description VARCHAR(100),                        -- Mô tả kỳ nghỉ
	status VARCHAR(30),                             -- Trạng thái
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lịch học - lưu trữ thời khóa biểu chi tiết
create table class_schedules (
	class_schedule_id VARCHAR(30) NOT NULL PRIMARY KEY,   -- Mã lịch học
	class_schedule_name VARCHAR(50),                      -- Tên lịch học
	weekday VARCHAR(50),                                 -- Thứ trong tuần (Thứ 2, Thứ 3...)
	start_date DATE,                                    -- Ngày bắt đầu có hiệu lực
	end_date DATE,                                     -- Ngày kết thúc có hiệu lực
	method VARCHAR(30),                               -- Phương thức giảng dạy (Trực tiếp/Online/Hybrid)
	semester VARCHAR(30),                            -- Học kỳ
	academic_year SMALLINT,                         -- Năm học
	status VARCHAR(30),                            -- Trạng thái lịch học
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	room_id VARCHAR(30) REFERENCES rooms(room_id),                          -- Phòng học
	break_id VARCHAR(30) REFERENCES rooms(room_id),                         -- Lịch nghỉ (lỗi: đang reference sai bảng)
	time_slot_id VARCHAR(30) REFERENCES time_slots(slot_id),                -- Ca học
	class_section_id VARCHAR(30) REFERENCES class_sections(class_section_id), -- Lớp học phần
	lecturer_id VARCHAR(30) REFERENCES lecturers(lecturer_id)               -- Giảng viên phụ trách
);

-- Bảng lịch thi - quản lý lịch thi của các môn học
create table exam_schedules (
	exam_schedule_id VARCHAR(30) NOT NULL PRIMARY KEY,    -- Mã lịch thi
	exam_schedule_name VARCHAR(50),                       -- Tên kỳ thi
	start_date DATE,                                     -- Ngày thi
	end_date DATE,                                      -- Ngày kết thúc (với thi vấn đáp)
	method VARCHAR(30),                                -- Hình thức thi (Viết tay/Trực tuyến/Vấn đáp)
	status VARCHAR(30),                               -- Trạng thái lịch thi
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	room_id VARCHAR(30) REFERENCES rooms(room_id),                    -- Phòng thi
	break_id VARCHAR(30) REFERENCES rooms(room_id),                   -- Lịch nghỉ (lỗi: đang reference sai bảng)
	time_slot_id VARCHAR(30) REFERENCES time_slots(slot_id),          -- Ca thi
	subject_id VARCHAR(30) REFERENCES subjects(subject_id),           -- Môn thi
	lecturer_id VARCHAR(30) REFERENCES lecturers(lecturer_id)         -- Giảng viên coi thi/ra đề
);

-- bảng phân công giảng viên - bảng trung gian giữa giảng viên và môn học
create table lecturer_assignments (
	lecturer_id VARCHAR(30) NOT NULL REFERENCES lecturers(lecturer_id),
	subject_id VARCHAR(30) NOT NULL REFERENCES subjects(subject_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian cập nhật cuối cùng
	primary key (lecturer_id, subject_id)
);

-- Bảng lịch sử đồng bộ
create table sync_histories(
	sync_id VARCHAR(30) NOT NULL PRIMARY KEY,
	format VARCHAR(100), -- định dạng
	data_type VARCHAR(30),--loại dữ liệu
	data_source VARCHAR(100), -- nguồn dữ liệu
	parameter VARCHAR(100), --tham số
	auth VARCHAR(100), --xác thực
	write_mode VARCHAR(100), --chế độ ghi
	sync_time TIMESTAMP, -- thời gian đồng bộ
	status VARCHAR(30),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo tài khoản
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Thời gian cập nhật cuối cùng
);

-- =====================================================
-- CÁC HÀM VÀ TRIGGER TỰ ĐỘNG CẬP NHẬT THỜI GIAN
-- =====================================================

-- Hàm tự động cập nhật trường updated_at khi có thay đổi dữ liệu
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW(); -- Gán thời gian hiện tại cho trường updated_at
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger tự động cho tất cả các bảng có cột updated_at
-- Trigger này sẽ kích hoạt mỗi khi có UPDATE trên bảng
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Duyệt qua tất cả các bảng trong schema 'public'
    -- Chỉ xử lý các bảng thường (không phải view hay partition)
    -- và có cột 'updated_at' kiểu timestamp
    FOR r IN (
        SELECT
            c.relname AS table_name
        FROM
            pg_class c
        JOIN
            pg_namespace n ON n.oid = c.relnamespace
        WHERE
            c.relkind = 'r' -- 'r' nghĩa là bảng thông thường
            AND n.nspname = 'public' -- Schema 'public'
            AND NOT c.relispartition -- Không bao gồm các bảng con phân vùng
            -- Kiểm tra bảng có cột 'updated_at' kiểu timestamp
            AND EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = n.nspname
                  AND table_name = c.relname
                  AND column_name = 'updated_at'
                  AND data_type IN ('timestamp with time zone', 'timestamp without time zone')
            )
    ) LOOP
        -- Tạo trigger cho từng bảng với tên động
        EXECUTE FORMAT('
            CREATE TRIGGER set_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION set_updated_at_timestamp();
        ', r.table_name, r.table_name);

        -- In thông báo xác nhận đã tạo trigger
        RAISE NOTICE 'Đã tạo trigger set_%_updated_at cho bảng %', r.table_name, r.table_name;
    END LOOP;
END $$;