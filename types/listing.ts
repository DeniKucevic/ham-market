import { Database } from "./database";

export type BrowseListing = Database["public"]["Tables"]["listings"]["Row"] & {
  profiles: {
    callsign: string;
    display_name: string | null;
    location_city: string | null;
    location_country: string | null;
  } | null;
};

export type MyListing = BrowseListing;
