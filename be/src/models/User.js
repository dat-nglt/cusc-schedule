// Import model definitions
import Student from './Student.js';
import Lecturer from './Lecturer.js';
import Admin from './Admin.js';
import TrainingOfficer from './TrainingOfficer.js';

// Define associations if needed
const models = {
    Student,
    Lecturer,
    Admin,
    TrainingOfficer,
};

// Call associate methods if they exist
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export {
    Student,
    Lecturer,
    Admin,
    TrainingOfficer,
};