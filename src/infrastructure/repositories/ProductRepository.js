import { AppDataSource } from '../database/data-source.js';
import { ProductSchema } from '../../domain/entities/Product.js';

export class ProductRepository {
  constructor(dataSource = AppDataSource) {
    this.dataSource = dataSource;
  }

  get repository() {
    return this.dataSource.getRepository(ProductSchema);
  }

  async findAll() {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findById(id) {
    const numericId = Number(id);
    if (!Number.isSafeInteger(numericId) || numericId < 1) {
      return null;
    }
    return this.repository.findOneBy({ id: numericId });
  }

  async create(product) {
    const entity = this.repository.create(product);
    return this.repository.save(entity);
  }

  async update(id, changes) {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }
    Object.assign(product, changes);
    return this.repository.save(product);
  }

  async delete(id) {
    const numericId = Number(id);
    if (!Number.isSafeInteger(numericId) || numericId < 1) {
      return false;
    }
    const result = await this.repository.delete(numericId);
    return result.affected > 0;
  }
}
