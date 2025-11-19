import { NextRequest, NextResponse } from 'next/server';
import { firebase } from '@/lib/firebase';

// GET /api/sensors/[roomId]
// Fetch latest sensor data from Firebase for a specific room
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId;
    
    // Get latest reading
    const latest = await firebase.getLatestReading(roomId);
    
    if (!latest) {
      return NextResponse.json(
        { success: false, error: 'No sensor data found for this room' },
        { status: 404 }
      );
    }
    
    // Get sensor status
    const status = await firebase.getSensorStatus(roomId);
    
    return NextResponse.json({
      success: true,
      data: {
        roomId,
        latest,
        status,
      },
    });
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sensor data from Firebase' },
      { status: 500 }
    );
  }
}
