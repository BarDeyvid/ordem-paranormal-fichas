const fs = require('fs');
let c = fs.readFileSync('src/screens/Ficha/CombatePanel.tsx', 'utf8');

const calculoLogic = \`
function calcularDanoMedio(danoStr: string, multCritico: number): { normal: number, critico: number } {
  if (!danoStr || danoStr.trim() === '-' || danoStr.trim() === '') {
    return { normal: 0, critico: 0 };
  }
  const normalized = danoStr.toLowerCase().replace(/\\s/g, '').replace(/-/g, '+-');
  const parts = normalized.split('+');
  let avgNormal = 0;
  let sumMaxMult = 0;
  let flatBonus = 0;
  for (const part of parts) {
    if (!part) continue;
    const match = part.match(/^(-?)(\\d+)d(\\d+)$/);
    if (match) {
      const sign = match[1] === '-' ? -1 : 1;
      const count = parseInt(match[2], 10);
      const faces = parseInt(match[3], 10);
      const lowAvg = Math.floor(faces / 2);
      avgNormal += sign * (count * lowAvg);
      sumMaxMult += sign * (count * faces);
    } else {
      const val = parseInt(part, 10);
      if (!isNaN(val)) {
        flatBonus += val;
      }
    }
  }
  const normal = Math.max(0, avgNormal + flatBonus);
  const factor = multCritico >= 2 ? multCritico / 2 : 1;
  const critico = Math.max(0, Math.floor(factor * sumMaxMult) + flatBonus);
  return { normal, critico };
}
\`;

c = c.replace("function parseDanoString(danoStr: string) {", calculoLogic + "\\nfunction parseDanoString(danoStr: string) {");

const mediaLogic = \`
  const danoMedioPrincipal = calcularDanoMedio(arma.Dano_Arma, multCrit);
  const danoMedioSecundario = arma.Dano_Secundario ? calcularDanoMedio(arma.Dano_Secundario, multCrit) : null;
\`;

c = c.replace("const parsedDano = parseDanoString(danoStr);", mediaLogic + "\\n  const parsedDano = parseDanoString(danoStr);");

const renderMedia = \`
          {/* Média de Dano Compacta ao lado / embaixo */}
          <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-purple-400 font-bold">Média Dano (Normal):</span>
              <span className="text-zinc-200">{danoMedioPrincipal.normal}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-purple-400 font-bold">Média Dano (Crítico):</span>
              <span className="text-zinc-200">{danoMedioPrincipal.critico}</span>
            </div>
          </div>
\`;

c = c.replace(
  "{(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (",
  renderMedia + "\\n          {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && ("
);

fs.writeFileSync('src/screens/Ficha/CombatePanel.tsx', c, 'utf8');
