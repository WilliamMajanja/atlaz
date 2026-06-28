import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ZanAtlas database...");

  // Seed Development Zones
  const zones = [
    {
      name: "Stone Town",
      description: "UNESCO World Heritage Site and historic heart of Zanzibar City.",
      neighbourhood: "Stone Town",
      tourismScore: 92,
      infrastructureScore: 70,
      floodSensitivity: 75,
      developmentMomentum: 55,
      pricePerSqmMin: 350,
      pricePerSqmMax: 1200,
      strategicNote: "Premium heritage tourism location with high regulatory constraints.",
    },
    {
      name: "Paje",
      description: "Popular kitesurfing and beach destination on the southeast coast.",
      neighbourhood: "Paje",
      tourismScore: 88,
      infrastructureScore: 55,
      floodSensitivity: 60,
      developmentMomentum: 78,
      pricePerSqmMin: 150,
      pricePerSqmMax: 450,
      strategicNote: "High tourism demand with strong hospitality development.",
    },
    {
      name: "Jambiani",
      description: "Traditional fishing village turned tourist destination.",
      neighbourhood: "Jambiani",
      tourismScore: 78,
      infrastructureScore: 45,
      floodSensitivity: 65,
      developmentMomentum: 65,
      pricePerSqmMin: 100,
      pricePerSqmMax: 350,
      strategicNote: "Emerging tourism corridor with authentic character.",
    },
    {
      name: "Michamvi",
      description: "Quiet coastal village with pristine beaches.",
      neighbourhood: "Michamvi",
      tourismScore: 72,
      infrastructureScore: 38,
      floodSensitivity: 55,
      developmentMomentum: 70,
      pricePerSqmMin: 80,
      pricePerSqmMax: 300,
      strategicNote: "Emerging luxury/tourism corridor with high upside.",
    },
    {
      name: "Fumba",
      description: "Planned development area south of Stone Town.",
      neighbourhood: "Fumba",
      tourismScore: 45,
      infrastructureScore: 72,
      floodSensitivity: 40,
      developmentMomentum: 60,
      pricePerSqmMin: 120,
      pricePerSqmMax: 280,
      strategicNote: "Planned development with higher institutional confidence.",
    },
    {
      name: "Nungwi",
      description: "Popular tourist destination at the northern tip.",
      neighbourhood: "Nungwi",
      tourismScore: 90,
      infrastructureScore: 60,
      floodSensitivity: 35,
      developmentMomentum: 72,
      pricePerSqmMin: 200,
      pricePerSqmMax: 600,
      strategicNote: "Prime northern tourism hub with strong seasonal demand.",
    },
    {
      name: "Kendwa",
      description: "Calm beach destination near Nungwi.",
      neighbourhood: "Kendwa",
      tourismScore: 85,
      infrastructureScore: 52,
      floodSensitivity: 30,
      developmentMomentum: 68,
      pricePerSqmMin: 160,
      pricePerSqmMax: 450,
      strategicNote: "Strong tourism demand with calmer waters.",
    },
    {
      name: "Matemwe",
      description: "Northeast coast with luxury resorts.",
      neighbourhood: "Matemwe",
      tourismScore: 82,
      infrastructureScore: 40,
      floodSensitivity: 45,
      developmentMomentum: 55,
      pricePerSqmMin: 140,
      pricePerSqmMax: 400,
      strategicNote: "Luxury tourism corridor with premium positioning.",
    },
    {
      name: "Kiwengwa",
      description: "Northeast coast with large resort hotels.",
      neighbourhood: "Kiwengwa",
      tourismScore: 80,
      infrastructureScore: 55,
      floodSensitivity: 50,
      developmentMomentum: 58,
      pricePerSqmMin: 130,
      pricePerSqmMax: 380,
      strategicNote: "Established tourism zone with moderate growth.",
    },
    {
      name: "Chwaka",
      description: "Gateway to Jozani Chwaka Bay National Park.",
      neighbourhood: "Chwaka",
      tourismScore: 40,
      infrastructureScore: 35,
      floodSensitivity: 70,
      developmentMomentum: 35,
      pricePerSqmMin: 60,
      pricePerSqmMax: 180,
      strategicNote: "Eco-tourism potential with national park access.",
    },
  ];

  for (const zone of zones) {
    await prisma.developmentZone.upsert({
      where: { name: zone.name },
      update: zone,
      create: zone,
    });
  }
  console.log(`Seeded ${zones.length} development zones`);

  // Seed Listings
  const listings = [
    {
      title: "Beachfront Plot - Paje",
      description: "4,000 sqm oceanfront plot with direct beach access.",
      latitude: -6.2750,
      longitude: 39.4600,
      priceUsd: 180000,
      areaSqm: 4000,
      pricePerSqm: 45,
      listingType: "land",
      tags: ["beachfront", "development", "tourism"],
    },
    {
      title: "Stone Town Heritage Building",
      description: "Restored 3-storey heritage building in Stone Town.",
      latitude: -6.1630,
      longitude: 39.1930,
      priceUsd: 420000,
      areaSqm: 350,
      pricePerSqm: 1200,
      listingType: "property",
      tags: ["heritage", "income-producing"],
    },
    {
      title: "Development Land - Michamvi",
      description: "8,500 sqm plot in emerging tourism corridor.",
      latitude: -6.2200,
      longitude: 39.4900,
      priceUsd: 95000,
      areaSqm: 8500,
      pricePerSqm: 11.2,
      listingType: "land",
      tags: ["development", "emerging"],
    },
    {
      title: "Nungwi Resort Land",
      description: "3,200 sqm beachfront plot in prime Nungwi.",
      latitude: -5.7280,
      longitude: 39.3000,
      priceUsd: 250000,
      areaSqm: 3200,
      pricePerSqm: 78,
      listingType: "land",
      tags: ["beachfront", "prime"],
    },
    {
      title: "Fumba Mixed-Use Plot",
      description: "6,000 sqm plot in Fumba Town development zone.",
      latitude: -6.2930,
      longitude: 39.3150,
      priceUsd: 120000,
      areaSqm: 6000,
      pricePerSqm: 20,
      listingType: "land",
      tags: ["mixed-use", "planned"],
    },
  ];

  for (const listing of listings) {
    await prisma.listing.create({ data: listing });
  }
  console.log(`Seeded ${listings.length} listings`);

  // Seed Infrastructure Assets
  const assets = [
    { name: "Abeid Amani Karume International Airport", assetType: "airport", latitude: -6.2220, longitude: 39.2249, status: "operational" },
    { name: "Zanzibar Port", assetType: "port", latitude: -6.1631, longitude: 39.1913, status: "operational" },
    { name: "Stone Town Ferry Terminal", assetType: "ferry", latitude: -6.1631, longitude: 39.1910, status: "operational" },
    { name: "Jozani Forest Gate", assetType: "attraction", latitude: -6.2400, longitude: 39.4100, status: "operational" },
    { name: "Nungwi Lighthouse", assetType: "landmark", latitude: -5.7250, longitude: 39.2970, status: "operational" },
  ];

  for (const asset of assets) {
    await prisma.infrastructureAsset.create({ data: asset });
  }
  console.log(`Seeded ${assets.length} infrastructure assets`);

  // Seed Growth Scenarios
  const scenarios = [
    {
      name: "East Coast Road Upgrade",
      description: "Major road improvement connecting Stone Town to the east coast.",
      assumptions: [
        { parameter: "accessibilityMultiplier", value: 1.4, description: "Road access improvement" },
        { parameter: "demandLift", value: 1.15, description: "Increased tourism demand" },
      ],
      affectedZones: ["paje", "jambiani", "michamvi", "chwaka"],
      timeHorizonYears: 5,
    },
    {
      name: "Golden Visa Demand Surge",
      description: "Zanzibar Golden Visa programme attracts foreign investment.",
      assumptions: [
        { parameter: "demandLift", value: 1.25, description: "Foreign buyer demand increase" },
        { parameter: "priceLift", value: 1.20, description: "Premium pricing" },
      ],
      affectedZones: ["stone-town", "paje", "nungwi", "kendwa"],
      timeHorizonYears: 3,
    },
    {
      name: "Flood Regulation Tightening",
      description: "New regulations restrict development in flood-prone areas.",
      assumptions: [
        { parameter: "restrictionMultiplier", value: 0.6, description: "Reduced developable area" },
        { parameter: "priceImpact", value: 0.85, description: "Price depression in flood zones" },
      ],
      affectedZones: ["chwaka", "stone-town", "jambiani"],
      timeHorizonYears: 2,
    },
  ];

  for (const scenario of scenarios) {
    await prisma.growthScenario.upsert({
      where: { name: scenario.name },
      update: scenario,
      create: scenario,
    });
  }
  console.log(`Seeded ${scenarios.length} growth scenarios`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
