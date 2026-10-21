import { Product } from '../../domain/entities/Product.js';

const positiveId = (value) => {
  if (!/^\d+$/.test(value || '')) {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const invalidIdError = () => {
  const error = new Error('Product ID must be a positive integer.');
  error.statusCode = 400;
  return error;
};

const validationError = (error) => {
  error.statusCode = 400;
  return error;
};

export class ProductController {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  getAll = async (req, res, next) => {
    try {
      const products = await this.productRepository.findAll();
      return res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const id = positiveId(req.params.id);
      if (!id) throw invalidIdError();

      const product = await this.productRepository.findById(id);
      if (!product) {
        const error = new Error(`Product with ID ${id} was not found.`);
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      let product;
      try {
        product = new Product(req.body || {}).validate();
      } catch (error) {
        throw validationError(error);
      }

      const created = await this.productRepository.create({
        name: product.name.trim(),
        price: product.price,
        stock: product.stock,
      });
      return res.status(201).json({ success: true, data: created });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const id = positiveId(req.params.id);
      if (!id) throw invalidIdError();

      let product;
      try {
        product = new Product(req.body || {}).validate();
      } catch (error) {
        throw validationError(error);
      }

      const updated = await this.productRepository.update(id, {
        name: product.name.trim(),
        price: product.price,
        stock: product.stock,
      });
      if (!updated) {
        const error = new Error(`Product with ID ${id} was not found.`);
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      const id = positiveId(req.params.id);
      if (!id) throw invalidIdError();

      const deleted = await this.productRepository.delete(id);
      if (!deleted) {
        const error = new Error(`Product with ID ${id} was not found.`);
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } catch (error) {
      next(error);
    }
  };
}
