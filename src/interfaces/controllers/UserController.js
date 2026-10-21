export class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getByEmail = async (req, res, next) => {
    try {
      const email = req.params.email?.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error = new Error('A valid email address is required.');
        error.statusCode = 400;
        throw error;
      }

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        const error = new Error(`User with email '${email}' was not found.`);
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };
}
