// file: app/api/schools/nearby/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface NearbySchool {
    id: number;
    name: string;
    alamat: string;
    lat: number;
    lng: number;
    distance: number;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json({ error: 'Invalid latitude or longitude format' }, { status: 400 });
    }

    try {
        // Rumus Haversine untuk menghitung jarak dalam kilometer.
        // Ini adalah query mentah karena Prisma belum mendukung fungsi geospasial secara native.
        const nearbySchools = await prisma.$queryRaw<Array<NearbySchool>>`
            SELECT id, name, alamat, lat, lng,
                   (6371 * acos(cos(radians(${latitude})) * cos(radians(lat)) * cos(radians(lng) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(lat)))) AS distance
            FROM "School"
            WHERE lat IS NOT NULL AND lng IS NOT NULL
            ORDER BY distance
            LIMIT ${limit};
        `;

        // Mengonversi distance menjadi number dan membulatkannya
        const formattedSchools = nearbySchools.map(school => ({
            ...school,
            distance: parseFloat(school.distance.toFixed(2))
        }));

        return NextResponse.json(formattedSchools);
    } catch (error) {
        console.error('Error fetching nearby schools:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}