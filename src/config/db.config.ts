import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const toBool = (value: string | undefined, defaultValue = false) => {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
};

const toNumber = (value: string | undefined, defaultValue: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : defaultValue;
};

// config typeORM
export default registerAs('tracker_database', ()=>({  // register a service called 'dms_database' to the ConfigService instance, which can be used by calling configService.get('dms_database')
    type: 'postgres',
    // driver: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: toNumber(process.env.POSTGRES_PORT, 5432),
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    extra: {
        connectionTimeoutMillis: toNumber(process.env.POSTGRES_TIMEOUT, 5000),
    },
    autoLoadEntities: true,
    synchronize: toBool(process.env.SYNCHRONIZE, false),
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
