import { DataSource } from "./types";
import { SeedDataSource } from "./seed-source";
import { DatabaseDataSource } from "./db-source";

let currentSource: DataSource = new SeedDataSource();
let dbSourceInstance: DatabaseDataSource | null = null;

export function getDataSource(): DataSource {
  return currentSource;
}

export async function useDatabaseSource(): Promise<DataSource> {
  if (!dbSourceInstance) {
    dbSourceInstance = new DatabaseDataSource();
    await dbSourceInstance.load();
  }
  currentSource = dbSourceInstance;
  return currentSource;
}

export function useSeedSource(): void {
  currentSource = new SeedDataSource();
  dbSourceInstance = null;
}

export type { DataSource, ListingRecord, InfrastructureRecord, GeoJSONLayers, LegalDocumentRecord } from "./types";
