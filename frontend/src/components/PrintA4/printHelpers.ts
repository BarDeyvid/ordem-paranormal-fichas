import type { AtributoKey } from '../../types';

export interface PericiaPrintData {
  id: number;
  nome: string;
  atributo: AtributoKey;
  treino: number;
  grauTreinoLabel: string;
  outros: number;
  total: number;
  treinada: boolean;
}

export function formatarGrauTreino(treino: number): string {
  switch (treino) {
    case 5:
      return 'T';
    case 10:
      return 'V';
    case 15:
      return 'E';
    default:
      return 'D';
  }
}

export function obterPericiasOrdenadas(rpg: any): PericiaPrintData[] {
  const pericias = rpg?.periciasHook?.pericias || {};
  const regrasAutomaticasAtivas = rpg?.regrasAutomaticasAtivas || new Set();
  const itens = rpg?.itensHook?.itensInventario || [];
  const temProtecaoLeve = rpg?.protecoesHook?.protecoesInventario?.some(
    (p: any) => p.equipado && p.protecao?.Proficiencia?.toLowerCase().includes('leve')
  ) || false;

  const lista = Object.entries(pericias)
    .sort((a: any, b: any) => a[1].id - b[1].id)
    .map(([nome, dadosPericia]: [string, any]) => {
      const bonusRegra8 = (nome === 'Diplomacia' && regrasAutomaticasAtivas.has(8)) ? 2 : 0;
      const bonusRegra13 = (nome === 'Vontade' && regrasAutomaticasAtivas.has(13)) ? 2 : 0;
      const bonusRegra25 = (nome === 'Reflexos' && regrasAutomaticasAtivas.has(25) && temProtecaoLeve) ? 2 : 0;

      // Bônus de Itens
      const bonusInventario = itens.reduce((acc: number, obj: any) => {
        const nomeItem = obj.item?.Nome_Item?.toLowerCase() || '';
        const isVestimenta = nomeItem.includes('vestimenta');
        const isAmuleto = nomeItem.includes('amuleto sagrado');

        let bonusDesteItem = 0;
        const match = obj.item?.Nome_Item?.match(/\((.*?)\)/);
        if (match) {
          const periciasNoItem = match[1].split(',').map((s: string) => s.trim().toLowerCase());
          const periciaEncontrada = periciasNoItem.find((p: string) => p.replace('*', '') === nome.toLowerCase());
          if (periciaEncontrada) {
            if ((isVestimenta || isAmuleto) && !obj.equipado) {
              // não aplica se não equipado
            } else {
              bonusDesteItem = periciaEncontrada.includes('*') ? 5 : 2;
            }
          }
        }

        if (isAmuleto && obj.equipado && bonusDesteItem === 0) {
          if (nome === 'Religião' || nome === 'Vontade') {
            bonusDesteItem = 2;
          }
        }

        return acc + bonusDesteItem;
      }, 0);

      const treino = dadosPericia.treino || 0;
      const outrosManual = dadosPericia.outros || 0;
      const outrosTotal = outrosManual + bonusRegra8 + bonusRegra13 + bonusRegra25 + bonusInventario;
      const total = treino + outrosTotal;

      return {
        id: dadosPericia.id,
        nome,
        atributo: (dadosPericia.atributo as AtributoKey) || 'FOR',
        treino,
        grauTreinoLabel: formatarGrauTreino(treino),
        outros: outrosTotal,
        total,
        treinada: treino > 0,
      };
    });

  return lista;
}
