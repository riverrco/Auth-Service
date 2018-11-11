import {lookup} from 'geoip-lite';
import DeviceInfo from '../models/DeviceInfo/Model'
import UserDeviceBelongsTo from '../models/DeviceInfo/UserDeviceInfo';
import Location from '../models/Location/Model';



const getAdressFromIp = (ip) => {
  const adress = lookup(ip);
  if(adress && adress.region){
  const {region, city, country, ll} = adress;
  return {region, city, country, lng: ll[0], lat: ll[1]}
  }
  return {region: 'N/A', city: 'N/A', country: 'N/A', lng: 0, lat: 0}
}

const registerUserInfo = async ({tokenId, ip, userAgent} = {}) => {
  try {
    const {id: adressId} = await Location.query().insertAndFetch(getAdressFromIp(ip)).pick(["id"]);
    const {id: deviceId} = await DeviceInfo.query().insertAndFetch({user_agent: userAgent, addres_id: adressId, ip}).pick(["id"]);
    const registerToBridge = await UserDeviceBelongsTo.query().insertAndFetch({token_id: tokenId, device_id: deviceId});
    return registerToBridge
  } catch(e) {
    console.log(e)
  }
  
}



export default registerUserInfo
