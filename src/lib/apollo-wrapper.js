"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export function ApolloWrapper({ children }) {
  const { getToken } = useAuth();

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    fetchOptions: { cache: "no-store" },
  });

  const makeClient = useMemo(() => {
    const authMiddleware = setContext(async (_, { headers }) => {
      const token = await getToken({ template: "hasura" });
      if (token) {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        };
      }
      return { headers };
    });

    return () => {
      const link = ApolloLink.from([authMiddleware, httpLink]);

      return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
          typeof window === "undefined"
            ? ApolloLink.from([
                new SSRMultipartLink({ stripDefer: true }),
                link,
              ])
            : link,
      });
    };
  }, [getToken]);

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
