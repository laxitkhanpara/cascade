export type CitySeed = {
  id: string;
  name: string;
  country: string;
  hazard: string;
};

export type FactorySeed = {
  id: string;
  name: string;
  cityId: string;
};

export type SupplierSeed = {
  id: string;
  name: string;
  tier: number;
  factoryId: string;
};

export type ComponentSeed = {
  id: string;
  name: string;
  category: string;
  criticality: "critical" | "standard";
};

export type ProductSeed = {
  id: string;
  name: string;
  category: string;
  asp: number;
};

export const cities: CitySeed[] = [
  { id: "city-harrodsburg", name: "Harrodsburg", country: "USA", hazard: "tornado" },
  { id: "city-tainan", name: "Tainan", country: "Taiwan", hazard: "typhoon" },
  { id: "city-hsinchu", name: "Hsinchu", country: "Taiwan", hazard: "earthquake" },
  { id: "city-kumamoto", name: "Kumamoto", country: "Japan", hazard: "earthquake" },
  { id: "city-shenzhen", name: "Shenzhen", country: "China", hazard: "flood" },
  { id: "city-suzhou", name: "Suzhou", country: "China", hazard: "flood" },
  { id: "city-penang", name: "Penang", country: "Malaysia", hazard: "flood" },
  { id: "city-hcmc", name: "Ho Chi Minh City", country: "Vietnam", hazard: "flood" },
  { id: "city-guadalajara", name: "Guadalajara", country: "Mexico", hazard: "earthquake" },
  { id: "city-eindhoven", name: "Eindhoven", country: "Netherlands", hazard: "flood" },
  { id: "city-austin", name: "Austin", country: "USA", hazard: "storm" },
];

export const factories: FactorySeed[] = [
  { id: "fac-aurora", name: "Aurora Draw Plant", cityId: "city-harrodsburg" },
  { id: "fac-nimbus", name: "Nimbus Fab 18", cityId: "city-tainan" },
  { id: "fac-summit", name: "Summit OSAT", cityId: "city-tainan" },
  { id: "fac-lattice", name: "Lattice OLED Fab", cityId: "city-hsinchu" },
  { id: "fac-northstar", name: "Northstar Sensor Works", cityId: "city-kumamoto" },
  { id: "fac-axis", name: "Axis Precision", cityId: "city-kumamoto" },
  { id: "fac-tide", name: "Tide Microelectronics", cityId: "city-shenzhen" },
  { id: "fac-nest", name: "Nest Audio Line", cityId: "city-shenzhen" },
  { id: "fac-volt", name: "VoltCell Gigafloor", cityId: "city-suzhou" },
  { id: "fac-harbor", name: "Harbor NAND Campus", cityId: "city-penang" },
  { id: "fac-drift", name: "Drift DRAM Fab", cityId: "city-penang" },
  { id: "fac-cellrite", name: "Cellrite Pack Line", cityId: "city-penang" },
  { id: "fac-quanta", name: "Quanta Chassis Works", cityId: "city-hcmc" },
  { id: "fac-helix", name: "Helix RF Plant", cityId: "city-guadalajara" },
  { id: "fac-photon", name: "Photon Optics", cityId: "city-eindhoven" },
  { id: "fac-copperline", name: "Copperline Power Fab", cityId: "city-austin" },
  { id: "fac-pulse", name: "Pulse Haptics", cityId: "city-austin" },
];

