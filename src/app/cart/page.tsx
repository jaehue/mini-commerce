"use client";

import { Button } from "@/components/ui/button";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import { Delete } from "lucide-react";
import { useState } from "react";

function CartPage() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const { data, refetch } = useQuery(GET_CART_ITEMS, {
    variables: { user_id: userId },
  });
  const [deleteCart] = useMutation(DELETE_CART);

  const items = data?.items;

  if (!items || items.length === 0)
    return (
      <p className="text-center text-gray-500">장바구니가 비어있습니다.</p>
    );

  return (
    <div className="mx-auto max-w-4xl p-4">
      {items.map((item: any) => (
        <div
          key={item.id}
          className="flex items-center gap-4 p-2 border-b border-gray-200 w-[400px]"
        >
          <img
            src={item.item.image}
            alt="Product image"
            className="w-24 h-24 object-cover rounded-md"
          />
          <div className="flex-grow">
            <h1 className="font-semibold">{item.name}</h1>
            <p className="text-sm text-gray-600">
              {item.options.map((o: any) => `${o.name}: ${o.value}`).join(", ")}
            </p>
            <p>수량: {item.quantity}</p>
            <p className="font-bold">
              가격: ₩{item.total_amount.toLocaleString()}
            </p>
          </div>
          <Button
            variant="outline"
            className="p-2"
            onClick={async () => {
              setLoading(true);
              await deleteCart({ variables: { id: item.id } });
              await refetch();
              setLoading(false);
            }}
            disabled={loading}
          >
            <Delete className="text-red-500" />
          </Button>
        </div>
      ))}
    </div>
  );
}

const GET_CART_ITEMS = gql`
  query GetCartItem($user_id: String!) {
    items: cart(where: { user_id: { _eq: $user_id } }) {
      id
      item_id
      item_price
      name
      options
      quantity
      total_amount
      user_id
      item {
        image
      }
    }
  }
`;

const DELETE_CART = gql`
  mutation DeleteCart($id: uuid!) {
    delete_cart_by_pk(id: $id) {
      id
    }
  }
`;

export default CartPage;
