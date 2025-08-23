// // models/LoginSession.js
// import { DataTypes } from 'sequelize';

// const LoginSession = (sequelize) => {
//   const LoginSessionModel = sequelize.define(
//     'LoginSession',
//     {
//       id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//         allowNull: false,
//       },
//       account_id: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         references: {
//           model: 'accounts',
//           key: 'id',
//         },
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//       },
//       ip_address: {
//         type: DataTypes.STRING(45),
//         allowNull: false,
//       },
//       device_info: { // Có thể là chuỗi User-Agent hoặc thông tin phân tích
//         type: DataTypes.STRING(500),
//         allowNull: false,
//       },
//       user_agent: { // Lưu User-Agent gốc để phân tích sau nếu cần
//         type: DataTypes.STRING(500),
//         allowNull: true,
//       },
//       login_at: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//         allowNull: false,
//       },
//       last_used_at: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//         allowNull: false,
//       },
//       is_revoked: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//         allowNull: false,
//       },
//       refresh_token_id: { // Liên kết với Refresh Token đã cấp cho phiên này
//         type: DataTypes.UUID,
//         allowNull: true, // Cho phép NULL nếu không phải mọi phiên đều có RefreshToken liên kết trực tiếp
//         unique: true, // Đảm bảo mỗi LoginSession có 1 RefreshToken duy nhất và ngược lại
//         references: {
//             model: 'refresh_tokens',
//             key: 'id',
//         },
//         onDelete: 'SET NULL', // Nếu RefreshToken bị xóa, chỉ SET NULL trường này, không xóa LoginSession
//         onUpdate: 'CASCADE',
//       }
//     },
//     {
//       tableName: 'login_sessions',
//       timestamps: true,
//       createdAt: 'created_at',
//       updatedAt: 'updated_at',
//       underscored: true,
//     }
//   );

//   LoginSessionModel.associate = (models) => {
//     LoginSessionModel.belongsTo(models.Account, {
//       foreignKey: 'account_id',
//       as: 'account',
//     });
//     LoginSessionModel.belongsTo(models.RefreshToken, {
//         foreignKey: 'refresh_token_id',
//         as: 'refreshToken',
//     });
//   };

//   return LoginSessionModel;
// };

// export default LoginSession;