export function statusAtendimentoLabel(status: string | null | undefined): string {
  return (status ?? '').trim().toUpperCase() === 'A' ? 'Em aberto' : (status ?? '');
}

export function statusAtendimentoEmAberto(status: string | null | undefined): boolean {
  return (status ?? '').trim().toUpperCase() === 'A';
}