export const suppliers: SupplierSeed[] = [
  { id: "sup-aurora", name: "Aurora Glass", tier: 2, factoryId: "fac-aurora" },
  { id: "sup-nimbus", name: "Nimbus Silicon", tier: 1, factoryId: "fac-nimbus" },
  { id: "sup-summit", name: "Summit Substrates", tier: 2, factoryId: "fac-summit" },
  { id: "sup-lattice", name: "Lattice Displays", tier: 1, factoryId: "fac-lattice" },
  { id: "sup-northstar", name: "Northstar Sensors", tier: 1, factoryId: "fac-northstar" },
  { id: "sup-axis", name: "Axis Actuators", tier: 2, factoryId: "fac-axis" },
  { id: "sup-tide", name: "Tide Touch", tier: 2, factoryId: "fac-tide" },
  { id: "sup-nest", name: "Nest Audio", tier: 2, factoryId: "fac-nest" },
  { id: "sup-volt", name: "VoltCell", tier: 1, factoryId: "fac-volt" },
  { id: "sup-harbor", name: "Harbor Memory", tier: 1, factoryId: "fac-harbor" },
  { id: "sup-drift", name: "Drift DRAM", tier: 1, factoryId: "fac-drift" },
  { id: "sup-cellrite", name: "Cellrite", tier: 2, factoryId: "fac-cellrite" },
  { id: "sup-quanta", name: "Quanta Frame", tier: 2, factoryId: "fac-quanta" },
  { id: "sup-helix", name: "Helix RF", tier: 2, factoryId: "fac-helix" },
  { id: "sup-photon", name: "Photon Optics", tier: 2, factoryId: "fac-photon" },
  { id: "sup-copperline", name: "Copperline", tier: 2, factoryId: "fac-copperline" },
  { id: "sup-pulse", name: "Pulse Haptics", tier: 2, factoryId: "fac-pulse" },
];

export const components: ComponentSeed[] = [
  { id: "cmp-cover-glass", name: "Ion-strengthened cover glass", category: "optics", criticality: "critical" },
  { id: "cmp-oled-6p1", name: "6.1-inch OLED panel", category: "display", criticality: "critical" },
  { id: "cmp-oled-6p7", name: "6.7-inch OLED panel", category: "display", criticality: "critical" },
  { id: "cmp-oled-watch", name: "1.9-inch micro-OLED", category: "display", criticality: "standard" },
  { id: "cmp-oled-14", name: "14-inch OLED panel", category: "display", criticality: "critical" },
  { id: "cmp-oled-16", name: "16-inch OLED panel", category: "display", criticality: "critical" },
  { id: "cmp-touch-ic", name: "Touch controller IC", category: "silicon", criticality: "standard" },
  { id: "cmp-sensor-wide", name: "Wide image sensor", category: "imaging", criticality: "critical" },
  { id: "cmp-sensor-ultra", name: "Ultrawide image sensor", category: "imaging", criticality: "standard" },
  { id: "cmp-sensor-sec", name: "Security camera sensor", category: "imaging", criticality: "standard" },
  { id: "cmp-lens-wide", name: "Wide camera lens", category: "optics", criticality: "standard" },
  { id: "cmp-lens-ultra", name: "Ultrawide camera lens", category: "optics", criticality: "standard" },
  { id: "cmp-ois", name: "OIS actuator", category: "mechanical", criticality: "standard" },
  { id: "cmp-soc-a1", name: "Helios A1 SoC die", category: "silicon", criticality: "critical" },
  { id: "cmp-soc-b1", name: "Helios B1 SoC die", category: "silicon", criticality: "critical" },
  { id: "cmp-soc-w1", name: "Helios W1 SoC die", category: "silicon", criticality: "critical" },
  { id: "cmp-substrate", name: "FCBGA substrate", category: "packaging", criticality: "critical" },
  { id: "cmp-nand-256", name: "256GB NAND", category: "memory", criticality: "critical" },
  { id: "cmp-nand-512", name: "512GB NAND", category: "memory", criticality: "critical" },
  { id: "cmp-dram-8", name: "8GB LPDDR", category: "memory", criticality: "critical" },
  { id: "cmp-dram-16", name: "16GB LPDDR", category: "memory", criticality: "critical" },
  { id: "cmp-batt-phone", name: "Phone battery cell", category: "power", criticality: "standard" },
  { id: "cmp-batt-laptop", name: "Laptop battery pack", category: "power", criticality: "standard" },
  { id: "cmp-batt-watch", name: "Coin cell battery", category: "power", criticality: "standard" },
  { id: "cmp-frame-phone", name: "Phone aluminum frame", category: "mechanical", criticality: "standard" },
  { id: "cmp-frame-laptop", name: "Laptop unibody", category: "mechanical", criticality: "standard" },
  { id: "cmp-rf-5g", name: "5G RF module", category: "radio", criticality: "critical" },
  { id: "cmp-rf-wifi", name: "Wi-Fi 6E module", category: "radio", criticality: "standard" },
  { id: "cmp-pmic", name: "Power management IC", category: "silicon", criticality: "critical" },
  { id: "cmp-speaker", name: "Micro speaker", category: "audio", criticality: "standard" },
  { id: "cmp-haptic", name: "Haptic engine", category: "mechanical", criticality: "standard" },
  { id: "cmp-audio-ic", name: "Audio driver IC", category: "silicon", criticality: "standard" },
  { id: "cmp-ear-driver", name: "Earbud balanced armature", category: "audio", criticality: "standard" },
  { id: "cmp-keyboard", name: "Laptop keyboard deck", category: "mechanical", criticality: "standard" },
  { id: "cmp-trackpad", name: "Haptic trackpad", category: "mechanical", criticality: "standard" },
  { id: "cmp-ga-brick", name: "GaN power brick", category: "power", criticality: "standard" },

  { id: "cmp-display-phone-pro", name: "Phone Pro display assembly", category: "assembly", criticality: "critical" },
  { id: "cmp-display-phone", name: "Phone display assembly", category: "assembly", criticality: "critical" },
  { id: "cmp-display-watch", name: "Watch display assembly", category: "assembly", criticality: "standard" },
  { id: "cmp-display-14", name: "14-inch display assembly", category: "assembly", criticality: "critical" },
  { id: "cmp-display-16", name: "16-inch display assembly", category: "assembly", criticality: "critical" },
  { id: "cmp-cam-main", name: "Main camera module", category: "assembly", criticality: "critical" },
  { id: "cmp-cam-ultra", name: "Ultrawide camera module", category: "assembly", criticality: "standard" },
  { id: "cmp-soc-pkg-phone", name: "Phone SoC package", category: "assembly", criticality: "critical" },
  { id: "cmp-soc-pkg-laptop", name: "Laptop SoC package", category: "assembly", criticality: "critical" },
  { id: "cmp-soc-pkg-watch", name: "Watch SoC package", category: "assembly", criticality: "critical" },
  { id: "cmp-mem-phone", name: "Phone memory stack", category: "assembly", criticality: "critical" },
  { id: "cmp-mem-phone-pro", name: "Phone Pro memory stack", category: "assembly", criticality: "critical" },
  { id: "cmp-mem-laptop", name: "Laptop memory stack", category: "assembly", criticality: "critical" },
  { id: "cmp-mlb-phone", name: "Phone logic board", category: "assembly", criticality: "critical" },
  { id: "cmp-mlb-phone-pro", name: "Phone Pro logic board", category: "assembly", criticality: "critical" },
  { id: "cmp-mlb-laptop", name: "Laptop logic board", category: "assembly", criticality: "critical" },
  { id: "cmp-mlb-watch", name: "Watch logic board", category: "assembly", criticality: "critical" },
  { id: "cmp-mlb-tab", name: "Tablet logic board", category: "assembly", criticality: "critical" },
  { id: "cmp-audio-buds", name: "Earbud acoustic assembly", category: "assembly", criticality: "standard" },
];

