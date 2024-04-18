"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function page() {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [insertCartOne] = useMutation(INSERT_CART_ONE);
  const { isSignedIn, userId } = useAuth();
  const clerk = useClerk();

  const pathname = usePathname();
  const { data } = useQuery(GET_ITEM_BY_ID, {
    variables: { id: pathname.replace("/item/", "") },
  });
  const item = data?.item_by_pk;

  const handleAddToCart = () => {
    if (!isSignedIn) {
      clerk.openSignIn({
        redirectUrl: pathname,
      });
      return;
    }
    insertCartOne({
      variables: {
        object: {
          item_id: item.id,
          item_price: item.price,
          name: item.name,
          options: [
            {
              name: "color",
              value: color,
            },
            {
              name: "size",
              value: size,
            },
          ],
          quantity: quantity,
          total_amount: item.price * quantity,
          user_id: userId,
        },
      },
    });
  };

  if (!item) return null;

  return (
    <div className="flex gap-4 p-4 bg-white shadow-md rounded-lg">
      <img
        src={item.image}
        alt={item.name}
        className="w-96 h-96 object-cover rounded-lg"
      />
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-2xl text-gray-800">{item.name}</h2>
          <p className="text-gray-600 mt-2">{item.desc}</p>
          <p className="font-bold">{item.price}원</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mt-4">색상:</p>
          <RadioGroup
            value={color}
            onValueChange={(v) => setColor(v)}
            className="mt-1 flex"
          >
            {item.color_options.map((color: any) => (
              <div key={color} className="flex items-center space-x-2">
                <RadioGroupItem value={color} id={`color-${color}`} />
                <Label htmlFor={`color-${color}`}>{color}</Label>
              </div>
            ))}
          </RadioGroup>
          <p className="font-semibold text-gray-800 mt-4">사이즈:</p>
          <RadioGroup
            value={size}
            onValueChange={(v) => setSize(v)}
            className="mt-1 flex"
          >
            {item.size_options.map((size: any) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label className="mt-4">수량: </Label>
          <input
            type="number"
            className="w-16 h-10 px-2 py-1 border border-gray-300 rounded-md"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <Button onClick={handleAddToCart}>장바구니 담기</Button>
      </div>
    </div>
  );
}

const GET_ITEM_BY_ID = gql`
  query GetItemById($id: uuid!) {
    item_by_pk(id: $id) {
      id
      name
      desc
      color_options
      size_options
      image
      price
    }
  }
`;
const INSERT_CART_ONE = gql`
  mutation InsertCartOne($object: cart_insert_input!) {
    insert_cart_one(object: $object) {
      id
    }
  }
`;

export default page;
