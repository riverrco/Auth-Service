import Model from '../../connectors/psql/Model';
import {UserModel} from '../User';

class Token extends Model {
  static tableName = 'tokens';
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'tokens.user_id',
        to: 'users.id'
      }
    }
  }
}

export {
  Token
}