export const suppliedBy: {
  componentId: string;
  supplierId: string;
  leadDays: number;
  soleSource: boolean;
}[] = [
  { componentId: "cmp-cover-glass", supplierId: "sup-aurora", leadDays: 35, soleSource: true },
  { componentId: "cmp-oled-6p1", supplierId: "sup-lattice", leadDays: 28, soleSource: true },
  { componentId: "cmp-oled-6p7", supplierId: "sup-lattice", leadDays: 28, soleSource: true },
  { componentId: "cmp-oled-watch", supplierId: "sup-lattice", leadDays: 21, soleSource: true },
  { componentId: "cmp-oled-14", supplierId: "sup-lattice", leadDays: 40, soleSource: true },
  { componentId: "cmp-oled-16", supplierId: "sup-lattice", leadDays: 40, soleSource: true },
  { componentId: "cmp-touch-ic", supplierId: "sup-tide", leadDays: 18, soleSource: true },
  { componentId: "cmp-sensor-wide", supplierId: "sup-northstar", leadDays: 30, soleSource: true },
  { componentId: "cmp-sensor-ultra", supplierId: "sup-northstar", leadDays: 30, soleSource: true },
  { componentId: "cmp-sensor-sec", supplierId: "sup-northstar", leadDays: 24, soleSource: true },
  { componentId: "cmp-lens-wide", supplierId: "sup-photon", leadDays: 22, soleSource: true },
  { componentId: "cmp-lens-ultra", supplierId: "sup-photon", leadDays: 22, soleSource: true },
  { componentId: "cmp-ois", supplierId: "sup-axis", leadDays: 20, soleSource: true },
  { componentId: "cmp-soc-a1", supplierId: "sup-nimbus", leadDays: 45, soleSource: true },
  { componentId: "cmp-soc-b1", supplierId: "sup-nimbus", leadDays: 45, soleSource: true },
  { componentId: "cmp-soc-w1", supplierId: "sup-nimbus", leadDays: 40, soleSource: true },
  { componentId: "cmp-substrate", supplierId: "sup-summit", leadDays: 25, soleSource: true },
  { componentId: "cmp-nand-256", supplierId: "sup-harbor", leadDays: 21, soleSource: true },
  { componentId: "cmp-nand-512", supplierId: "sup-harbor", leadDays: 21, soleSource: true },
  { componentId: "cmp-dram-8", supplierId: "sup-drift", leadDays: 21, soleSource: true },
  { componentId: "cmp-dram-16", supplierId: "sup-drift", leadDays: 21, soleSource: true },
  { componentId: "cmp-batt-phone", supplierId: "sup-volt", leadDays: 16, soleSource: true },
  { componentId: "cmp-batt-laptop", supplierId: "sup-volt", leadDays: 18, soleSource: false },
  { componentId: "cmp-batt-laptop", supplierId: "sup-cellrite", leadDays: 20, soleSource: false },
  { componentId: "cmp-batt-watch", supplierId: "sup-volt", leadDays: 14, soleSource: true },
  { componentId: "cmp-frame-phone", supplierId: "sup-quanta", leadDays: 12, soleSource: true },
  { componentId: "cmp-frame-laptop", supplierId: "sup-quanta", leadDays: 16, soleSource: true },
  { componentId: "cmp-rf-5g", supplierId: "sup-helix", leadDays: 19, soleSource: true },
  { componentId: "cmp-rf-wifi", supplierId: "sup-helix", leadDays: 16, soleSource: true },
  { componentId: "cmp-pmic", supplierId: "sup-copperline", leadDays: 18, soleSource: false },
  { componentId: "cmp-pmic", supplierId: "sup-helix", leadDays: 22, soleSource: false },
  { componentId: "cmp-speaker", supplierId: "sup-nest", leadDays: 14, soleSource: true },
  { componentId: "cmp-haptic", supplierId: "sup-pulse", leadDays: 15, soleSource: true },
  { componentId: "cmp-audio-ic", supplierId: "sup-copperline", leadDays: 14, soleSource: true },
  { componentId: "cmp-ear-driver", supplierId: "sup-photon", leadDays: 18, soleSource: true },
  { componentId: "cmp-keyboard", supplierId: "sup-quanta", leadDays: 12, soleSource: true },
  { componentId: "cmp-trackpad", supplierId: "sup-tide", leadDays: 14, soleSource: true },
  { componentId: "cmp-ga-brick", supplierId: "sup-copperline", leadDays: 10, soleSource: true },
];

