import { DataTypes } from "sequelize";
const Room = (sequelize) => {
    const RoomModel = sequelize.define(
        "Room", 
        {
    room_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false
    },
    room_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'available'
    },
    type: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    note: {
        type: DataTypes.STRING(50),
        allowNull: true
    },

},
 { 
    tableName: 'rooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
 RoomModel.associate = (models) => {
  };

  return RoomModel;
};

export default Room;
