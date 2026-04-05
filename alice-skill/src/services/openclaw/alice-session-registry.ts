import fs from 'node:fs';
import path from 'node:path';

export interface AliceSessionRegistry {
  resolve(logicalKey: string): Promise<string | null>;
  save(logicalKey: string, sessionPath: string): Promise<void>;
  clear(logicalKey: string): Promise<void>;
}

export class FileAliceSessionRegistry implements AliceSessionRegistry {
  constructor(private readonly registryPath: string) {}

  async resolve(logicalKey: string): Promise<string | null> {
    const data = this.readRegistry();
    return data[logicalKey] ?? null;
  }

  async save(logicalKey: string, sessionPath: string): Promise<void> {
    const data = this.readRegistry();
    data[logicalKey] = sessionPath;
    this.writeRegistry(data);
  }

  async clear(logicalKey: string): Promise<void> {
    const data = this.readRegistry();
    delete data[logicalKey];
    this.writeRegistry(data);
  }

  private readRegistry(): Record<string, string> {
    if (!fs.existsSync(this.registryPath)) {
      return {};
    }

    return JSON.parse(fs.readFileSync(this.registryPath, 'utf8')) as Record<string, string>;
  }

  private writeRegistry(data: Record<string, string>): void {
    fs.mkdirSync(path.dirname(this.registryPath), { recursive: true });
    fs.writeFileSync(this.registryPath, JSON.stringify(data, null, 2));
  }
}