export const contains: { parent: string; child: string; qty: number }[] = [
  { parent: "cmp-display-phone-pro", child: "cmp-cover-glass", qty: 1 },
  { parent: "cmp-display-phone-pro", child: "cmp-oled-6p7", qty: 1 },
  { parent: "cmp-display-phone-pro", child: "cmp-touch-ic", qty: 1 },
  { parent: "cmp-display-phone", child: "cmp-cover-glass", qty: 1 },
  { parent: "cmp-display-phone", child: "cmp-oled-6p1", qty: 1 },
  { parent: "cmp-display-phone", child: "cmp-touch-ic", qty: 1 },
  { parent: "cmp-display-watch", child: "cmp-cover-glass", qty: 1 },
  { parent: "cmp-display-watch", child: "cmp-oled-watch", qty: 1 },
  { parent: "cmp-display-watch", child: "cmp-touch-ic", qty: 1 },
  { parent: "cmp-display-14", child: "cmp-cover-glass", qty: 1 },
  { parent: "cmp-display-14", child: "cmp-oled-14", qty: 1 },
  { parent: "cmp-display-14", child: "cmp-touch-ic", qty: 1 },
  { parent: "cmp-display-16", child: "cmp-cover-glass", qty: 1 },
  { parent: "cmp-display-16", child: "cmp-oled-16", qty: 1 },
  { parent: "cmp-display-16", child: "cmp-touch-ic", qty: 1 },
  { parent: "cmp-cam-main", child: "cmp-sensor-wide", qty: 1 },
  { parent: "cmp-cam-main", child: "cmp-lens-wide", qty: 1 },
  { parent: "cmp-cam-main", child: "cmp-ois", qty: 1 },
  { parent: "cmp-cam-ultra", child: "cmp-sensor-ultra", qty: 1 },
  { parent: "cmp-cam-ultra", child: "cmp-lens-ultra", qty: 1 },
  { parent: "cmp-cam-ultra", child: "cmp-ois", qty: 1 },
  { parent: "cmp-soc-pkg-phone", child: "cmp-soc-a1", qty: 1 },
  { parent: "cmp-soc-pkg-phone", child: "cmp-substrate", qty: 1 },
  { parent: "cmp-soc-pkg-laptop", child: "cmp-soc-b1", qty: 1 },
  { parent: "cmp-soc-pkg-laptop", child: "cmp-substrate", qty: 1 },
  { parent: "cmp-soc-pkg-watch", child: "cmp-soc-w1", qty: 1 },
  { parent: "cmp-soc-pkg-watch", child: "cmp-substrate", qty: 1 },
  { parent: "cmp-mem-phone", child: "cmp-nand-256", qty: 1 },
  { parent: "cmp-mem-phone", child: "cmp-dram-8", qty: 1 },
  { parent: "cmp-mem-phone-pro", child: "cmp-nand-512", qty: 1 },
  { parent: "cmp-mem-phone-pro", child: "cmp-dram-8", qty: 1 },
  { parent: "cmp-mem-laptop", child: "cmp-nand-512", qty: 1 },
  { parent: "cmp-mem-laptop", child: "cmp-dram-16", qty: 1 },
  { parent: "cmp-mlb-phone", child: "cmp-soc-pkg-phone", qty: 1 },
  { parent: "cmp-mlb-phone", child: "cmp-mem-phone", qty: 1 },
  { parent: "cmp-mlb-phone", child: "cmp-pmic", qty: 1 },
  { parent: "cmp-mlb-phone", child: "cmp-rf-5g", qty: 1 },
  { parent: "cmp-mlb-phone-pro", child: "cmp-soc-pkg-phone", qty: 1 },
  { parent: "cmp-mlb-phone-pro", child: "cmp-mem-phone-pro", qty: 1 },
  { parent: "cmp-mlb-phone-pro", child: "cmp-pmic", qty: 1 },
  { parent: "cmp-mlb-phone-pro", child: "cmp-rf-5g", qty: 1 },
  { parent: "cmp-mlb-laptop", child: "cmp-soc-pkg-laptop", qty: 1 },
  { parent: "cmp-mlb-laptop", child: "cmp-mem-laptop", qty: 1 },
  { parent: "cmp-mlb-laptop", child: "cmp-pmic", qty: 1 },
  { parent: "cmp-mlb-laptop", child: "cmp-rf-wifi", qty: 1 },
  { parent: "cmp-mlb-watch", child: "cmp-soc-pkg-watch", qty: 1 },
  { parent: "cmp-mlb-watch", child: "cmp-pmic", qty: 1 },
  { parent: "cmp-mlb-watch", child: "cmp-rf-wifi", qty: 1 },
  { parent: "cmp-mlb-tab", child: "cmp-soc-pkg-phone", qty: 1 },
  { parent: "cmp-mlb-tab", child: "cmp-mem-phone", qty: 1 },
  { parent: "cmp-mlb-tab", child: "cmp-pmic", qty: 1 },
  { parent: "cmp-mlb-tab", child: "cmp-rf-wifi", qty: 1 },
  { parent: "cmp-audio-buds", child: "cmp-ear-driver", qty: 2 },
  { parent: "cmp-audio-buds", child: "cmp-audio-ic", qty: 1 },
  { parent: "cmp-audio-buds", child: "cmp-speaker", qty: 2 },
  { parent: "cmp-audio-buds", child: "cmp-batt-watch", qty: 2 },
];

