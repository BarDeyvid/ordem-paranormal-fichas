const fs = require('fs');

function applyElementPickerPattern(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Remove the CustomSelect import if not needed
  c = c.replace(
    "import { CustomSelect } from '../components/CustomSelect';\n",
    ""
  );
  c = c.replace(
    "import { CustomSelect } from './CustomSelect';\n",
    ""
  );

  // Add state for escolhendoElementoPara
  c = c.replace(
    /const \[escolhasElemento, setEscolhasElemento\] = [^;]+;/,
    "const [escolhendoElementoPara, setEscolhendoElementoPara] = React.useState<number | null>(null);"
  );
  // for ModalMudarOrigem it's useState, not React.useState
  c = c.replace(
    /const \[escolhasElemento, setEscolhasElemento\] = [^;]+;/,
    "const [escolhendoElementoPara, setEscolhendoElementoPara] = useState<number | null>(null);"
  );

  // Remove the ugly bottom blocks we added
  c = c.replace(
    /\{origem\.Codigo_Regra === 18 && \([\s\S]*?Confirmar Origem\s*<\/button>\s*<\/div>\s*\)\}/,
    ""
  );

  // We need to change the "Escolher" button logic
  // In ModalMudarOrigem:
  /*
                    {origem.Codigo_Per_Regra !== 6 && origem.Codigo_Regra !== 18 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selecionarOrigem(origem);
                          onClose();
                        }}
  */
  // Let's replace the whole action area in both files.

  // 1. OrigensScreen.tsx
  if (filePath.includes('OrigensScreen')) {
    // Replace the entire header action block for OrigensScreen
    const oldActionBlock = `                {(origem.Codigo_Per_Regra === 6 || origem.Codigo_Regra === 18) && estaExpandida ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">Preencha as opções abaixo primeiro</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2', escolhasElemento[origem.Codigo_Origem]);
                      setTelaAtual('classe');
                    }}
                    disabled={(origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) || (origem.Codigo_Regra === 18 && !escolhasElemento[origem.Codigo_Origem])}
                    className={\`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${((origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) || (origem.Codigo_Regra === 18 && !escolhasElemento[origem.Codigo_Origem])) ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}\`}
                  >
                    Escolher
                  </button>
                )}`;
    
    const newActionBlock = `                {origem.Codigo_Per_Regra === 6 && estaExpandida ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">Escolha uma perícia abaixo primeiro</span>
                  </div>
                ) : escolhendoElementoPara === origem.Codigo_Origem ? (
                  <div className="flex flex-wrap gap-1 items-center bg-zinc-950 p-1.5 rounded border border-zinc-800">
                    <span className="text-[0.55rem] text-zinc-500 uppercase font-bold px-1 hidden sm:inline">Elemento:</span>
                    {['Sangue', 'Morte', 'Conhecimento', 'Energia'].map(elem => {
                      return (
                        <button
                          key={elem}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setEscolhendoElementoPara(null); 
                            selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2', elem);
                            setTelaAtual('classe');
                          }}
                          className={\`rounded px-1.5 py-0.5 text-[0.55rem] font-bold uppercase transition border border-zinc-700 hover:scale-105 \${
                            elem === 'Sangue' ? 'text-red-500 bg-transparent' :
                            elem === 'Morte' ? 'bg-black/50 text-white px-2' :
                            elem === 'Conhecimento' ? 'text-yellow-500 bg-transparent' :
                            'text-purple-500 bg-transparent'
                          }\`}
                        >
                          {elem}
                        </button>
                      );
                    })}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEscolhendoElementoPara(null); }}
                      className="rounded px-2 py-0.5 text-[0.55rem] font-bold uppercase transition border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (origem.Codigo_Regra === 18) {
                        setEscolhendoElementoPara(origem.Codigo_Origem);
                        return;
                      }
                      selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2');
                      setTelaAtual('classe');
                    }}
                    disabled={origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]}
                    className={\`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${(origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}\`}
                  >
                    Escolher
                  </button>
                )}`;

    c = c.replace(oldActionBlock, newActionBlock);
  }

  // 2. ModalMudarOrigem.tsx
  if (filePath.includes('ModalMudarOrigem')) {
    const oldActionBlock = `                    {origem.Codigo_Per_Regra !== 6 && origem.Codigo_Regra !== 18 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selecionarOrigem(origem);
                          onClose();
                        }}
                        className="rounded-md bg-green-700 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-100 transition hover:bg-green-600"
                      >
                        Selecionar
                      </button>
                    )}`;
    
    const newActionBlock = `                    {origem.Codigo_Per_Regra !== 6 && (
                      escolhendoElementoPara === origem.Codigo_Origem ? (
                        <div className="flex flex-wrap gap-1 items-center bg-zinc-950 p-1.5 rounded border border-zinc-800">
                          <span className="text-[0.55rem] text-zinc-500 uppercase font-bold px-1 hidden sm:inline">Elemento:</span>
                          {['Sangue', 'Morte', 'Conhecimento', 'Energia'].map(elem => {
                            return (
                              <button
                                key={elem}
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setEscolhendoElementoPara(null); 
                                  selecionarOrigem(origem, undefined, elem);
                                  onClose();
                                }}
                                className={\`rounded px-1.5 py-0.5 text-[0.55rem] font-bold uppercase transition border border-zinc-700 hover:scale-105 \${
                                  elem === 'Sangue' ? 'text-red-500 bg-transparent' :
                                  elem === 'Morte' ? 'bg-black/50 text-white px-2' :
                                  elem === 'Conhecimento' ? 'text-yellow-500 bg-transparent' :
                                  'text-purple-500 bg-transparent'
                                }\`}
                              >
                                {elem}
                              </button>
                            );
                          })}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEscolhendoElementoPara(null); }}
                            className="rounded px-2 py-0.5 text-[0.55rem] font-bold uppercase transition border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (origem.Codigo_Regra === 18) {
                              setEscolhendoElementoPara(origem.Codigo_Origem);
                              return;
                            }
                            selecionarOrigem(origem);
                            onClose();
                          }}
                          className="rounded-md bg-green-700 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-100 transition hover:bg-green-600"
                        >
                          Selecionar
                        </button>
                      )
                    )}`;

    c = c.replace(oldActionBlock, newActionBlock);

    // Also update Rule 6 confirmation button for ModalMudarOrigem to handle Rule 18 if both were somehow active (though unlikely, let's keep it robust).
    const rule6ConfirmOld = `                          onClick={() => {
                            selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem]);
                            onClose();
                          }}`;
    
    const rule6ConfirmNew = `                          onClick={(e) => {
                            e.stopPropagation();
                            if (origem.Codigo_Regra === 18) {
                              setEscolhendoElementoPara(origem.Codigo_Origem);
                              return;
                            }
                            selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem]);
                            onClose();
                          }}`;
    
    c = c.replace(rule6ConfirmOld, rule6ConfirmNew);
  }

  fs.writeFileSync(filePath, c, 'utf8');
}

applyElementPickerPattern('src/screens/OrigensScreen.tsx');
applyElementPickerPattern('src/components/ModalMudarOrigem.tsx');

