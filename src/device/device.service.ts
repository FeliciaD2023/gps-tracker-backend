import { Injectable } from "@nestjs/common";
import { EntityManager, In } from "typeorm";
import { CreateDeviceDto } from "./dto/createDevice.dto";
import { Device } from "./entities/Device.entity";
import { UserDevice } from "./entities/UserDevice.entity";
// import { GpsMessage } from 'src/gps-tracker/entities/gpsMessage.entity';

@Injectable()
export class DeviceService {
    constructor(private readonly eManager: EntityManager) {}

    async getAllDevices() {
        const result = await this.eManager.find(Device);
        // console.log(result);
        if (!result) {
            return { result: "failed" };
        }
    }

    async getUserDevices(userId: number, userRole: number, noGps: boolean = false) {
        console.log("get usoe orw: ", userRole);
        // console.log('username?: ', userName);
        let deviceList;
        if (userRole == 2) {
            // admin - get all users of a device
            deviceList = await this.eManager.query(`
                SELECT
                    device_id,
                    ARRAY_AGG(DISTINCT user_name) AS users
                FROM public.user_device
                WHERE is_valid = true
                GROUP BY device_id
            ;`);

            //
        } else {
            deviceList = await this.eManager.find(UserDevice, {
                select: { device_id: true },
                where: {
                    is_valid: true,
                    user_id: userId,
                },
            });
        }

        // console.log('device list: ', deviceIdList);

        if (!deviceList) {
            return { result: "failed" };
        }

        const deviceIds = deviceList.map((d) => d.device_id);
        const deviceInfos = await this.eManager.find(Device, {
            select: ["device_id", "last_report", "device_name"],
            where: {
                device_id: In(deviceIds),
            },
        });

        // console.log('result: ', result);

        if (!deviceInfos) {
            return { result: "failed" };
        }
        const data = [];
        let usersMap;
        if (userRole == 2) {
            usersMap = new Map(deviceList.map((device) => [device.device_id, device.users]));
        }

        if (!noGps) {
            const locations = await this.eManager.query(
                `
            SELECT DISTINCT ON (device_id)
                device_id, lat, lng
            FROM gps_message
            WHERE device_id = ANY($1)
                AND lng <> 0
            ORDER BY device_id, utc DESC
        `,
                [deviceIds],
            );

            // console.log('locations:', locations);
            // locations: [ [ { lat: 0, lng: 0 } ], [ { lat: 0, lng: 0 } ] ]
            const locationMap = new Map(locations.map((location) => [location.device_id, location]));

            for (const device of deviceInfos) {
                const location: any = locationMap.get(device.device_id) ?? { lat: null, lng: null };
                const row = {
                    ...device,
                    lat: location.lat,
                    lng: location.lng,
                };

                if (userRole == 2) {
                    row["users"] = usersMap.get(device.device_id);
                }

                data.push(row);
            }
        } else {
            for (const device of deviceInfos) {
                const row = {
                    ...device,
                };

                if (userRole == 2) {
                    row["users"] = usersMap.get(device.device_id);
                }

                data.push(row);
            }
        }

        return { result: "success", data };
    }

    async getUserDeviceOptions(userId: number) {
        const data = await this.eManager.query(
            `
            SELECT d.device_id, d.device_name
            FROM device d
            LEFT JOIN user_device ud
                ON ud.device_id = d.device_id
            WHERE ud.user_id = $1
        `,
            [userId],
        );

        return { result: "success", data };
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
        const device = await this.eManager.findOneBy(Device, {
            device_id: deviceId,
        });
        device.device_name = deviceName;
        const result = await this.eManager.save(device);
        // console.log('change device name result: ', result);
        if (!result.id) {
            return { result: "failed" };
        }

        return {
            result: "success",
            data: result,
        };
    }
}
