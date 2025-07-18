import { DataTypes } from "sequelize";

const BlacklistedToken = (sequelize) => {
  const BlacklistedTokenModel = sequelize.define(
    "BlacklistedToken",
    {
      // JWT ID (jti): Định danh duy nhất của token
      jti: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      // ID người dùng sở hữu token
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      // Thời điểm token hết hạn (để dọn dẹp tự động)
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "blacklisted_tokens",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      indexes: [
        {
          fields: ["jti"],
          unique: true,
        },
        {
          fields: ["user_id"],
        },
        {
          fields: ["expires_at"],
        },
      ],
    }
  );

  // Nếu sau này cần liên kết với Account
  // BlacklistedTokenModel.associate = (models) => {
  //   BlacklistedTokenModel.belongsTo(models.Account, {
  //     foreignKey: 'user_id',
  //     as: 'account',
  //     onDelete: 'CASCADE',
  //     onUpdate: 'CASCADE',
  //   });
  // };

  return BlacklistedTokenModel;
};

export default BlacklistedToken;
