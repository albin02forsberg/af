import { NextResponse } from 'next/server'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../../../lib/firebase'


export async function GET() {
  try {
    const examplesCollection = collection(db, 'examples')
    const q = query(examplesCollection, limit(10))
    const snap = await getDocs(q)

      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      console.log('Fetched items from Firestore:', items)
      return NextResponse.json({ items })
    } catch (err) {
    console.error('GET /api/examples error', err)
    return NextResponse.json({ error: 'Failed to fetch examples' }, { status: 500 })
  }
}
