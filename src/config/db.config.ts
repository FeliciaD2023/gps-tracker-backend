import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// config typeORM
export default registerAs('tracker_database', ()=>({  // register a service called 'dms_database' to the ConfigService instance, which can be used by calling configService.get('dms_database')
    type: 'postgres',
    // driver: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    connectTimeoutMS: process.env.POSTGRES_TIMEOUT,
    autoLoadEntities: true,
    synchronize: true,
    ssl: {
        rejectUnauthorized: false
    },
    logging: true,
    logger: 'file',
    // autoLoadEntities: true,
    entities: ['./dist/**/*entity.{ts,js}'],
    migrationsTableName: 'migrations',
    migrations: ['dist/**/migrations/*.{ts,js}'],
    cli: {
        migrationsDir: `src/infrastructure/database/migrations`,
    },
    namingStrategy: new SnakeNamingStrategy(),
    timezone: 'UTC', 
}));