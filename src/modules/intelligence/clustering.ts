import { neighbourhoods } from "../../data/seed/zanzibar";
import { ZoneCluster, PeerGroup, ClusterAnalysis } from "../../types";

interface ZoneVector {
  name: string;
  tourism: number;
  infrastructure: number;
  development: number;
  floodSafety: number;
  priceLevel: number;
}

function euclideanDistance(a: ZoneVector, b: ZoneVector): number {
  return Math.sqrt(
    Math.pow(a.tourism - b.tourism, 2) +
    Math.pow(a.infrastructure - b.infrastructure, 2) +
    Math.pow(a.development - b.development, 2) +
    Math.pow(a.floodSafety - b.floodSafety, 2) +
    Math.pow(a.priceLevel - b.priceLevel, 2)
  );
}

function getZoneVectors(): ZoneVector[] {
  return neighbourhoods.map((z) => ({
    name: z.name,
    tourism: z.tourismScore,
    infrastructure: z.infrastructureScore,
    development: z.developmentMomentum,
    floodSafety: 100 - z.floodSensitivity,
    priceLevel: (z.pricePerSqmMin + z.pricePerSqmMax) / 2,
  }));
}

function kMeansClustering(vectors: ZoneVector[], k: number): number[][] {
  if (vectors.length === 0) return [];

  const centroids = vectors.slice(0, k).map((v) => ({ ...v }));

  let assignments: number[] = new Array(vectors.length).fill(0);
  let changed = true;
  let iterations = 0;

  while (changed && iterations < 50) {
    changed = false;
    iterations++;

    for (let i = 0; i < vectors.length; i++) {
      let minDist = Infinity;
      let bestCluster = 0;

      for (let c = 0; c < k; c++) {
        const dist = euclideanDistance(vectors[i], centroids[c]);
        if (dist < minDist) {
          minDist = dist;
          bestCluster = c;
        }
      }

      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    for (let c = 0; c < k; c++) {
      const members = vectors.filter((_, i) => assignments[i] === c);
      if (members.length === 0) continue;

      centroids[c] = {
        name: `cluster_${c}`,
        tourism: members.reduce((s, m) => s + m.tourism, 0) / members.length,
        infrastructure: members.reduce((s, m) => s + m.infrastructure, 0) / members.length,
        development: members.reduce((s, m) => s + m.development, 0) / members.length,
        floodSafety: members.reduce((s, m) => s + m.floodSafety, 0) / members.length,
        priceLevel: members.reduce((s, m) => s + m.priceLevel, 0) / members.length,
      };
    }
  }

  const clusters: number[][] = Array.from({ length: k }, () => []);
  for (let i = 0; i < assignments.length; i++) {
    clusters[assignments[i]].push(i);
  }

  return clusters;
}

function describeCluster(indices: number[], allVectors: ZoneVector[]): { label: string; dominant: string; description: string } {
  if (indices.length === 0) return { label: "Empty", dominant: "N/A", description: "No zones assigned." };

  const members = indices.map((i) => allVectors[i]);
  const avgTourism = members.reduce((s, m) => s + m.tourism, 0) / members.length;
  const avgInfra = members.reduce((s, m) => s + m.infrastructure, 0) / members.length;
  const avgDev = members.reduce((s, m) => s + m.development, 0) / members.length;
  const avgFloodSafety = members.reduce((s, m) => s + m.floodSafety, 0) / members.length;
  const avgPrice = members.reduce((s, m) => s + m.priceLevel, 0) / members.length;

  const characteristics: { name: string; value: number }[] = [
    { name: "Tourism", value: avgTourism },
    { name: "Infrastructure", value: avgInfra },
    { name: "Development", value: avgDev },
    { name: "Flood Safety", value: avgFloodSafety },
  ];

  const dominant = characteristics.sort((a, b) => b.value - a.value)[0];

  let label: string;
  if (avgTourism > 70 && avgPrice > 800) label = "Premium Tourism";
  else if (avgDev > 65) label = "High Growth";
  else if (avgFloodSafety < 40) label = "Flood Risk";
  else if (avgPrice < 400) label = "Value Entry";
  else if (avgInfra > 60) label = "Well-Connected";
  else label = "Emerging";

  return {
    label,
    dominant: dominant.name,
    description: `${label} cluster: Avg tourism ${Math.round(avgTourism)}, infra ${Math.round(avgInfra)}, development ${Math.round(avgDev)}. Price range: $${Math.round(avgPrice)}/sqm.`,
  };
}

function findOutliers(vectors: ZoneVector[], clusters: number[][]): { indices: number[]; reasons: Record<string, string> } {
  const allDistances: { idx: number; dist: number; reason: string }[] = [];

  for (let ci = 0; ci < clusters.length; ci++) {
    if (clusters[ci].length < 2) continue;

    const members = clusters[ci].map((idx) => vectors[idx]);
    const centroid = {
      name: "centroid",
      tourism: members.reduce((s, m) => s + m.tourism, 0) / members.length,
      infrastructure: members.reduce((s, m) => s + m.infrastructure, 0) / members.length,
      development: members.reduce((s, m) => s + m.development, 0) / members.length,
      floodSafety: members.reduce((s, m) => s + m.floodSafety, 0) / members.length,
      priceLevel: members.reduce((s, m) => s + m.priceLevel, 0) / members.length,
    };

    for (const idx of clusters[ci]) {
      const dist = euclideanDistance(vectors[idx], centroid);
      const member = vectors[idx];
      const devDiff = Math.abs(member.development - centroid.development);
      const priceDiff = Math.abs(member.priceLevel - centroid.priceLevel) / centroid.priceLevel;

      const reasons: string[] = [];
      if (devDiff > 20) reasons.push("Development momentum diverges from peer group");
      if (priceDiff > 0.4) reasons.push("Price level deviates significantly from cluster average");
      if (Math.abs(member.floodSafety - centroid.floodSafety) > 25) reasons.push("Flood risk profile differs from peers");

      if (reasons.length > 0) {
        allDistances.push({ idx, dist, reason: reasons.join("; ") });
      }
    }
  }

  const sorted = allDistances.sort((a, b) => b.dist - a.dist);
  const topOutliers = sorted.slice(0, Math.min(3, sorted.length));

  const outlierIndices = topOutliers.map((o) => o.idx);
  const reasons: Record<string, string> = {};
  for (const o of topOutliers) {
    reasons[vectors[o.idx].name] = o.reason;
  }

  return { indices: outlierIndices, reasons };
}

export function calculateClusterAnalysis(): ClusterAnalysis {
  const vectors = getZoneVectors();
  const k = Math.min(4, Math.max(2, Math.round(vectors.length / 3)));
  const clusters = kMeansClustering(vectors, k);

  const clustersResult: ZoneCluster[] = clusters.map((indices, i) => {
    const info = describeCluster(indices, vectors);
    return {
      id: `cluster_${i + 1}`,
      label: info.label,
      zones: indices.map((idx) => vectors[idx].name),
      averageScore: Math.round(indices.reduce((s, idx) => {
        const v = vectors[idx];
        return s + (v.tourism + v.infrastructure + v.development + v.floodSafety) / 4;
      }, 0) / indices.length),
      dominantCharacteristic: info.dominant,
      description: info.description,
    };
  });

  const outliers = findOutliers(vectors, clusters);

  const peerGroups: PeerGroup[] = [];
  const zonePairs: { a: string; b: string; dist: number }[] = [];

  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      zonePairs.push({
        a: vectors[i].name,
        b: vectors[j].name,
        dist: euclideanDistance(vectors[i], vectors[j]),
      });
    }
  }

  zonePairs.sort((a, b) => a.dist - b.dist);

  const usedInPeerGroup = new Set<string>();
  for (let i = 0; i < vectors.length; i++) {
    if (usedInPeerGroup.has(vectors[i].name)) continue;

    const closest = zonePairs
      .filter((p) => (p.a === vectors[i].name || p.b === vectors[i].name) && !usedInPeerGroup.has(p.a === vectors[i].name ? p.b : p.a))
      .slice(0, 3);

    const peers = closest.map((p) => (p.a === vectors[i].name ? p.b : p.a));
    if (peers.length > 0) {
      const avgDist = closest.reduce((s, p) => s + p.dist, 0) / closest.length;

      const v = vectors[i];
      const differentiators: string[] = [];
      for (const peerName of peers) {
        const pv = vectors.find((v) => v.name === peerName);
        if (!pv) continue;
        if (Math.abs(v.tourism - pv.tourism) > 15) differentiators.push("tourism score");
        if (Math.abs(v.priceLevel - pv.priceLevel) / v.priceLevel > 0.3) differentiators.push("price level");
        if (Math.abs(v.floodSafety - pv.floodSafety) > 20) differentiators.push("flood risk");
      }

      peerGroups.push({
        anchorZone: vectors[i].name,
        peers,
        similarityScore: Math.round(Math.max(0, 100 - avgDist * 10)),
        differentiators: [...new Set(differentiators)],
      });

      usedInPeerGroup.add(vectors[i].name);
      peers.forEach((p) => usedInPeerGroup.add(p));
    }
  }

  return {
    clusters: clustersResult.sort((a, b) => b.averageScore - a.averageScore),
    peerGroups,
    outliers: outliers.indices.map((idx) => vectors[idx].name),
    outlierReasons: outliers.reasons,
  };
}
