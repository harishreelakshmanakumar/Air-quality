import { NextRequest, NextResponse } from 'next/server';
import { firebase } from '@/lib/firebase';

// GET /api/sensors/history/[roomId]?limit=50
// Fetch historical sensor data from Firebase
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Get recent readings
    const readings = await firebase.getRecentReadings(roomId, limit);
    
    return NextResponse.json({
      success: true,
      data: {
        roomId,
        limit,
        count: readings.length,
        readings,
      },
    });
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sensor history from Firebase' },
      { status: 500 }
    );
  }
}
