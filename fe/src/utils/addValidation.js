export const validateLecturerField = (
  lecturer,
  existingLecturers = [],
  existingAccounts = []
) => {
  const errors = {};
  const today = new Date();

  // ID
  if (!lecturer.lecturer_id) {
    errors.lecturer_id = "Mã giảng viên không được để trống";
  } else if (
    existingLecturers.some((l) => l.lecturer_id === lecturer.lecturer_id)
  ) {
    errors.lecturer_id = `Mã giảng viên "${lecturer.lecturer_id}" đã tồn tại`;
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!lecturer.email) {
    errors.email = "Email không được để trống";
  } else if (!emailRegex.test(lecturer.email)) {
    errors.email = "Email không hợp lệ";
  } else if (existingAccounts.some((a) => a.email === lecturer.email)) {
    errors.email = `Email "${lecturer.email}" đã tồn tại`;
  }

  // Phone
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!lecturer.phone_number) {
    errors.phone_number = "Số điện thoại không được để trống";
  } else if (!phoneRegex.test(lecturer.phone_number)) {
    errors.phone_number = "Số điện thoại phải có 10-11 chữ số";
  } else if (
    existingLecturers.some((l) => l.phone_number === lecturer.phone_number)
  ) {
    errors.phone_number = `Số điện thoại "${lecturer.phone_number}" đã tồn tại`;
  }

  // DOB
  if (!lecturer.day_of_birth) {
    errors.day_of_birth = "Ngày sinh không được để trống";
  } else {
    const birthDate = new Date(lecturer.day_of_birth);
    if (birthDate >= today) {
      errors.day_of_birth = "Ngày sinh không hợp lệ";
    }
    const minBirthDate = new Date();
    minBirthDate.setFullYear(minBirthDate.getFullYear() - 22);
    if (birthDate > minBirthDate) {
      errors.day_of_birth = "Giảng viên phải đủ 22 tuổi";
    }
  }

  return errors;
};

export const validateStudentField = (
  student,
  existingStudents = [],
  existingAccounts = []
) => {
  const errors = {};
  const today = new Date();

  // ID
  if (!student.student_id) {
    errors.student_id = "Mã học viên không được để trống";
  } else if (
    existingStudents.some((s) => s.student_id === student.student_id)
  ) {
    errors.student_id = `Mã học viên "${student.student_id}" đã tồn tại`;
  }

  // Tên
  if (!student.name) {
    errors.name = "Tên không được để trống";
  }

  // Ngày sinh
  if (!student.day_of_birth) {
    errors.day_of_birth = "Ngày sinh không được để trống";
  } else {
    const birthDate = new Date(student.day_of_birth);
    if (birthDate >= today) {
      errors.day_of_birth = "Ngày sinh không hợp lệ";
    }
    const minBirthDate = new Date();
    minBirthDate.setFullYear(minBirthDate.getFullYear() - 6);
    if (birthDate > minBirthDate) {
      errors.day_of_birth = "Học viên phải đủ 6 tuổi";
    }
  }

  // Giới tính
  if (!student.gender) {
    errors.gender = "Giới tính không được để trống";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!student.email) {
    errors.email = "Email không được để trống";
  } else if (!emailRegex.test(student.email)) {
    errors.email = "Email không hợp lệ";
  } else if (
    existingStudents.some((s) => s.email === student.email) ||
    existingAccounts.some((a) => a.email === student.email)
  ) {
    errors.email = `Email "${student.email}" đã tồn tại`;
  }

  // Phone
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!student.phone_number) {
    errors.phone_number = "Số điện thoại không được để trống";
  } else if (!phoneRegex.test(student.phone_number)) {
    errors.phone_number = "Số điện thoại phải có 10-11 chữ số";
  } else if (
    existingStudents.some((s) => s.phone_number === student.phone_number)
  ) {
    errors.phone_number = `Số điện thoại "${student.phone_number}" đã tồn tại`;
  }

  // Địa chỉ
  if (!student.address) {
    errors.address = "Địa chỉ không được để trống";
  }

  // Lớp và năm nhập học
  if (!student.class) {
    errors.class = "Lớp không được để trống";
  }
  if (!student.admission_year) {
    errors.admission_year = "Năm nhập học không được để trống";
  } else {
    const admissionDate = new Date(student.admission_year);
    if (admissionDate > today) {
      errors.admission_year = "Ngày nhập học không hợp lệ";
    }
  }

  // So sánh ngày nhập học và ngày sinh
  if (student.day_of_birth && student.admission_year) {
    const birthDate = new Date(student.day_of_birth);
    const admissionDate = new Date(student.admission_year);
    if (admissionDate < birthDate) {
      errors.admission_year = "Ngày nhập học không thể trước ngày sinh";
    }
  }

  return errors;
};
