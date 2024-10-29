import type { PipelineEdDSATicketZuAuthConfig } from "@pcd/passport-interface";

/**
 * We want to match a ticket based on a pairing of event IDs and product IDs.
 * We also want to divide these into categories or "types" of ticket. There
 * are four types, as defined above, and each type has one or more pairs of
 * event and product IDs that qualify a ticket as belonging to that group.
 *
 * With this data, we can classify a user's ticket and use this to make some
 * decisions about what access to grant, or other features to enable or
 * disable.
 */
export const whitelistedTickets: Record<
  TicketTypeName,
  PipelineEdDSATicketZuAuthConfig[]
> = {
  MegaZu: [
    {
      "pcdType": "eddsa-ticket-pcd",
      "publicKey": [
        "1ebfb986fbac5113f8e2c72286fe9362f8e7d211dbc68227a468d7b919e75003",
        "10ec38f11baacad5535525bbe8e343074a483c051aa1616266f3b1df3fb7d204"
      ],
      "productId": "b6d0715e-27be-5bf2-8041-125cc8e89d07",
      "eventId": "70848dea-365b-5838-b36e-f691e3151cbd",
      "eventName": "MegaZu24",
      "productName": "Resident"
    },
    {
      "pcdType": "eddsa-ticket-pcd",
      "publicKey": [
        "1ebfb986fbac5113f8e2c72286fe9362f8e7d211dbc68227a468d7b919e75003",
        "10ec38f11baacad5535525bbe8e343074a483c051aa1616266f3b1df3fb7d204"
      ],
      "productId": "7929010a-d31f-5355-a633-b2e8af4f36db",
      "eventId": "70848dea-365b-5838-b36e-f691e3151cbd",
      "eventName": "MegaZu24",
      "productName": "Core-Organizer"
    }
  ]
};

// Map the above data structure into a simple array of event IDs.
export const supportedEvents = Object.values(whitelistedTickets).flatMap(
  (items) => items.map((item) => item.eventId)
);

/**
 * Use the above data structure to map a ticket's event ID and product ID to
 * a known ticket type, if any exists. Returns undefined if no match is found.
 */
export function matchTicketToType(
  eventIdToMatch: string,
  productIdToMatch: string
): TicketTypeName | undefined {
  for (const name of ticketTypeNames) {
    for (const { eventId, productId } of whitelistedTickets[name]) {
      if (eventId === eventIdToMatch && productId === productIdToMatch) {
        return name;
      }
    }
  }

  return undefined;
}

const ticketTypeNames = [
  "MegaZu"
] as const;
export type TicketTypeName = (typeof ticketTypeNames)[number];
