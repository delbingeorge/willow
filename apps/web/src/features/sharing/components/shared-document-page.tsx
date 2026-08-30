import { useMemo } from "react";
import { useParams } from "react-router";
import Collaboration from "@tiptap/extension-collaboration";
import { EditorShell } from "@/features/editor/components/editor-shell";
import { buildSnapshotDoc } from "@/features/editor/lib/snapshot-doc";
import { useSharedDocument } from "@/features/sharing/hooks/use-shared-document";
import { Logo } from "@/shared/components/logo";

function Centered({ children }: { children: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <p className="text-[13px] text-ink-subtle">{children}</p>
    </div>
  );
}

export function SharedDocumentPage() {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, isError } = useSharedDocument(token);

  const ydoc = useMemo(() => buildSnapshotDoc(data?.content), [data]);
  const collabExtensions = useMemo(
    () => (ydoc ? [Collaboration.configure({ document: ydoc })] : []),
    [ydoc],
  );

  if (isLoading) {
    return <Centered>Loading…</Centered>;
  }

  if (isError || !data) {
    return <Centered>This page isn’t available. The link may have been turned off.</Centered>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      {data.coverUrl && (
        <img
          src={data.coverUrl}
          alt=""
          className="h-48 w-full shrink-0 object-cover sm:h-60"
        />
      )}

      <main className="flex flex-1 flex-col">
        {ydoc ? (
          <EditorShell ydoc={ydoc} collabExtensions={collabExtensions} readOnly />
        ) : (
          <div className="mx-auto w-full max-w-[860px] px-14 py-14">
            <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">
              {data.title || "Untitled"}
            </h1>
            <p className="mt-4 text-[13px] text-ink-subtle">This page has no content yet.</p>
          </div>
        )}
      </main>

      <footer className="flex shrink-0 items-center justify-center gap-2 border-t border-border py-5 text-[12px] text-ink-subtle">
        <Logo className="size-3.5" />
        Made with Willow
      </footer>
    </div>
  );
}
