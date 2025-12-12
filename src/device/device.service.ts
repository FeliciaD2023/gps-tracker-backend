import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateDeviceDto } from './dto/createDevice.dto';
import { Device } from './entities/Device.entity';
import { UserDevice } from './entities/UserDevice.entity';
// import { GpsMessage } from 'src/gps-tracker/entities/gpsMessage.entity';

@Injectable()
export class DeviceService {
    constructor (
        private readonly eManager: EntityManager,
    ) {}

    async getAllDevices() {
        const result = await this.eManager.find(Device);
        // console.log(result);
        if(!result) {
            return {result: "failed"};
        }
    }

    async getUserDevices(userName: string) {
        // console.log('username?: ', userName);
        const deviceIdList = await this.eManager.find(UserDevice, {
            select: {device_id: true},
            where: {
                user_name: userName,
                is_valid: true
            },
        });

        // console.log('device list: ', deviceIdList);

        let result;
        let promises = [];
        if(!deviceIdList) {
            return {result: "failed"};
        } else {
            
            deviceIdList.forEach(device => {
                const promise = this.eManager.findOneBy(Device, {device_id: device.device_id})
                promises.push(promise);
            })
            result = await Promise.all(promises);
        }

        // console.log('result: ', result);
        
        if(!result) {
            return {result: "failed"};
        } else {
            promises = [];
            result.forEach(device => {
                const promise = this.eManager.query(`
                    select lat, lng
                    from gps_message 
                    where device_id='${device.device_id}' and lng !=0
                    order by utc desc
                    limit 1
                ;`)
                promises.push(promise);
            })
            const locations = await Promise.all(promises);
            // console.log(result);
            // console.log('locations:', locations); 
            // locations: [ [ { lat: 0, lng: 0 } ], [ { lat: 0, lng: 0 } ] ]
            const inteResult = [];
            for(const i in result) {
                inteResult.push({...result[i], ...locations[i][0]});
            }

            return {result: 'success', data: inteResult};
        }
    }

    async createDevice(createDeviceDto: CreateDeviceDto) {
        const newDevice = new Device(createDeviceDto);
        const result = await this.eManager.save(newDevice);

        // console.log('new device result: ', result);
        /*
        new device result:  Device {
            device_id: 'AXTCL_4EF0FAC71AE7',
            user: 'beehives',
            last_report: null,
            id: 3,
            created_utc: 2024-01-17T08:15:22.000Z,
            updated_utc: 2024-01-17T08:15:22.000Z
            }
        */
    }

    async updateDeviceName(deviceName: string, deviceId: string) {
        const device = await this.eManager.findOneBy(Device, {device_id: deviceId});
        device.device_name = deviceName;
        const result = await this.eManager.save(device);
        // console.log('change device name result: ', result);
        if(!result.id) {
            return {result: 'failed'}
        }

        return {
            result: 'success',
            data: result
        }
    }

}
