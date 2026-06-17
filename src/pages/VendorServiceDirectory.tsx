import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Home, Mail, Wrench, Package, Truck, Music, Armchair } from "lucide-react";
import { DirectoryPageHeader } from "@/components/resource-directory/DirectoryPageHeader";
import { useToast } from "@/hooks/use-toast";
import { commentsPlannerCopy } from "@/lib/nudges";
import { formatDirectoryPrice } from "@/lib/formatDirectoryPrice";
import { DirectoryProfileLink } from "@/components/resource-directory/DirectoryProfileLink";
import { directoryProfileElementId } from "@/lib/directoryProfileLinks";
import { useDirectoryProfileHighlight } from "@/hooks/useDirectoryProfileHighlight";

interface RentalProfile {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  phone_number: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  price: number | null;
  description: string | null;
  rental_type_names: string[];
}

const VendorServiceDirectory = () => {
  const [rentalTypes, setRentalTypes] = useState<{ id: number; name: string }[]>([]);
  const [profiles, setProfiles] = useState<RentalProfile[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const rentalIdParam = useSearchParams()[0].get("rentalId");
  const [rentalPreview, setRentalPreview] = useState<Record<string, unknown> | null>(null);
  const { highlightClass, rentalHighlightClass } = useDirectoryProfileHighlight(loading);

  useEffect(() => {
    if (!rentalIdParam) {
      setRentalPreview(null);
      return;
    }
    let cancelled = false;
    void supabase
      .from("service_rental_buy")
      .select("*")
      .eq("id", rentalIdParam)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setRentalPreview(data ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [rentalIdParam]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [typesRes, rentalsRes, assignmentsRes] = await Promise.all([
        supabase.from("vendor_rental_types").select("id, name").order("name"),
        supabase.from("service_rental_buy").select("*").order("business_name"),
        supabase.from("service_rental_buy_assignments").select("service_rental_buy_id, vendor_rental_type_id"),
      ]);

      if (typesRes.error) console.error("vendor_rental_types:", typesRes.error);
      setRentalTypes(typesRes.data || []);

      const rentals = rentalsRes.data || [];
      const assignments = assignmentsRes.data || [];

      const assignmentMap = new Map<string, number[]>();
      for (const a of assignments) {
        const list = assignmentMap.get(a.service_rental_buy_id) || [];
        list.push(a.vendor_rental_type_id);
        assignmentMap.set(a.service_rental_buy_id, list);
      }

      const typeMap = new Map<number, string>();
      for (const t of typesRes.data || []) {
        typeMap.set(t.id, t.name);
      }

      const merged: RentalProfile[] = rentals.map((r) => ({
        ...r,
        rental_type_names: (assignmentMap.get(r.id) || [])
          .map((tid) => typeMap.get(tid))
          .filter(Boolean) as string[],
      }));

      setProfiles(merged);
    } catch (err: any) {
      console.error("Error fetching rental data:", err);
      toast({ title: "Error", description: "Failed to load rental directory.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesType =
        selectedTypes.length === 0 ||
        p.rental_type_names.some((name) => selectedTypes.includes(name));
      const matchesLocation =
        !locationFilter ||
        p.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        p.state?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        p.zip?.toString().includes(locationFilter);
      return matchesType && matchesLocation;
    });
  }, [profiles, selectedTypes, locationFilter]);

  const getServiceIcon = (typeName: string) => {
    const iconMap: { [key: string]: any } = {
      tent: Home,
      canopy: Home,
      table: Armchair,
      chair: Armchair,
      av: Music,
      lighting: Music,
      linen: Package,
      decor: Package,
      staging: Armchair,
      prop: Armchair,
      transport: Truck,
      logistics: Truck,
      entertainment: Music,
      purchase: Package,
    };
    const lower = typeName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lower.includes(key)) return icon;
    }
    return Wrench;
  };

  return (
    <div className="space-y-6">
      <DirectoryPageHeader
        title="Vendor Service Rental/Buy Directory"
        subtitle="Equipment and rental services for your event"
      />

      <Card>
        <CardHeader>
          <CardTitle>Select Rental Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-center py-4">Loading rental types...</p>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium">Filter by Location</label>
                <Input
                  placeholder="Enter city, state, or zip code"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Rental Types (select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rentalTypes.map((type) => {
                    const isChecked = selectedTypes.includes(type.name);
                    const IconComponent = getServiceIcon(type.name);
                    return (
                      <div key={type.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={`rental-type-${type.id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes([...selectedTypes, type.name]);
                            } else {
                              setSelectedTypes(selectedTypes.filter((n) => n !== type.name));
                            }
                          }}
                        />
                        <label htmlFor={`rental-type-${type.id}`} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                          <IconComponent size={16} />
                          {type.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedTypes.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Selected Types:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTypes.map((name) => (
                      <span key={name} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <Button
            onClick={() => {
              setSelectedTypes([]);
              setLocationFilter("");
            }}
            variant="outline"
            disabled={selectedTypes.length === 0 && !locationFilter}
          >
            Clear All Filters
          </Button>
        </CardContent>
      </Card>

      {rentalPreview && rentalIdParam && typeof rentalPreview.id === "string" ? (
        <Card
          id={`directory-rental-${rentalIdParam}`}
          className={`border-primary/40 bg-muted/30 ${rentalHighlightClass(rentalPreview.id as string)}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Linked equipment / rental partner</CardTitle>
            <p className="text-sm text-muted-foreground font-normal">
              Opened from a shared profile link.
            </p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold">{String(rentalPreview.business_name ?? "Rental partner")}</p>
            <p className="text-muted-foreground">
              {[rentalPreview.city, rentalPreview.state, rentalPreview.zip].filter(Boolean).join(", ") || "—"}
            </p>
            {typeof rentalPreview.email === "string" && rentalPreview.email.trim() ? (
              <a className="text-primary hover:underline" href={`mailto:${rentalPreview.email.trim()}`}>
                {rentalPreview.email}
              </a>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedTypes.length > 0 ? (
              <>{selectedTypes.join(", ")} ({filteredProfiles.length})</>
            ) : (
              <>Rental Profiles ({filteredProfiles.length})</>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading rental profiles...</p>
          ) : filteredProfiles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No rental profiles match your selected criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => {
                const typeName = profile.rental_type_names[0] || "Rental";
                const IconComponent = getServiceIcon(typeName);

                return (
                  <Card
                    key={profile.id}
                    id={directoryProfileElementId(profile.id)}
                    className={`hover:shadow-lg transition-shadow ${highlightClass(profile.id)}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{profile.business_name || "Rental Provider"}</CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {profile.rental_type_names.map((name) => (
                          <span key={name} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {name}
                          </span>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Contact Person</p>
                        <p className="font-semibold">{profile.contact_name || "N/A"}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        {profile.email?.trim() ? (
                          <a
                            href={`mailto:${String(profile.email).trim()}`}
                            className="text-sm text-primary hover:underline break-all"
                          >
                            {profile.email}
                          </a>
                        ) : (
                          <p className="text-sm">N/A</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="text-sm">
                          {[profile.city, profile.state, profile.zip].filter(Boolean).join(", ") || "Location not specified"}
                        </p>
                      </div>

                      {profile.price && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Starting Cost</p>
                          <p className="text-lg font-bold text-primary">
                            {formatDirectoryPrice(profile.price) ?? String(profile.price)}
                          </p>
                        </div>
                      )}

                      {profile.description && (
                        <p className="text-sm text-muted-foreground">{profile.description}</p>
                      )}

                      <div className="flex flex-col gap-2 mt-4">
                        <DirectoryProfileLink kind="service_rental_buy" id={profile.id} className="w-full justify-center py-2 border rounded-md border-border" />
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => (window.location.href = `mailto:${profile.email || ""}`)}
                          disabled={!profile.email}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorServiceDirectory;
