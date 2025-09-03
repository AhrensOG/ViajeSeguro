import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; status: string } }
) {
  try {
    const { id, status } = params
    
    // Llamada al backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle-booking/${id}/${status}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'Error al actualizar estado en el backend' },
        { status: backendResponse.status }
      )
    }

    const result = await backendResponse.json()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error en API route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