export const products: ProductSeed[] = [
  { id: "prd-phone-pro", name: "Helios Phone Pro", category: "phone", asp: 1199 },
  { id: "prd-phone-mini", name: "Helios Phone Mini", category: "phone", asp: 799 },
  { id: "prd-phone-se", name: "Helios Phone SE", category: "phone", asp: 549 },
  { id: "prd-book-14", name: "Helios Book 14", category: "laptop", asp: 1499 },
  { id: "prd-book-16", name: "Helios Book 16", category: "laptop", asp: 2199 },
  { id: "prd-tab-11", name: "Helios Tab 11", category: "tablet", asp: 899 },
  { id: "prd-pad-mini", name: "Helios Pad Mini", category: "tablet", asp: 599 },
  { id: "prd-buds", name: "Helios Buds", category: "audio", asp: 149 },
  { id: "prd-buds-pro", name: "Helios Buds Pro", category: "audio", asp: 249 },
  { id: "prd-watch", name: "Helios Watch", category: "wearable", asp: 399 },
  { id: "prd-watch-ultra", name: "Helios Watch Ultra", category: "wearable", asp: 749 },
  { id: "prd-hub", name: "Helios Hub", category: "home", asp: 179 },
  { id: "prd-cam", name: "Helios Cam", category: "home", asp: 129 },
  { id: "prd-fold", name: "Helios Fold", category: "phone", asp: 1799 },
  { id: "prd-studio", name: "Helios Studio Display", category: "display", asp: 1599 },
];

