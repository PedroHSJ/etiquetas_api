import { DataSource } from "typeorm";

declare global {
  var __nestApp: any;
  var __dataSource: DataSource;
}

export {};
