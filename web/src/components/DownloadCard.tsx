import { formatBytes } from "@/lib/format";

export interface DownloadItem {
  file: string;
  label: string;
  format: string;
  group: string;
  bytes: number;
}

export function DownloadCard({ item }: { item: DownloadItem }) {
  return (
    <a className="dl-card" href={`/downloads/${item.file}`} download>
      <span className="dl-fmt">{item.format}</span>
      <span className="dl-body">
        <span className="dl-label">{item.label}</span>
        <span className="dl-file">{item.file}</span>
      </span>
      <span className="dl-size">{formatBytes(item.bytes)} &#8595;</span>
    </a>
  );
}