export const assembledFrom: { productId: string; componentId: string; qty: number }[] = [
  { productId: "prd-phone-pro", componentId: "cmp-display-phone-pro", qty: 1 },
  { productId: "prd-phone-pro", componentId: "cmp-cam-main", qty: 1 },
  { productId: "prd-phone-pro", componentId: "cmp-cam-ultra", qty: 1 },
  { productId: "prd-phone-pro", componentId: "cmp-mlb-phone-pro", qty: 1 },
  { productId: "prd-phone-pro", componentId: "cmp-batt-phone", qty: 1 },
  { productId: "prd-phone-pro", componentId: "cmp-frame-phone", qty: 1 },
  { productId: "prd-phone-pro", componentId: "cmp-haptic", qty: 1 },
  { productId: "prd-phone-pro", componentId: "cmp-speaker", qty: 2 },

  { productId: "prd-phone-mini", componentId: "cmp-display-phone", qty: 1 },
  { productId: "prd-phone-mini", componentId: "cmp-cam-main", qty: 1 },
  { productId: "prd-phone-mini", componentId: "cmp-mlb-phone", qty: 1 },
  { productId: "prd-phone-mini", componentId: "cmp-batt-phone", qty: 1 },
  { productId: "prd-phone-mini", componentId: "cmp-frame-phone", qty: 1 },
  { productId: "prd-phone-mini", componentId: "cmp-haptic", qty: 1 },

  { productId: "prd-phone-se", componentId: "cmp-display-phone", qty: 1 },
  { productId: "prd-phone-se", componentId: "cmp-cam-main", qty: 1 },
  { productId: "prd-phone-se", componentId: "cmp-mlb-phone", qty: 1 },
  { productId: "prd-phone-se", componentId: "cmp-batt-phone", qty: 1 },
  { productId: "prd-phone-se", componentId: "cmp-frame-phone", qty: 1 },

  { productId: "prd-book-14", componentId: "cmp-display-14", qty: 1 },
  { productId: "prd-book-14", componentId: "cmp-mlb-laptop", qty: 1 },
  { productId: "prd-book-14", componentId: "cmp-batt-laptop", qty: 1 },
  { productId: "prd-book-14", componentId: "cmp-frame-laptop", qty: 1 },
  { productId: "prd-book-14", componentId: "cmp-keyboard", qty: 1 },
  { productId: "prd-book-14", componentId: "cmp-trackpad", qty: 1 },
  { productId: "prd-book-14", componentId: "cmp-ga-brick", qty: 1 },

  { productId: "prd-book-16", componentId: "cmp-display-16", qty: 1 },
  { productId: "prd-book-16", componentId: "cmp-mlb-laptop", qty: 1 },
  { productId: "prd-book-16", componentId: "cmp-batt-laptop", qty: 1 },
  { productId: "prd-book-16", componentId: "cmp-frame-laptop", qty: 1 },
  { productId: "prd-book-16", componentId: "cmp-keyboard", qty: 1 },
  { productId: "prd-book-16", componentId: "cmp-trackpad", qty: 1 },
  { productId: "prd-book-16", componentId: "cmp-ga-brick", qty: 1 },

  { productId: "prd-tab-11", componentId: "cmp-display-phone-pro", qty: 1 },
  { productId: "prd-tab-11", componentId: "cmp-cam-main", qty: 1 },
  { productId: "prd-tab-11", componentId: "cmp-mlb-tab", qty: 1 },
  { productId: "prd-tab-11", componentId: "cmp-batt-phone", qty: 1 },
  { productId: "prd-tab-11", componentId: "cmp-frame-phone", qty: 1 },

  { productId: "prd-pad-mini", componentId: "cmp-display-phone", qty: 1 },
  { productId: "prd-pad-mini", componentId: "cmp-mlb-phone", qty: 1 },
  { productId: "prd-pad-mini", componentId: "cmp-batt-phone", qty: 1 },
  { productId: "prd-pad-mini", componentId: "cmp-frame-phone", qty: 1 },

  { productId: "prd-buds", componentId: "cmp-audio-buds", qty: 1 },
  { productId: "prd-buds-pro", componentId: "cmp-audio-buds", qty: 1 },
  { productId: "prd-buds-pro", componentId: "cmp-haptic", qty: 2 },

  { productId: "prd-watch", componentId: "cmp-display-watch", qty: 1 },
  { productId: "prd-watch", componentId: "cmp-mlb-watch", qty: 1 },
  { productId: "prd-watch", componentId: "cmp-batt-watch", qty: 1 },
  { productId: "prd-watch", componentId: "cmp-haptic", qty: 1 },

  { productId: "prd-watch-ultra", componentId: "cmp-display-watch", qty: 1 },
  { productId: "prd-watch-ultra", componentId: "cmp-mlb-watch", qty: 1 },
  { productId: "prd-watch-ultra", componentId: "cmp-batt-watch", qty: 1 },
  { productId: "prd-watch-ultra", componentId: "cmp-haptic", qty: 1 },
  { productId: "prd-watch-ultra", componentId: "cmp-rf-5g", qty: 1 },

  { productId: "prd-hub", componentId: "cmp-speaker", qty: 2 },
  { productId: "prd-hub", componentId: "cmp-audio-ic", qty: 1 },
  { productId: "prd-hub", componentId: "cmp-soc-pkg-watch", qty: 1 },
  { productId: "prd-hub", componentId: "cmp-pmic", qty: 1 },
  { productId: "prd-hub", componentId: "cmp-rf-wifi", qty: 1 },

  { productId: "prd-cam", componentId: "cmp-sensor-sec", qty: 1 },
  { productId: "prd-cam", componentId: "cmp-lens-wide", qty: 1 },
  { productId: "prd-cam", componentId: "cmp-soc-pkg-watch", qty: 1 },
  { productId: "prd-cam", componentId: "cmp-pmic", qty: 1 },
  { productId: "prd-cam", componentId: "cmp-rf-wifi", qty: 1 },

  { productId: "prd-fold", componentId: "cmp-display-phone-pro", qty: 1 },
  { productId: "prd-fold", componentId: "cmp-display-phone", qty: 1 },
  { productId: "prd-fold", componentId: "cmp-cam-main", qty: 1 },
  { productId: "prd-fold", componentId: "cmp-cam-ultra", qty: 1 },
  { productId: "prd-fold", componentId: "cmp-mlb-phone-pro", qty: 1 },
  { productId: "prd-fold", componentId: "cmp-batt-phone", qty: 2 },
  { productId: "prd-fold", componentId: "cmp-frame-phone", qty: 1 },
  { productId: "prd-fold", componentId: "cmp-haptic", qty: 1 },

  { productId: "prd-studio", componentId: "cmp-display-16", qty: 1 },
  { productId: "prd-studio", componentId: "cmp-pmic", qty: 1 },
  { productId: "prd-studio", componentId: "cmp-rf-wifi", qty: 1 },
  { productId: "prd-studio", componentId: "cmp-speaker", qty: 4 },
  { productId: "prd-studio", componentId: "cmp-frame-laptop", qty: 1 },
];
