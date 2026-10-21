import { AppDataSource } from '../database/data-source.js';
import { UserSchema } from '../../domain/entities/users.js';

export class UserRepository {
  constructor(dataSource = AppDataSource) {
    this.dataSource = dataSource;
  }

  get repository() {
    return this.dataSource.getRepository(UserSchema);
  }

  async findByEmail(email) {
    return this.repository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }
}
