import { getUserProfile } from '@/lib/getUserProfile'

export async function GET() {
  try {
    const profile = await getUserProfile()
    if (!profile) return Response.json({ user: null }, { status: 401 })
    return Response.json({
      user: { id: profile.id, role: profile.role, name: profile.name }
    })
  } catch {
    return Response.json({ user: null }, { status: 401 })
  }
}