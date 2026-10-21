export class AddCityAndProducts1700000000001 {
  name = 'AddCityAndProducts1700000000001';

  async up(queryRunner) {
    await queryRunner.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE IF EXISTS products');
    await queryRunner.query('ALTER TABLE users DROP COLUMN IF EXISTS city');
  }
}
