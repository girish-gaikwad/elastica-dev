<ProductCard.Root
  className="rounded-2xl shadow-lg transition hover:shadow-xl border border-gray-200 bg-white"
  data={product}
>
  <ProductCard.Thumbnail className="relative">
    {/* Badge and Wishlist */}
    <ProductCard.ThumbnailBadge className="absolute top-3 left-3 flex items-center gap-2">
      {product?.tags?.[2] && (
        <ProductCard.Badge className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
          {product.tags[2]}
        </ProductCard.Badge>
      )}
      <ProductCard.WishlistButton className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition" />
    </ProductCard.ThumbnailBadge>

    {/* Product Image */}
    <Link href={`/product/${product.id}`} className="block">
      <ProductCard.Image className="w-full h-64 object-cover rounded-t-2xl" />
    </Link>
  </ProductCard.Thumbnail>

  {/* Product Details */}
  <ProductCard.Content className="p-4">
    <Link href={`/product/${product.id}`} className="block">
      <ProductCard.Name className="text-lg font-semibold text-gray-800 truncate" />
    </Link>

    <div className="flex items-center justify-between mt-2">
      <ProductCard.Ratings />
      <ProductCard.Price className="text-lg font-semibold text-gray-900" />
    </div>

    {/* Add to Cart Button */}
    <ProductCard.AddToCartButton
      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition"
      onClick={() => {
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
      }}
    />
  </ProductCard.Content>
</ProductCard.Root>;
