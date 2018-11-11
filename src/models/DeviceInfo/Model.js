import Model from '../../connectors/psql/Model';
import UserDeviceInfo  from './UserDeviceInfo'


class DeviceInfo extends Model {
  static tableName = 'device_info'
  static relationMappings = {
    device: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserDeviceInfo,
      join: {
        from: "device_info.id",
        to: "from_device.device_id"
      }
    }
  }
}

export default DeviceInfo;