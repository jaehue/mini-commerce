import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import path from "path";
import { useEffect } from "react";

export function useCart() {
  const { userId } = useAuth();
  const clerk = useClerk();
  const pathname = usePathname();
  const [loadCart, { data, refetch }] = useLazyQuery(GET_CART_ITEMS);
  const [insertCartOne] = useMutation(INSERT_CART_ONE);
  const [deleteCart] = useMutation(DELETE_CART);

  const items = data?.items ?? [];

  useEffect(() => {
    if (userId) {
      loadCart({ variables: { user_id: userId } });
    }
  }, [userId]);

  const addToCart = async (item: any) => {
    if (userId === null) {
      clerk.openSignIn({ redirectUrl: pathname });
      return;
    }
    await insertCartOne({
      variables: {
        object: {
          ...item,
          user_id: userId,
        },
      },
    });
    refetch();
  };

  return {
    items,
    refetch,
    addToCart,
    deleteItem: async (id: string) => {
      await deleteCart({ variables: { id } });
      refetch();
    },
  };
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
const INSERT_CART_ONE = gql`
  mutation InsertCartOne($object: cart_insert_input!) {
    insert_cart_one(object: $object) {
      id
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
