import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/configs/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Llamada al backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle-booking/partner/upcoming`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
    })

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'Error al obtener próximos alquileres' },
        { status: backendResponse.status }
      )
    }

    const upcomingBookings = await backendResponse.json()
    
    return NextResponse.json(upcomingBookings)
  } catch (error) {
    console.error('Error en API route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
