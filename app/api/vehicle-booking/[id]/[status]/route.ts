import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/configs/auth/authOptions'

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string; status: string }> }
) {
  try {
    const { id, status } = await context.params

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      return NextResponse.json(
        { error: 'Configuración inválida del servidor (API_URL ausente)' },
        { status: 500 }
      )
    }

    if (!session.backendTokens?.accessToken) {
      return NextResponse.json(
        { error: 'Token de acceso no disponible' },
        { status: 401 }
      )
    }
    
    // Llamada al backend
    const backendResponse = await fetch(`${apiUrl}/vehicle-booking/${id}/${status}`, {
      method: 'PATCH',
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.backendTokens.accessToken}`,
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
