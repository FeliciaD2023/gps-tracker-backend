import { GpsMessage } from './entities/gpsMessage.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateGpsMessageDto } from './createGpsMessage.dto';
// import { lib, enc } from 'crypto-js';
import { Device } from 'src/device/entities/Device.entity';


@Injectable()
export class TrackerService {
    constructor (
        private readonly eManager: EntityManager,
    ) {}

    async getNewMessages ( deviceId: string, lastTime: string | null, desc: boolean = false) {
        // console.log('deviceId: ', deviceId);
        // console.log('lastTime: ', lastTime);

        let result;
        if(!lastTime) {
            result = await this.eManager.query(`
                select *
                from gps_message 
                where device_id='${deviceId}' and lng !=0 
                order by utc ${desc? 'desc' : ''}
            ;`);
        } else {
            result = await this.eManager.query(`
                select *
                from gps_message 
                where device_id='${deviceId}' and utc>'${lastTime}' and lng !=0
                order by utc ${desc? 'desc' : ''}
            ;`);
        }

        // console.log(result);
        return {
            result: 'success',
            data: result
        }
        
    }

    async getNewMessagesMultiple (userId: number, lastTime: string | null) {
        const data = await this.eManager.query(`
            SELECT DISTINCT ON (g.device_id) 
                g.device_id, g.signal_strength, g.battery, g.lat, g.lng, g.utc 
            FROM gps_message g 
            JOIN user_device ud 
                ON ud.device_id = g.device_id 
            WHERE ud.user_id = $1 
                AND g.lng != 0 
                AND g.utc > $2 
            ORDER BY g.device_id, g.utc DESC;
        ;`, [userId, lastTime]);

        // if no gps msg after lastTime, then no row for that device
        return {
            result: 'success',
            data
        }
        
    }

    async createNewMessage(createMessageDto: CreateGpsMessageDto) {
        const newMesssage = new GpsMessage(createMessageDto);
        const result = await this.eManager.save(newMesssage);
        /*
            {
                "device_id": "AXTCL_4EF0FAC71795",
                "utc": "2023-12-05 02:07:14",
                "lat": -31.90813,
                "lng": 116.66455,
                "id": 4
            }
        */
        if(!result.id) {
            return {result: 'failed'}
        }

        const device = await this.eManager.findOneBy(Device, {device_id: createMessageDto.device_id});
        if(!device) {
            const newDevice = new Device({device_id: createMessageDto.device_id, last_report: createMessageDto.utc});
            this.eManager.save(newDevice);
        }else {
            device.last_report = createMessageDto.utc;
            this.eManager.save(device);
        }

        return {
            result: 'success',
            data: {id: result.id}
        }
    }

}