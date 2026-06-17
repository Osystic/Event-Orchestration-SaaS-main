/**
 * External Vendor (suppliers) Business Rules categories and types.
 * Stored as free-text in `suppliers.custom_category` and `suppliers.custom_type`
 * (FK columns set to null). "Other" reveals a manual entry for either field.
 */
import {
  Briefcase,
  Scale,
  Megaphone,
  Sparkles,
  Building,
  Shield,
  Palette,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface SupplierBusinessCategory {
  name: string;
  icon: LucideIcon;
  types: string[];
  /** When true, type dropdown always allows a manual entry. */
  alwaysCustomType?: boolean;
}

export const SUPPLIER_BUSINESS_CATEGORIES: SupplierBusinessCategory[] = [
  {
    name: "3rd Party Suppliers",
    icon: Briefcase,
    types: ["General Supply", "Bulk Order", "Specialty Supply"],
  },
  {
    name: "Public Speaker",
    icon: Megaphone,
    types: ["Keynote", "Panelist", "Emcee", "Workshop Leader"],
  },
  {
    name: "Life Coach",
    icon: Sparkles,
    types: ["Personal Development", "Team Building", "Motivational"],
  },
  {
    name: "Legal",
    icon: Scale,
    types: ["Contract Review", "Permit", "License", "Insurance"],
  },
  {
    name: "Finance",
    icon: Briefcase,
    types: ["Invoice", "Receipt", "Contract", "Payment Processing"],
  },
  {
    name: "Instructor",
    icon: Sparkles,
    types: ["Workshop", "Class", "Seminar", "Training Session"],
  },
  {
    name: "Trainer",
    icon: Sparkles,
    types: ["On-site Training", "Team Workshop", "Skill Development"],
  },
  {
    name: "Security",
    icon: Shield,
    types: ["Event Security", "Access Control", "Crowd Management", "VIP Protection"],
  },
  {
    name: "Event Designer",
    icon: Palette,
    types: ["Stage Design", "Venue Layout", "Theme Design", "Floral Design"],
  },
  {
    name: "Volunteer",
    icon: Users,
    types: ["Event Staff", "Registration", "Usher", "Setup Crew"],
  },
  {
    name: "Event Workers",
    icon: Users,
    types: ["Event Staff", "Bartender", "Catering Staff", "Setup Crew"],
  },
];

export const SUPPLIER_OTHER_CATEGORY = {
  name: "Other",
  icon: Building,
} as const;

export const supplierCategoryByName = (name: string | null | undefined) =>
  SUPPLIER_BUSINESS_CATEGORIES.find((c) => c.name === name);
