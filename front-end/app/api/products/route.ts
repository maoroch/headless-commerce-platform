import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  try {
    const products = await getProducts(params);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API /products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}