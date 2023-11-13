import API from '@/services/api/auth'

export async function POST(request: Request) {
  const { params } = await request.json()
  const res = await API.connect(params)

  return Response.json(res)
}