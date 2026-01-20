import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = new Database('./prisma/dev.db', { readonly: true });
        const stmt = db.prepare('SELECT * FROM Branch ORDER BY name ASC');
        const rows = stmt.all();

        const branches = rows.map((r) => ({
            id: r.id,
            name: r.name,
            location: r.location,
            area: r.area,
            timings: r.timings,
            distance: r.distance,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        }));

        return NextResponse.json(branches);
    } catch (error) {
        console.error('Error fetching branches:', error);
        return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
    }
}
