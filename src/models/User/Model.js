import Model from '../../connectors/psql/Model';

class User extends Model {
  static tableName = 'users';
  static schema = (joi) => ({
    rules: {
      email: joi.string().email(),
      password: joi.string(),
      name: joi.string().alphanum().min(2).max(45),
      surname: joi.string().alphanum().min(2).max(45),
      created_at: joi.number(),
    }
  });
}

export {User};