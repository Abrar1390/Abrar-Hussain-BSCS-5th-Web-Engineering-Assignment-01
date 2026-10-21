import { EntitySchema } from 'typeorm';

export class User {
  constructor({ id = null, name, email, age = null, city = null } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
    this.city = city;
  }

  validate() {
    if (typeof this.name !== 'string' || this.name.trim() === '') {
      throw new Error('User name is required and cannot be empty.');
    }
    if (typeof this.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new Error('A valid email address is required.');
    }
    if (this.age !== null && (!Number.isInteger(this.age) || this.age < 0)) {
      throw new Error('User age must be a non-negative integer.');
    }
    if (this.city !== null && typeof this.city !== 'string') {
      throw new Error('User city must be a string or null.');
    }
    return this;
  }
}

export const UserSchema = new EntitySchema({
  name: 'User',
  target: User,
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 320,
      unique: true,
      nullable: false,
    },
    age: {
      type: 'int',
      nullable: true,
    },
    city: {
      type: 'varchar',
      nullable: true,
    },
  },
});

export default UserSchema;
