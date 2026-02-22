
import fs from 'fs';
import path from 'path';

// Database configuration
const DB_SQLITE_PATH = path.join(process.cwd(), 'data', 'thk.db');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'thk_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true // Enable for migration scripts
};

// Driver loading
let mysql: any;
let Database: any;

try {
    mysql = require('mysql2/promise');
} catch (e) {
    // MySQL not available
}

try {
    Database = require('better-sqlite3');
} catch (e) {
    // SQLite not available
}

// Singleton instances
let mysqlPool: any;
let sqliteDb: any;

function getSqliteDb() {
    if (!Database) throw new Error('better-sqlite3 driver not found');
    if (!sqliteDb) {
        // Ensure data directory exists
        const dataDir = path.dirname(DB_SQLITE_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        sqliteDb = new Database(DB_SQLITE_PATH);
        sqliteDb.pragma('journal_mode = WAL');
        sqliteDb.pragma('synchronous = NORMAL');
    }
    return sqliteDb;
}

function getMysqlPool() {
    if (!mysql) throw new Error('mysql2 driver not found');
    if (!mysqlPool) {
        mysqlPool = mysql.createPool(dbConfig);
    }
    return mysqlPool;
}

// Helpers
const parseJSON = (str: any) => {
    try {
        if (typeof str === 'object') return str;
        return str ? JSON.parse(str) : [];
    } catch (e) {
        return [];
    }
};

const stringifyJSON = (val: any) => {
    if (typeof val === 'string') return val;
    return JSON.stringify(val || []);
};

// MAPPINGS
const MAPPINGS: any = {
    users: { table: 'users', json: 'users', type: 'array' },
    clubs: { table: 'clubs', json: 'clubs', type: 'array', jsonFields: ['president', 'gallery', 'badges', 'socialMedia'] },
    events: { table: 'events', json: 'events', type: 'array', jsonFields: ['images', 'schedule', 'speakers', 'faq'], boolFields: ['isPast', 'isFeatured'] },
    announcements: { table: 'announcements', json: 'announcements', type: 'array' },
    news: { table: 'news', json: 'news', type: 'array' },
    confessions: { table: 'confessions', json: 'confessions', type: 'array' },
    comments: { table: 'comments', json: 'comments', type: 'array' },
    messages: { table: 'messages', json: 'messages', type: 'array', jsonFields: ['internalNotes'] },
    forumPosts: { table: 'forum_posts', json: 'forumPosts', type: 'array', jsonFields: ['likes', 'comments'] },
    members: { table: 'members', json: 'members', type: 'array' },
    attendance: { table: 'attendance', json: 'attendance', type: 'array' },
    exams: { table: 'exams', json: 'exams', type: 'array' },
    lectureNotes: { table: 'lecture_notes', json: 'lectureNotes', type: 'array' },
    teachers: { table: 'teachers', json: 'teachers', type: 'array', jsonFields: ['ratings'] },
    shuttleStops: { table: 'shuttle_stops', json: 'shuttleStops', type: 'array' },
    cafeteriaMenu: { table: 'cafeteria_menu', json: 'cafeteriaMenu', type: 'object', key: 'date' },
    settings: { table: 'settings', json: 'settings', type: 'kv' },
    apiLogs: { table: 'api_logs', json: 'apiLogs', type: 'array' }
};

export async function readDb(tableNames?: string[]) {
    // Check environment or default to sqlite if mysql config is missing/default
    const useMysql = process.env.NODE_ENV === 'production' || process.env.DB_TYPE === 'mysql';

    if (useMysql) {
        return readDbMysql(tableNames);
    } else {
        return readDbSqlite(tableNames);
    }
}

export async function writeDb(data: any) {
    const useMysql = process.env.NODE_ENV === 'production' || process.env.DB_TYPE === 'mysql';

    if (useMysql) {
        return writeDbMysql(data);
    } else {
        return writeDbSqlite(data);
    }
}

export async function appendApiLog(logEntry: any) {
    const useMysql = process.env.NODE_ENV === 'production' || process.env.DB_TYPE === 'mysql';

    if (useMysql) {
        return appendApiLogMysql(logEntry);
    } else {
        return appendApiLogSqlite(logEntry);
    }
}

// --- Implementation: SQLite ---

async function readDbSqlite(tableNames?: string[]) {
    const db = getSqliteDb();
    const data: any = {};
    const keysToFetch = tableNames ? tableNames : Object.keys(MAPPINGS);

    for (const key of keysToFetch) {
        if (!MAPPINGS[key]) continue;
        const config = MAPPINGS[key];
        try {
            if (config.type === 'array') {
                const rows = db.prepare(`SELECT * FROM ${config.table}`).all();
                data[config.json] = rows.map((row: any) => {
                    const newRow = { ...row };
                    if (config.jsonFields) config.jsonFields.forEach((f: string) => newRow[f] = parseJSON(newRow[f]));
                    if (config.boolFields) config.boolFields.forEach((f: string) => newRow[f] = Boolean(newRow[f]));
                    return newRow;
                });
            } else if (config.type === 'kv') {
                const rows = db.prepare(`SELECT * FROM ${config.table}`).all();
                const settingsObj: any = {};
                rows.forEach((r: any) => {
                    try { settingsObj[r.key] = JSON.parse(r.value); } catch { settingsObj[r.key] = r.value; }
                });
                data[config.json] = settingsObj['site_settings'] || settingsObj;
            } else if (config.type === 'object') {
                const rows = db.prepare(`SELECT * FROM ${config.table}`).all();
                const obj: any = {};
                rows.forEach((row: any) => { obj[row[config.key]] = row; });
                data[config.json] = obj;
            }
        } catch (e) {
            // Ignore missing tables
            data[config.json] = config.type === 'array' ? [] : {};
        }
    }
    return data;
}

async function writeDbSqlite(data: any) {
    const db = getSqliteDb();
    const transaction = db.transaction((data: any) => {
        for (const key in MAPPINGS) {
            const config = MAPPINGS[key];
            const inputData = data[config.json];
            if (!inputData) continue;

            if (config.type === 'array') {
                if (!Array.isArray(inputData)) continue;
                db.prepare(`DELETE FROM ${config.table}`).run();
                if (inputData.length === 0) continue;

                const columns = db.prepare(`PRAGMA table_info(${config.table})`).all().map((c: any) => c.name);
                const insertParams = columns.map(() => '?').join(', '); // Use ? for safe parameter binding in better-sqlite3
                const insertStmt = db.prepare(`INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${insertParams})`);

                for (const item of inputData) {
                    const row = { ...item };
                    if (config.jsonFields) config.jsonFields.forEach((f: string) => row[f] = stringifyJSON(row[f]));
                    if (config.boolFields) config.boolFields.forEach((f: string) => row[f] = row[f] ? 1 : 0);

                    const values = columns.map((col: string) => row[col] === undefined ? null : row[col]);
                    insertStmt.run(...values);
                }
            } else if (config.type === 'kv') {
                const val = JSON.stringify(inputData);
                db.prepare(`INSERT OR REPLACE INTO ${config.table} (key, value) VALUES (?, ?)`).run('site_settings', val);
            } else if (config.type === 'object') {
                db.prepare(`DELETE FROM ${config.table}`).run();
                const columns = db.prepare(`PRAGMA table_info(${config.table})`).all().map((c: any) => c.name);
                const insertParams = columns.map(() => '?').join(', ');
                const insertStmt = db.prepare(`INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${insertParams})`);

                for (const dateKey in inputData) {
                    const item = inputData[dateKey];
                    const row = { ...item, [config.key]: dateKey };
                    const values = columns.map((col: string) => row[col] === undefined ? null : row[col]);
                    insertStmt.run(...values);
                }
            }
        }
    });
    transaction(data);
}

async function appendApiLogSqlite(logEntry: any) {
    const db = getSqliteDb();
    const config = MAPPINGS['apiLogs'];
    if (!config) return;

    try {
        const columns = db.prepare(`PRAGMA table_info(${config.table})`).all().map((c: any) => c.name);
        if (columns.length === 0) return; // Table not strictly migrated yet

        const validKeys = Object.keys(logEntry).filter(k => columns.includes(k) && k !== 'id');
        const placeholders = validKeys.map(() => '?').join(', ');
        const escapedColumns = validKeys.join(', ');

        // Ensure arrays/objects are stringified for JSON fields or text columns
        const values = validKeys.map(k => {
            let val = logEntry[k];
            if (val === undefined) return null;
            if (typeof val === 'object' && val !== null) return JSON.stringify(val);
            if (typeof val === 'boolean') return val ? 1 : 0;
            return val;
        });

        const insertStmt = db.prepare(`INSERT INTO ${config.table} (${escapedColumns}) VALUES (${placeholders})`);
        insertStmt.run(...values);
    } catch (err) {
        console.error('[API Logger SQLite]', err);
    }
}

// --- Implementation: MySQL ---

async function readDbMysql(tableNames?: string[]) {
    const db = getMysqlPool();
    const data: any = {};
    const keysToFetch = tableNames ? tableNames : Object.keys(MAPPINGS);

    for (const key of keysToFetch) {
        if (!MAPPINGS[key]) continue;
        const config = MAPPINGS[key];
        try {
            if (config.type === 'array') {
                const [rows]: any = await db.query(`SELECT * FROM ${config.table}`);
                data[config.json] = rows.map((row: any) => {
                    const newRow = { ...row };
                    if (config.jsonFields) config.jsonFields.forEach((f: string) => { if (newRow[f]) newRow[f] = parseJSON(newRow[f]); });
                    if (config.boolFields) config.boolFields.forEach((f: string) => newRow[f] = Boolean(newRow[f]));
                    return newRow;
                });
            } else if (config.type === 'kv') {
                const [rows]: any = await db.query(`SELECT * FROM ${config.table}`);
                const settingsObj: any = {};
                rows.forEach((r: any) => { try { settingsObj[r.key] = JSON.parse(r.value); } catch { settingsObj[r.key] = r.value; } });
                data[config.json] = settingsObj['site_settings'] || settingsObj;
            } else if (config.type === 'object') {
                const [rows]: any = await db.query(`SELECT * FROM ${config.table}`);
                const obj: any = {};
                rows.forEach((row: any) => { obj[row[config.key]] = row; });
                data[config.json] = obj;
            }
        } catch (err: any) {
            console.error(`Error fetching ${key}:`, err.message);
            try {
                const fs = require('fs');
                fs.appendFileSync('db_debug.log', `[${new Date().toISOString()}] Error fetching ${key}: ${err.message}\n${err.stack}\n---\n`);
            } catch (e) { }
            data[config.json] = config.type === 'array' ? [] : {};
        }
    }
    return data;
}

async function writeDbMysql(data: any) {
    const db = getMysqlPool();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        for (const key in MAPPINGS) {
            const config = MAPPINGS[key];
            const inputData = data[config.json];
            if (!inputData) continue;

            if (config.type === 'array') {
                if (!Array.isArray(inputData)) continue;
                await connection.query(`DELETE FROM ${config.table}`);
                if (inputData.length === 0) continue;

                const [cols]: any = await connection.query(`SHOW COLUMNS FROM ${config.table}`);
                const columns = cols.map((c: any) => c.Field);
                if (columns.length === 0) continue;

                const placeholders = columns.map(() => '?').join(', ');
                const escapedColumns = columns.map((c: any) => `\`${c}\``).join(', ');
                const sql = `INSERT INTO ${config.table} (${escapedColumns}) VALUES (${placeholders})`;

                for (const item of inputData) {
                    const row = { ...item };
                    if (config.jsonFields) config.jsonFields.forEach((f: string) => row[f] = stringifyJSON(row[f]));
                    if (config.boolFields) config.boolFields.forEach((f: string) => row[f] = row[f] ? 1 : 0);
                    const values = columns.map((col: string) => row[col] === undefined ? null : row[col]);
                    await connection.query(sql, values);
                }
            } else if (config.type === 'kv') {
                const val = JSON.stringify(inputData);
                await connection.query(`REPLACE INTO ${config.table} (\`key\`, value) VALUES (?, ?)`, ['site_settings', val]);
            } else if (config.type === 'object') {
                const [cols]: any = await connection.query(`SHOW COLUMNS FROM ${config.table}`);
                const columns = cols.map((c: any) => c.Field);
                const placeholders = columns.map(() => '?').join(', ');
                const escapedColumns = columns.map((c: any) => `\`${c}\``).join(', ');
                const sql = `INSERT INTO ${config.table} (${escapedColumns}) VALUES (${placeholders})`;
                await connection.query(`DELETE FROM ${config.table}`);

                for (const dateKey in inputData) {
                    const item = inputData[dateKey];
                    const row = { ...item, [config.key]: dateKey };
                    const values = columns.map((col: string) => row[col] === undefined ? null : row[col]);
                    await connection.query(sql, values);
                }
            }
        }
        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

async function appendApiLogMysql(logEntry: any) {
    const db = getMysqlPool();
    const config = MAPPINGS['apiLogs'];
    if (!config) return;

    try {
        // Strip out 'id' if auto increment
        const { id, ...dataToInsert } = logEntry;

        // Build direct SET statement
        // For MySQL, SET ? automatically escapes and maps an object's keys to columns
        await db.query(`INSERT INTO ${config.table} SET ?`, [dataToInsert]);
    } catch (err) {
        console.error('[API Logger MySQL]', err);
    }
}
