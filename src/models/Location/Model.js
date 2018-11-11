import Model from '../../connectors/psql/Model';
import Device from '../DeviceInfo/Model';

class Location extends Model {
  static tableName = 'locations'
  static relationMappings = {
    location: {
      relation: Model.BelongsToOneRelation,
      modelClass: Device,
      join: {
        from: "locations.id",
        to: "device_info.location"
      }
    }
  }
}

export default Location;