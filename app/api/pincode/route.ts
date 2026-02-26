
import { NextResponse } from 'next/server';
import pincodeData from '@/lib/data/pincodes.json';

// Define the shape of the pincode data
interface PincodeRecord {
    officeName: string;
    pincode: number;
    taluk: string;
    districtName: string;
    stateName: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('code');

    if (!pincode) {
        return NextResponse.json({ error: 'Pincode is required' }, { status: 400 });
    }

    try {
        const code = parseInt(pincode, 10);

        // Filter the dataset
        // We import the JSON directly, which Next.js handles.
        // Casting to unknown first because TS might infer strictly from the JSON file import if not typed
        const records = (pincodeData as unknown as PincodeRecord[]).filter(
            (record) => record.pincode === code
        );

        if (records.length === 0) {
            return NextResponse.json({ valid: false, message: 'Pincode not found' }, { status: 404 });
        }

        // Extract unique cities/districts/states to send back a cleaner response
        // We include District, Taluk, and Office Name (stripped of B.O/S.O) as valid "City" matches
        const validLocations = new Set<string>();

        records.forEach(record => {
            validLocations.add(record.districtName);
            validLocations.add(record.taluk);
            // Clean office name: "Ada B.O" -> "Ada"
            const cleanOfficeName = record.officeName.replace(/\s*[BS]\.O(\s*\(.*\))?$/, '');
            validLocations.add(cleanOfficeName);
        });

        return NextResponse.json({
            valid: true,
            state: records[0].stateName,
            district: records[0].districtName,
            places: Array.from(validLocations),
            records: records // Sending full records just in case
        });

    } catch (error) {
        console.error('Error processing pincode request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
