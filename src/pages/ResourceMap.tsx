import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, ExternalLink } from "lucide-react";
import { DirectoryProfileLink } from "@/components/resource-directory/DirectoryProfileLink";

interface VenueRow {
  id: string;
  business_name: string;
  city: string | null;
  state: string | null;
  zip: string | null;
}

function mapsQuery(v: VenueRow): string {
  return [v.business_name, v.city, v.state, v.zip].filter(Boolean).join(", ");
}

const REQUIRED_RESOURCE_LOCATIONS: VenueRow[] = [
  {
    id: "required-nj-newark",
    business_name: "New Jersey Event Resource Hub",
    city: "Newark",
    state: "NJ",
    zip: "07102",
  },
  {
    id: "required-de-wilmington",
    business_name: "Delaware Event Resource Hub",
    city: "Wilmington",
    state: "DE",
    zip: "19801",
  },
  {
    id: "required-pa-east-philadelphia",
    business_name: "PA East Event Resource Hub",
    city: "Philadelphia",
    state: "PA East",
    zip: "19103",
  },
  {
    id: "required-pa-west-pittsburgh",
    business_name: "PA West Event Resource Hub",
    city: "Pittsburgh",
    state: "PA West",
    zip: "15222",
  },
  {
    id: "required-nyc-manhattan",
    business_name: "NYC Manhattan Event Resource Hub",
    city: "Manhattan",
    state: "NYC Boroughs",
    zip: "10001",
  },
  {
    id: "required-nyc-brooklyn",
    business_name: "NYC Brooklyn Event Resource Hub",
    city: "Brooklyn",
    state: "NYC Boroughs",
    zip: "11201",
  },
  {
    id: "required-ma-boston",
    business_name: "Boston Area Event Resource Hub",
    city: "Boston",
    state: "MA Boston Area",
    zip: "02108",
  },
  {
    id: "required-il-chicago",
    business_name: "Chicago Area Event Resource Hub",
    city: "Chicago",
    state: "IL Chicago Area",
    zip: "60601",
  },
  {
    id: "required-ga-atlanta",
    business_name: "Atlanta Metro Event Resource Hub",
    city: "Atlanta",
    state: "GA Atlanta Metro Area",
    zip: "30303",
  },
  {
    id: "required-fl-orlando",
    business_name: "Florida Event Resource Hub",
    city: "Orlando",
    state: "FL",
    zip: "32801",
  },
];

export default function ResourceMap() {
  const { toast } = useToast();
  const [venues, setVenues] = useState<VenueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("venues")
        .select("id, business_name, city, state, zip")
        .order("business_name");

      if (error) {
        toast({
          variant: "destructive",
          title: "Could not load venues",
          description: error.message,
        });
        setVenues(REQUIRED_RESOURCE_LOCATIONS);
      } else {
        setVenues([
          ...((data ?? []) as VenueRow[]),
          ...REQUIRED_RESOURCE_LOCATIONS,
        ]);
      }
      setLoading(false);
    };
    void load();
  }, []);

const filtered = useMemo(() => {
  const q = filter.trim().toLowerCase();
  if (!q) return venues;

  const exactStateMatches = venues.filter(
    (v) => (v.state ?? "").toLowerCase() === q
  );

  if (exactStateMatches.length > 0) {
    return exactStateMatches;
  }

  return venues.filter(
    (v) =>
      v.business_name.toLowerCase().includes(q) ||
      (v.city ?? "").toLowerCase().includes(q) ||
      (v.state ?? "").toLowerCase().includes(q)
  );
}, [venues, filter]);

  const byLocation = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of filtered) {
      const key = [v.city, v.state].filter(Boolean).join(", ") || "Unknown";
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MapPin className="h-8 w-8 text-primary" />
          Resource map
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Multi-location venue directory (Deliverable 2). Open any row in Google Maps; filter by name, city, or state.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>
            {byLocation.length > 0 && (
              <span className="block mt-2 text-xs">
                {byLocation.slice(0, 5).map(([loc, n]) => (
                  <span key={loc} className="mr-3">
                    {loc}: {n}
                  </span>
                ))}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Filter by name, city, or state…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground">No venues match.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {filtered.map((v) => {
                const q = mapsQuery(v);
                const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
                return (
                  <li
                    key={v.id}
                    className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{v.business_name}</div>
                      <div className="text-muted-foreground">
                        {[v.city, v.state, v.zip].filter(Boolean).join(", ") || "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DirectoryProfileLink kind="venue" id={v.id} className="text-sm" label="Directory profile" />
                      <Button variant="outline" size="sm" asChild>
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Map
                        </a>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}