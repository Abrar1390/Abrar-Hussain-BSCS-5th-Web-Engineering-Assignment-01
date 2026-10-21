import { EntitySchema } from 'typeorm';

export class Product {
  constructor({ id = null, name, price, stock = 0 } = {}) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }

  validate() {
    if (typeof this.name !== 'string' || this.name.trim() === '') {
      throw new Error('Product name is required and cannot be empty.');
    }
    if (this.name.trim().length > 255) {
      throw new Error('Product name cannot exceed 255 characters.');
    }
    if (typeof this.price !== 'number' || !Number.isFinite(this.price) || this.price < 0 || this.price > 99999999.99) {
      throw new Error('Product price must be a number between 0 and 99999999.99.');
    }
    if (!Number.isInteger(this.stock) || this.stock < 0 || this.stock > 2147483647) {
      throw new Error('Product stock must be a non-negative integer.');
    }
    return this;
  }
}

export const ProductSchema = new EntitySchema({
  name: 'Product',
  target: Product,
  tableName: 'products',
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
    price: {
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    stock: {
      type: 'int',
      default: 0,
      nullable: false,
    },
  },
});

export default ProductSchema;
