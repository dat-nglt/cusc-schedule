export const generateLecturerId = () => {
  const prefix = "GV";
  const timestamp = Date.now().toString().slice(-6); // lấy 6 số cuối của mili-giây
  return `${prefix}${timestamp}`;
};

export const generateStudentId = () => {
  const prefix = "HV";
  const year = new Date().getFullYear(); // lấy năm hiện tại
  const timestamp = Date.now().toString().slice(-6); // lấy 6 số cuối của mili-giây
  return `${year}${prefix}${timestamp}`;
};

export const generateClassId = () => {
  const prefix = "LH";
  const year = new Date().getFullYear().toString().slice(-2); // lấy 2 số cuối của năm hiện tại
  const timestamp = Date.now().toString().slice(-6); // lấy 6 số cuối của mili-giây
  return `${year}${prefix}${timestamp}`;
};
