import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

export function ItemList() {
  const { data } = useQuery(gql`
    query GetItems {
      item {
        id
        name
        desc
        price
        color_options
        size_options
        image
      }
    }
  `);
  const items = data?.item;
  return (
    <div className="grid grid-cols-4 gap-4">
      {items?.map((item: any) => (
        <Link
          key={item.id}
          className="flex flex-col items-center"
          href={`/item/${item.id}`}
        >
          <img
            alt="White Crocs"
            className="mb-2"
            height="150"
            src={item.image}
            style={{
              aspectRatio: "150/150",
              objectFit: "cover",
            }}
            width="150"
          />
          <div className="mb-1 text-xs">{item.name}</div>
          <div className="mb-1 text-sm">{item.title}</div>
          <div className="mb-1 text-lg font-bold">{item.price}원</div>
        </Link>
      ))}
    </div>
  );
}
