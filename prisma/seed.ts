import { PrismaClient } from "@prisma/client";
import {
  neighbourhoods,
  sampleListings,
  infrastructureAssets,
  coastalZoneGeoJSON,
  floodRiskGeoJSON,
  developmentZoneGeoJSON,
  roadsGeoJSON,
} from "../src/data/seed/zanzibar";
import { legalDocuments } from "../src/data/seed/legal-documents";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ZanAtlas database...");

  const zones = [
    { name: "Stone Town", neighbourhood: "Stone Town", tourismScore: 92, infrastructureScore: 70, floodSensitivity: 75, developmentMomentum: 55, pricePerSqmMin: 350, pricePerSqmMax: 1200 },
    { name: "Paje", neighbourhood: "Paje", tourismScore: 88, infrastructureScore: 55, floodSensitivity: 60, developmentMomentum: 78, pricePerSqmMin: 150, pricePerSqmMax: 450 },
    { name: "Jambiani", neighbourhood: "Jambiani", tourismScore: 78, infrastructureScore: 45, floodSensitivity: 65, developmentMomentum: 65, pricePerSqmMin: 100, pricePerSqmMax: 350 },
    { name: "Michamvi", neighbourhood: "Michamvi", tourismScore: 72, infrastructureScore: 38, floodSensitivity: 55, developmentMomentum: 70, pricePerSqmMin: 80, pricePerSqmMax: 300 },
    { name: "Fumba", neighbourhood: "Fumba", tourismScore: 45, infrastructureScore: 72, floodSensitivity: 40, developmentMomentum: 60, pricePerSqmMin: 120, pricePerSqmMax: 280 },
    { name: "Nungwi", neighbourhood: "Nungwi", tourismScore: 90, infrastructureScore: 60, floodSensitivity: 35, developmentMomentum: 72, pricePerSqmMin: 200, pricePerSqmMax: 600 },
    { name: "Kendwa", neighbourhood: "Kendwa", tourismScore: 85, infrastructureScore: 52, floodSensitivity: 30, developmentMomentum: 68, pricePerSqmMin: 160, pricePerSqmMax: 450 },
    { name: "Matemwe", neighbourhood: "Matemwe", tourismScore: 82, infrastructureScore: 40, floodSensitivity: 45, developmentMomentum: 55, pricePerSqmMin: 140, pricePerSqmMax: 400 },
    { name: "Kiwengwa", neighbourhood: "Kiwengwa", tourismScore: 80, infrastructureScore: 55, floodSensitivity: 50, developmentMomentum: 58, pricePerSqmMin: 130, pricePerSqmMax: 380 },
    { name: "Chwaka", neighbourhood: "Chwaka", tourismScore: 40, infrastructureScore: 35, floodSensitivity: 70, developmentMomentum: 35, pricePerSqmMin: 60, pricePerSqmMax: 180 },
  ];

  for (const zone of zones) {
    const full = neighbourhoods.find((n) => n.name === zone.name);
    await prisma.developmentZone.upsert({
      where: { name: zone.name },
      update: { ...zone, description: full?.description ?? "", strategicNote: full?.strategicNote ?? "", geometry: { latitude: full?.latitude, longitude: full?.longitude } },
      create: { ...zone, description: full?.description ?? "", strategicNote: full?.strategicNote ?? "", geometry: { latitude: full?.latitude, longitude: full?.longitude } },
    });
  }
  console.log(`Seeded ${zones.length} development zones`);

  for (const listing of sampleListings) {
    await prisma.listing.create({
      data: { title: listing.title, description: listing.description, latitude: listing.latitude, longitude: listing.longitude, priceUsd: listing.priceUsd, areaSqm: listing.areaSqm, pricePerSqm: listing.pricePerSqm ?? 0, listingType: listing.listingType, tags: JSON.stringify(listing.tags) },
    });
  }
  console.log(`Seeded ${sampleListings.length} listings`);

  for (const asset of infrastructureAssets) {
    await prisma.infrastructureAsset.create({ data: { name: asset.name, assetType: asset.assetType, latitude: asset.latitude, longitude: asset.longitude, status: asset.status } });
  }
  console.log(`Seeded ${infrastructureAssets.length} infrastructure assets`);

  const geojsonLayers = [
    { name: "coastal-zones", type: "polygon", data: coastalZoneGeoJSON },
    { name: "flood-risk", type: "polygon", data: floodRiskGeoJSON },
    { name: "development-zones", type: "polygon", data: developmentZoneGeoJSON },
    { name: "roads", type: "line", data: roadsGeoJSON },
  ];

  for (const layer of geojsonLayers) {
    const existing = await prisma.geoLayer.upsert({
      where: { name: layer.name },
      update: { layerType: layer.type, source: "seed", visible: true },
      create: { name: layer.name, description: `Seed ${layer.name} layer`, layerType: layer.type, source: "seed", visible: true },
    });

    await prisma.geoFeature.deleteMany({ where: { layerId: existing.id } });

    const features = layer.data.features.map((f: GeoJSON.Feature) => ({
      name: (f.properties as Record<string, string>)?.name ?? null,
      featureType: f.geometry.type,
      properties: f.properties,
      geometry: f.geometry,
      layerId: existing.id,
    }));

    if (features.length > 0) {
      await prisma.geoFeature.createMany({ data: features as any });
    }
  }
  console.log("Seeded GeoJSON layers");

  const scenarios = [
    { name: "East Coast Road Upgrade", description: "Major road improvement connecting Stone Town to the east coast.", assumptions: [{ parameter: "accessibilityMultiplier", value: 1.4, description: "Road access improvement" }, { parameter: "demandLift", value: 1.15, description: "Increased tourism demand" }], affectedZones: "paje,jambiani,michamvi,chwaka", timeHorizonYears: 5 },
    { name: "Golden Visa Demand Surge", description: "Zanzibar Golden Visa programme attracts foreign investment.", assumptions: [{ parameter: "demandLift", value: 1.25, description: "Foreign buyer demand increase" }, { parameter: "priceLift", value: 1.2, description: "Premium pricing" }], affectedZones: "stone-town,paje,nungwi,kendwa", timeHorizonYears: 3 },
    { name: "Flood Regulation Tightening", description: "New regulations restrict development in flood-prone areas.", assumptions: [{ parameter: "restrictionMultiplier", value: 0.6, description: "Reduced developable area" }, { parameter: "priceImpact", value: 0.85, description: "Price depression in flood zones" }], affectedZones: "chwaka,stone-town,jambiani", timeHorizonYears: 2 },
  ];

  for (const scenario of scenarios) {
    await prisma.growthScenario.upsert({
      where: { name: scenario.name },
      update: scenario,
      create: scenario,
    });
  }
  console.log(`Seeded ${scenarios.length} growth scenarios`);

  for (const doc of legalDocuments) {
    await prisma.legalDocument.upsert({
      where: { id: doc.id },
      update: {
        title: doc.title,
        description: doc.description,
        category: doc.category,
        jurisdiction: doc.jurisdiction,
        pdfUrl: doc.pdfUrl,
        fileSize: doc.fileSize,
        pages: doc.pages,
        language: doc.language,
        referenceNumber: doc.referenceNumber,
        enactedDate: doc.enactedDate ? new Date(doc.enactedDate) : null,
        lastAmended: doc.lastAmended ? new Date(doc.lastAmended) : null,
        tags: doc.tags.join(", "),
      },
      create: {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        jurisdiction: doc.jurisdiction,
        pdfUrl: doc.pdfUrl,
        fileSize: doc.fileSize,
        pages: doc.pages,
        language: doc.language,
        referenceNumber: doc.referenceNumber,
        enactedDate: doc.enactedDate ? new Date(doc.enactedDate) : null,
        lastAmended: doc.lastAmended ? new Date(doc.lastAmended) : null,
        tags: doc.tags.join(", "),
      },
    });
  }
  console.log(`Seeded ${legalDocuments.length} legal documents`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
