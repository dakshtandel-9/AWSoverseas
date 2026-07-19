import {
  Plane,
  Ship,
  PackageCheck,
  PackageOpen,
  Warehouse,
  ShieldCheck,
  Container as ContainerIcon,
  Boxes,
  Globe2,
  BadgeDollarSign,
  Truck,
  Clock,
  Users,
  Radar,
  Factory,
  ShoppingCart,
  Pill,
  Car,
  Cpu,
  Shirt,
  Store,
  Wheat,
  Footprints,
  UtensilsCrossed,
  Tractor,
  Syringe,
  FlaskConical,
  Layers,
  Leaf,
  Armchair,
  Search,
  type LucideIcon,
} from "lucide-react";

/** Map a service/feature title (from JSON) to a representative Lucide icon. */
export function iconFor(label: string): LucideIcon {
  const k = label.toLowerCase();
  if (k.includes("air")) return Plane;
  if (k.includes("sea") || k.includes("ocean")) return Ship;
  if (k.includes("fcl") || k.includes("full container")) return ContainerIcon;
  if (k.includes("lcl") || k.includes("less than")) return Boxes;
  if (k.includes("import")) return PackageCheck;
  if (k.includes("export")) return PackageOpen;
  if (k.includes("customs")) return ShieldCheck;
  if (k.includes("warehous") || k.includes("storage") || k.includes("distribution"))
    return Warehouse;
  if (k.includes("network") || k.includes("global") || k.includes("worldwide"))
    return Globe2;
  if (k.includes("pric") || k.includes("cost") || k.includes("transparent"))
    return BadgeDollarSign;
  if (k.includes("secure") || k.includes("safe")) return ShieldCheck;
  if (k.includes("team") || k.includes("experienc") || k.includes("expert"))
    return Users;
  if (k.includes("track") || k.includes("real-time") || k.includes("real time"))
    return Radar;
  if (k.includes("support") || k.includes("24")) return Clock;
  if (k.includes("door") || k.includes("delivery")) return Truck;
  if (k.includes("sourcing") || k.includes("supplier") || k.includes("procurement")) return Search;
  if (k.includes("verif") || k.includes("inspect") || k.includes("quality")) return ShieldCheck;
  if (k.includes("document")) return PackageCheck;
  if (k.includes("freight forward")) return Ship;
  // Industry-specific icons
  if (k.includes("manufactur")) return Factory;
  if (k.includes("ecommerce") || k.includes("e-commerce")) return ShoppingCart;
  if (k.includes("pharma") || k.includes("pharmaceutical")) return Pill;
  if (k.includes("auto")) return Car;
  if (k.includes("electron")) return Cpu;
  if (k.includes("textile") || k.includes("apparel") || k.includes("fashion")) return Shirt;
  if (k.includes("retail")) return Store;
  // Product/commodity icons
  if (k.includes("grain") || k.includes("wheat") || k.includes("rice")) return Wheat;
  if (k.includes("garment") || k.includes("fabric") || k.includes("apparel")) return Shirt;
  if (k.includes("footwear") || k.includes("shoe") || k.includes("leather")) return Footprints;
  if (k.includes("utensil") || k.includes("steel") || k.includes("kitchenware")) return UtensilsCrossed;
  if (k.includes("tractor") || k.includes("machinery") || k.includes("agricultural equipment")) return Tractor;
  if (k.includes("syringe") || k.includes("medical equipment")) return Syringe;
  if (k.includes("chemical") || k.includes("hazmat") || k.includes("hazardous")) return FlaskConical;
  if (k.includes("activated carbon") || k.includes("carbon")) return Layers;
  if (k.includes("spice")) return Leaf;
  if (k.includes("furniture")) return Armchair;
  return Boxes;
}
