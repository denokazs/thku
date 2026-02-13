
import fs from 'fs';
import path from 'path';

const ANALYTICS_DB_PATH = path.join(process.cwd(), 'data', 'analytics.json');

export interface PageView {
    id: string;
    path: string;
    clubSlug?: string | null;
    timestamp: string;
    sessionId: string; // Hashed IP+UA+Date for unique visitor counting
    ip?: string;
    geo?: {
        country?: string;
        city?: string;
        region?: string;
    };
    device?: {
        os?: string;
        browser?: string;
        type?: string;
    };
    ipHash?: string; // Storing hash for debugging if needed, but session ID is primary
}

export interface AnalyticsData {
    pageViews: PageView[];
}

// Initial seed
const INITIAL_DATA: AnalyticsData = {
    pageViews: []
};

const ensureAnalyticsDb = () => {
    const dir = path.dirname(ANALYTICS_DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(ANALYTICS_DB_PATH)) {
        fs.writeFileSync(ANALYTICS_DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    }
};

export const readAnalyticsDb = (): AnalyticsData => {
    ensureAnalyticsDb();
    try {
        const data = fs.readFileSync(ANALYTICS_DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading analytics DB:', error);
        return INITIAL_DATA;
    }
};

export const writeAnalyticsDb = (data: AnalyticsData) => {
    ensureAnalyticsDb();
    try {
        fs.writeFileSync(ANALYTICS_DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing analytics DB:', error);
    }
};

export const logPageView = (view: PageView) => {
    const db = readAnalyticsDb();
    db.pageViews.push(view);

    // Optional: Prune old data if it gets too large (e.g., > 100k records)
    // For now, keep it simple

    writeAnalyticsDb(db);
};

export const getSiteStats = (days: number = 30) => {
    const db = readAnalyticsDb();
    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - days));

    const relevantViews = db.pageViews.filter(v => new Date(v.timestamp) >= cutoff);

    const uniqueVisitors = new Set(relevantViews.map(v => v.sessionId)).size;

    return {
        totalViews: relevantViews.length,
        uniqueVisitors,
        views: relevantViews
    };
};

export const getClubStats = (slug: string, days: number = 30) => {
    const db = readAnalyticsDb();
    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - days));

    // Filter by club slug, OR path starts with /kulupler/slug
    // Detailed logic: specifically track views on the club details page
    const relevantViews = db.pageViews.filter(v => {
        const isTimeValid = new Date(v.timestamp) >= cutoff;
        const viewPath = v.path.toLowerCase();
        const viewSlug = v.clubSlug?.toLowerCase();
        const targetSlug = slug.toLowerCase();

        const isClubPath = viewPath.startsWith(`/kulupler/${targetSlug}`);
        // Also include if clubSlug was explicitly tagged (not used yet but good for future)
        const isTagged = viewSlug === targetSlug;

        return isTimeValid && (isClubPath || isTagged);
    });

    const uniqueVisitors = new Set(relevantViews.map(v => v.sessionId)).size;

    return {
        totalViews: relevantViews.length,
        uniqueVisitors,
        views: relevantViews
    };
};
