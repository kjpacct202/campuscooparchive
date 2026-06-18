import { CopyButton } from "./CopyButton";

export function PromptStarter({ prompt }: { prompt: string }) {
  return (
    <div className="prompt-starter">
      <p>&ldquo;{prompt}&rdquo;</p>
      <CopyButton text={prompt} label="Copy prompt" />
    </div>
  );
}
