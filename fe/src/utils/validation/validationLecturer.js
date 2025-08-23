// Hàm validation toàn diện (đã được cải tiến trước đó)
export const validateLecturerData = (
  newLecturer,
  existingLecturers = [],
  isUpdate = false,
  originalLecturer = null
) => {
  const {
    lecturer_id,
    name,
    email,
    phone_number,
    day_of_birth,
    gender,
    department,
    degree,
    address,
    subjects,
  } = newLecturer;

  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Validation các trường bắt buộc
  const requiredFields = {
    lecturer_id: "Mã giảng viên",
    name: "Họ và tên",
    email: "Email",
    phone_number: "Số điện thoại",
    day_of_birth: "Ngày sinh",
    gender: "Giới tính",
    department: "Khoa",
    degree: "Bằng cấp",
    address: "Địa chỉ",
  };

  Object.entries(requiredFields).forEach(([field, fieldName]) => {
    if (!newLecturer[field] || newLecturer[field].toString().trim() === "") {
      errors[field] = `${fieldName} là bắt buộc`;
    }
  });

  // 2. Validation format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.email = "Email không đúng định dạng";
  }

  const phoneRegex = /^0[0-9]{9,10}$/;
  if (phone_number && !phoneRegex.test(phone_number.replace(/\s/g, ""))) {
    errors.phone_number = "Số điện thoại phải có 10-11 số và bắt đầu bằng 0";
  }

  const idRegex = /^[A-Za-z0-9]{6,20}$/;
  if (lecturer_id && !idRegex.test(lecturer_id)) {
    errors.lecturer_id = "Mã giảng viên phải từ 6-20 ký tự (chữ và số)";
  }

  // 3. Validation ngày tháng
  try {
    if (day_of_birth) {
      const birthDate = new Date(day_of_birth);
      birthDate.setHours(0, 0, 0, 0);

      const minBirthDate = new Date(today);
      minBirthDate.setFullYear(minBirthDate.getFullYear() - 18);

      const maxBirthDate = new Date(today);
      maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 70);

      if (birthDate > today) {
        errors.day_of_birth = "Ngày sinh không thể ở tương lai";
      } else if (birthDate > minBirthDate) {
        errors.day_of_birth = "Giảng viên phải đủ 18 tuổi";
      } else if (birthDate < maxBirthDate) {
        errors.day_of_birth = "Giảng viên không thể trên 70 tuổi";
      }
    }

  } catch (error) {
    errors.day_of_birth = "Ngày sinh không hợp lệ";
  }

  // 4. Validation trùng lặp
  const checkDuplicate = (field, value) => {
    return existingLecturers.some((lecturer) => {
      if (
        isUpdate &&
        originalLecturer &&
        lecturer.lecturer_id === originalLecturer.lecturer_id
      ) {
        return false;
      }
      return (
        lecturer[field]?.toString().toLowerCase() ===
        value?.toString().toLowerCase()
      );
    });
  };

  if (checkDuplicate("lecturer_id", lecturer_id)) {
    errors.lecturer_id = `Mã giảng viên "${lecturer_id}" đã tồn tại`;
  }

  if (checkDuplicate("email", email)) {
    errors.email = `Email "${email}" đã tồn tại`;
  }

  if (checkDuplicate("phone_number", phone_number)) {
    errors.phone_number = `Số điện thoại "${phone_number}" đã tồn tại`;
  }

  // 5. Validation môn học
  if (!subjects || subjects.length === 0) {
    errors.subjects = "Vui lòng chọn ít nhất một môn học";
  }

  return errors;
};

