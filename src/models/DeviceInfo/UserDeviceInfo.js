import Model from '../../connectors/psql/Model';
import {Token} from '../Token/Model';
import Device from './Model'

class UserDeviceInfo extends Model { 
  static tableName = 'from_device'
  static relationMappings = {
    device: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/Model`,
      join: {
        from: 'from_device.device_id',
        to: 'device_info.id'
      }
    },
    token: {
      relation: Model.HasManyRelation,
      modelClass: Token,
      join: {
        from: 'from_device.token_id',
        to: 'tokens.id'
      }
    }
  }
}

export default UserDeviceInfo