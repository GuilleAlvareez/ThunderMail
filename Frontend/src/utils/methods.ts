export function separateDraftInfo(draft: string) {
  const toMatch = draft.match(/^To:\s*(.+)$/m);
  const subjectMatch = draft.match(/^Subject:\s*(.+)$/m);
  const contentMatch = draft.match(/^Content:\s*\n([\s\S]*)/m);

  return {
    to: toMatch?.[1].trim() || '',
    subject: subjectMatch?.[1].trim() || '',
    content: contentMatch?.[1].trim() || '',
  }
}