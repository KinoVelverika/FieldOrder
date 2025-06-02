// migrations/2023080101-create-bookings.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookings', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      field_id: { type: Sequelize.INTEGER, allowNull: false },
      booking_date: { type: Sequelize.DATEONLY, allowNull: false },
      start_time: { type: Sequelize.TIME, allowNull: false },
      end_time: { type: Sequelize.TIME, allowNull: false },
      total_price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      status: { 
        type: Sequelize.ENUM('pending', 'confirmed', 'canceled'),
        defaultValue: 'pending'
      },
      payment_proof: { type: Sequelize.STRING },
      booking_code: { type: Sequelize.STRING(20), unique: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addConstraint('bookings', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_id',
      references: { table: 'users', field: 'id' },
      onDelete: 'cascade'
    });

    await queryInterface.addConstraint('bookings', {
      fields: ['field_id'],
      type: 'foreign key',
      name: 'fk_field_id',
      references: { table: 'fields', field: 'id' },
      onDelete: 'cascade'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('bookings');
  }
};