export const validatePersonalInfo = (data, existingLecturers) => {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Required fields
  if (!data.lecturer_id?.trim()) {
    errors.lecturer_id = "Mã giảng viên là bắt buộc";
  } else if (data.lecturer_id.trim().length < 6) {
    errors.lecturer_id = "Mã giảng viên phải có ít nhất 6 ký tự";
  } else if (
    existingLecturers.some((l) => l.lecturer_id === data.lecturer_id)
  ) {
    errors.lecturer_id = `Mã giảng viên "${data.lecturer_id}" đã tồn tại`;
  }

  if (!data.name?.trim()) {
    errors.name = "Họ và tên là bắt buộc";
  } else if (data.name.trim().length < 2) {
    errors.name = "Họ và tên phải có ít nhất 2 ký tự";
  }

  if (!data.day_of_birth) {
    errors.day_of_birth = "Ngày sinh là bắt buộc";
  } else {
    try {
      const birthDate = new Date(data.day_of_birth);
      birthDate.setHours(0, 0, 0, 0);

      const minBirthDate = new Date(today);
      minBirthDate.setFullYear(minBirthDate.getFullYear() - 18);

      const maxBirthDate = new Date(today);
      maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 70);

      if (birthDate > today) {
        errors.day_of_birth = "Ngày sinh không thể ở tương lai";
      } else if (birthDate > minBirthDate) {
        errors.day_of_birth = "Giảng viên phải đủ 18 tuổi";
      } else if (birthDate < maxBirthDate) {
        errors.day_of_birth = "Giảng viên không thể trên 70 tuổi";
      }
    } catch (error) {
      errors.day_of_birth = "Ngày sinh không hợp lệ";
    }
  }

  if (!data.gender) {
    errors.gender = "Giới tính là bắt buộc";
  } else if (!["male", "female", "other"].includes(data.gender)) {
    errors.gender = "Giới tính không hợp lệ";
  }

  return errors;
};

export const validateContactInfo = (data, existingLecturers) => {
  const errors = {};

  // Email validation
  if (!data.email?.trim()) {
    errors.email = "Email là bắt buộc";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Email không đúng định dạng";
    } else if (existingLecturers.some((l) => l.email === data.email)) {
      errors.email = `Email "${data.email}" đã tồn tại`;
    }
  }

  // Phone validation
  if (!data.phone_number?.trim()) {
    errors.phone_number = "Số điện thoại là bắt buộc";
  } else {
    const phoneRegex = /^0[0-9]{9,10}$/;
    const cleanPhone = data.phone_number.replace(/\s/g, "");

    if (!phoneRegex.test(cleanPhone)) {
      errors.phone_number = "Số điện thoại phải có 10-11 số và bắt đầu bằng 0";
    } else if (existingLecturers.some((l) => l.phone_number === cleanPhone)) {
      errors.phone_number = `Số điện thoại "${cleanPhone}" đã tồn tại`;
    }
  }

  // Address validation
  if (!data.address?.trim()) {
    errors.address = "Địa chỉ là bắt buộc";
  } else if (data.address.trim().length < 5) {
    errors.address = "Địa chỉ phải có ít nhất 5 ký tự";
  }

  return errors;
};

export const validateWorkInfo = (data) => {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Department validation
  const validDepartments = [
    "Khoa Công Nghệ Thông Tin",
    "Khoa Kỹ Thuật",
    "Khoa Quản Trị Kinh Doanh",
    "Khoa Công Nghệ Thực Phẩm",
    "Khoa Xây Dựng",
    "Khoa Cơ Khí",
    "Khoa Điện - Điện Tử",
  ];

  if (!data.department) {
    errors.department = "Khoa là bắt buộc";
  } else if (!validDepartments.includes(data.department)) {
    errors.department = "Khoa không hợp lệ";
  }

  // Degree validation
  const validDegrees = [
    "Cử nhân",
    "Thạc sỹ",
    "Tiến sỹ",
    "Giáo sư",
    "Phó Giáo sư",
  ];
  if (!data.degree) {
    errors.degree = "Bằng cấp là bắt buộc";
  } else if (!validDegrees.includes(data.degree)) {
    errors.degree = "Bằng cấp không hợp lệ";
  }

  // Subjects validation (nếu cần)
  if (data.subjects && data.subjects.length === 0) {
    errors.subjects = "Vui lòng chọn ít nhất một môn học";
  }

  return errors;
};
