export async function getProductDetails(slug: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
        cache: 'no-store',
      });
  
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
  