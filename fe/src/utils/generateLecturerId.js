export const generateLecturerId = () => {
  const prefix = "CUSC_GV_";
  const timestamp = Date.now(); // số mili-giây hiện tại
  return `${prefix}${timestamp}`;
};
