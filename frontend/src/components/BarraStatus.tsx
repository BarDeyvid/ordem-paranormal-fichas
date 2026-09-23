import React from 'react';

export interface BarraStatusProps {
  titulo: string;
  corBarra: string;
  corTempClasses?: string;
  valorAtual: number;
  setValorAtual: React.Dispatch<React.SetStateAction<number>> | ((val: number | ((prev: number) => number)) => void);
  valorMax: number;
  setValorMax: React.Dispatch<React.SetStateAction<number>> | ((val: number | ((prev: number) => number)) => void);
  alterarStatus: (qtd: number) => void;
  bloquearLetras?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hasTemp?: boolean;
  setHasTemp?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean | ((prev: boolean) => boolean)) => void);
  tempAtual?: number;
  setTempAtual?: React.Dispatch<React.SetStateAction<number>> | ((val: number | ((prev: number) => number)) => void);
  tempMax?: number;
  setTempMax?: React.Dispatch<React.SetStateAction<number>> | ((val: number | ((prev: number) => number)) => void);
}

const btnSeta =
  'px-2 text-lg font-bold text-zinc-300 transition select-none hover:text-white bg-transparent border-none';

export const BarraStatus: React.FC<BarraStatusProps> = ({
  titulo,
  corBarra,
  corTempClasses,
  valorAtual,
  setValorAtual,
  valorMax,
  setValorMax,
  alterarStatus,
  bloquearLetras,
  hasTemp,
  setHasTemp,
  tempAtual,
  setTempAtual,
  tempMax,
  setTempMax,
}) => {
  const percentual = valorMax > 0 ? Math.min(100, (valorAtual / valorMax) * 100) : 0;
  const percentualTemp =
    tempMax && tempMax > 0 && tempAtual !== undefined ? Math.min(100, (tempAtual / tempMax) * 100) : 0;

  return (
    <div>
      {/* CABEÇALHO */}
      <div className="mb-1.5 flex items-center justify-between">
        <span className="ml-1 text-sm font-bold uppercase tracking-wider text-zinc-400">{titulo}</span>
        {setHasTemp && (
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300">
            <input
              type="checkbox"
              className="accent-green-600"
              checked={hasTemp}
              onChange={(e) => {
                setHasTemp(e.target.checked);
                if (!e.target.checked && setTempAtual && setTempMax) {
                  setTempAtual(0);
                  setTempMax(0);
                }
              }}
            />
            + Temporário
          </label>
        )}
      </div>

      {/* CORPO */}
      <div className="flex w-full overflow-visible">
        <div
          className={`relative flex items-center justify-between overflow-hidden rounded border p-2.5 transition-all duration-300 ease-out ${corBarra} ${
            hasTemp ? 'w-[71.5%]' : 'w-full'
          }`}
        >
          {/* Preenchimento proporcional */}
          <div
            className="absolute inset-y-0 left-0 bg-white/5 transition-all"
            style={{ width: `${percentual}%` }}
          />
          <div className="relative shrink-0">
            <button onClick={() => alterarStatus(-5)} className={btnSeta} title="-5">
              «
            </button>
            <button onClick={() => alterarStatus(-1)} className={btnSeta} title="-1">
              ‹
            </button>
          </div>
          <div className="relative flex items-center gap-1 shrink-0">
            <input
              type="number"
              onKeyDown={bloquearLetras}
              value={valorAtual}
              onChange={(e) => setValorAtual(Math.max(0, Math.min(valorMax, Number(e.target.value))))}
              className="w-9 bg-transparent text-center text-lg font-bold text-zinc-100 outline-none"
              title={`Editar ${titulo} Atual`}
            />
            <span className="text-lg text-zinc-500">/</span>
            <input
              type="number"
              onKeyDown={bloquearLetras}
              value={valorMax}
              onChange={(e) => setValorMax(Math.max(1, Number(e.target.value)))}
              className="w-11 bg-transparent text-center text-lg font-bold text-zinc-100 outline-none"
              title={`Editar ${titulo} Máxima`}
            />
          </div>
          <div className="relative shrink-0">
            <button onClick={() => alterarStatus(1)} className={btnSeta} title="+1">
              ›
            </button>
            <button onClick={() => alterarStatus(5)} className={btnSeta} title="+5">
              »
            </button>
          </div>
        </div>

        {/* TEMPORÁRIO */}
        {setTempAtual && setTempMax && (
          <div
            className={`transition-all duration-300 ease-out overflow-hidden flex items-stretch ${
              hasTemp ? 'w-[28.5%] pl-2.5 opacity-100 translate-x-0' : 'w-0 pl-0 opacity-0 translate-x-4'
            }`}
          >
            <div
              className={`relative flex w-full items-center justify-center gap-1 rounded border border-dashed p-2.5 whitespace-nowrap min-w-[80px] overflow-hidden ${corTempClasses}`}
            >
              {/* Preenchimento proporcional do Temporário */}
              <div
                className="absolute inset-y-0 left-0 bg-white/5 transition-all duration-300"
                style={{ width: `${percentualTemp}%` }}
              />
              <div className="relative flex items-center gap-1">
                <input
                  type="number"
                  onKeyDown={bloquearLetras}
                  value={tempAtual}
                  onChange={(e) => setTempAtual(Math.max(0, Number(e.target.value)))}
                  className="w-8 bg-transparent text-center font-bold text-zinc-100 outline-none shrink-0"
                />
                <span className="text-zinc-500 shrink-0">/</span>
                <input
                  type="number"
                  onKeyDown={bloquearLetras}
                  value={tempMax}
                  onChange={(e) => setTempMax(Math.max(0, Number(e.target.value)))}
                  className="w-8 bg-transparent text-center font-bold text-zinc-100 outline-none shrink-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
