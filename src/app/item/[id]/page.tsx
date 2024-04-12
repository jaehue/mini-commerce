"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { gql, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function page() {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const pathname = usePathname();
  const { data } = useQuery(
    gql`
      query GetItemById($id: uuid!) {
        item_by_pk(id: $id) {
          id
          name
          desc
          color_options
          size_options
          image
        }
      }
    `,
    { variables: { id: pathname.replace("/item/", "") } }
  );
  const item = data?.item_by_pk;
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
        <Button onClick={() => alert(`색상: ${color} / 사이즈: ${size}`)}>
          장바구니 담기
        </Button>
      </div>
    </div>
  );
}

export default page;
