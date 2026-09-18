import React, { useEffect, useRef } from 'react';

const PALAVRAS = [
  "Abundância", "Ação", "Adaptabilidade", "Alegria", "Alinhamento", "Amor", "Ansiedade", "Apatia", "Apego", "Aplauso", 
  "Astúcia", "Autoridade", "Aventura", "Caos", "Caridade", "Celebração", "Ciclos", "Clareza", "Colaboração", "Compaixão", 
  "Competição", "Conclusão", "Confiança", "Conflito", "Confusão", "Conforto", "Conservadorismo", "Controle", "Coragem", 
  "Criatividade", "Crenças", "Culpa", "Cura", "Curiosidade", "Dedicação", "Defesa", "Derrota", "Desafios", "Desapego", 
  "Desapontamento", "Descanso", "Despertar", "Destino", "Determinação", "Diplomacia", "Economia", "Empatia", "Ensino", 
  "Entusiasmo", "Equilíbrio", "Escassez", "Esgotamento", "Esperança", "Espontaneidade", "Espiritualidade", "Estabilidade", 
  "Estratégia", "Estudo", "Estrutura", "Ética", "Expansão", "Exploração", "Fantasias", "Fé", "Fertilidade", "Foco", 
  "Generosidade", "Habilidade", "Harmonia", "Herança", "Honra", "Horizontes", "Idealismo", "Ilusão", "Ilusões", "Impasse", 
  "Impotência", "Impulso", "Incerteza", "Inconsciente", "Indecisão", "Independência", "Infância", "Ingenuidade", "Inocência", 
  "Inspiração", "Intimidade", "Introspecção", "Intuição", "Isolamento", "Justiça", "Legado", "Lei", "Liberdade", "Liderança", 
  "Luxo", "Maestria", "Magnetismo", "Manifestação", "Materialismo", "Meditação", "Medo", "Memórias", "Mistério", "Moderação", 
  "Mudança", "Natureza", "Nostalgia", "Otimismo", "Ousadia", "Paciência", "Paixão", "Parceria", "Partida", "Pausa", "Perda", 
  "Perseverança", "Persistência", "Pesadelos", "Peso", "Planejamento", "Poder", "Progresso", "Prosperidade", "Rapidez", 
  "Realização", "Reciprocidade", "Reconhecimento", "Recuperação", "Reencontro", "Renascimento", "Resiliência", "Resistência", 
  "Risco", "Romantismo", "Rotina", "Ruína", "Ruptura", "Sabedoria", "Sacrifício", "Satisfação", "Sedução", "Segredo", 
  "Segurança", "Sensibilidade", "Serenidade", "Solidão", "Sombras", "Sucesso", "Tédio", "Totalidade", "Tradição", "Transição", 
  "Traição", "Tristeza", "União", "Verdade", "Viagem", "Vigilância", "Visão", "Vitalidade", "Vitória"
];

const PALAVRAS_SANGUE = [
  "Obsessão", "Fúria", "Paixão", "Rancor", "Euforia", "Impulso", "Desespero", "Fanatismo", 
  "Carne", "Pulsação", "Vísceras", "Artéria", "Hemoglobina", "Medula", "Fluido", "Coração", 
  "Dilaceração", "Sacrifício", "Chacina", "Martírio", "Crueldade", "Flagelo", "Tormento", 
  "Sede", "Massacre", "Rubro", "Escarlate", "Carmesim", "Fervura", "Simbiose", "Linhagem", 
  "Laço", "Sanguinolento"
];

function textoParaBinario(texto: string) {
  return texto.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');
}

const ESTRUTURA = [
  { left: '0vw', colunas: [30, 28, 23, 23, 24, 15, 16] },
  { left: '15vw', colunas: [4, 16, 22, 18, 6] },
  { left: '29vw', colunas: [6, 12, 21, 16, 3] },
  { left: '47vw', colunas: [4, 10, 11, 3] },
  { left: '62vw', colunas: [18, 25, 17] },
  { left: '75vw', colunas: [3, 6, 18, 17, 9, 3] },
  { right: '0vw', colunas: [12, 16, 13, 20, 24, 22, 28, 33] }
];

const ESTRUTURA_ESPARSA = [
  { top: '15%', left: '3vw', colunas: [10] },
  { top: '35%', left: '12vw', colunas: [6, 12] },
  { top: '55%', left: '5vw', colunas: [15] },
  { top: '75%', left: '18vw', colunas: [8] },
  { top: '22%', right: '7vw', colunas: [14] },
  { top: '42%', right: '16vw', colunas: [8, 11] },
  { top: '68%', right: '4vw', colunas: [16] },
  { top: '85%', right: '14vw', colunas: [7, 5] },
];

const Coluna = React.memo(({ altura, afinidade }: { altura: number, afinidade?: string | null }) => {
  const isConhecimento = afinidade === 'Conhecimento';
  const isSangue = afinidade === 'Sangue';
  const isMorte = afinidade === 'Morte';
  const charBase = isConhecimento ? 'O' : '0'; 

  // Guardamos o texto final como uma string. Se for morte, guardamos o HTML inteiro.
  const [texto, setTexto] = React.useState<string>('');
  
  const [{ delay, duration }] = React.useState(() => ({
    delay: (Math.random() * 10).toFixed(2),
    duration: (Math.random() * 5 + 6).toFixed(2)
  }));

  useEffect(() => {
    const gerarTexto = (conteudoStr: string) => {
      if (isMorte) {
        // Pro tema de morte, geramos spans brutos na string pra injetar direto no HTML
        // Isso burla o React Virtual DOM e acaba com o lag de criar milhares de nós
        let html = '';
        for (let i = 0; i < altura; i++) {
          html += `<span>${conteudoStr[i] || charBase}</span>\n`;
        }
        return html;
      }
      return conteudoStr.split('').join('\n');
    };

    setTexto(gerarTexto(charBase.repeat(altura)));

    const tempoDeEspera = Math.random() * 2000;
    
    const iniciarCiclo = () => {
      const listaMestre = isSangue ? PALAVRAS_SANGUE : PALAVRAS;
      const palavra = listaMestre[Math.floor(Math.random() * listaMestre.length)];
      
      let conteudo = '';
      if (isConhecimento || isSangue) {
        conteudo = palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
      } else {
        conteudo = textoParaBinario(palavra);
      }
      
      let stringFinal = conteudo;
      while (stringFinal.length < altura) {
        stringFinal += conteudo;
      }
      stringFinal = stringFinal.substring(0, altura);

      if (isSangue) {
        let charsSujos = stringFinal.split('').map(c => {
          if (Math.random() < 0.1) return '|';
          if (Math.random() < 0.1) return 'v';
          if (Math.random() < 0.1) return '.';
          return c;
        });
        setTexto(gerarTexto(charsSujos.join('')));
      } else {
        setTexto(gerarTexto(stringFinal));
      }
      
      const tempoVisivel = isConhecimento 
        ? Math.random() * 10000 + 15000  
        : Math.random() * 3000 + 2000;

      setTimeout(() => {
        setTexto(gerarTexto(charBase.repeat(altura)));
      }, tempoVisivel);
    };

    let intervalo: NodeJS.Timeout;
    
    const timerInicial = setTimeout(() => {
      iniciarCiclo();
      
      const tempoCiclo = isConhecimento 
        ? Math.random() * 12000 + 18000 
        : Math.random() * 4000 + 3000;

      intervalo = setInterval(iniciarCiclo, tempoCiclo); 
    }, tempoDeEspera);

    return () => {
      clearTimeout(timerInicial);
      if (intervalo) clearInterval(intervalo);
    };
  }, [altura, isConhecimento, isSangue, isMorte, charBase]);

  let cssClasses = 'coluna';
  if (isConhecimento) cssClasses += ' coluna-conhecimento';
  if (isSangue) cssClasses += ' coluna-sangue';

  const styleProps = { 
    '--delay': `${delay}s`, 
    '--duracao': `${duration}s` 
  } as React.CSSProperties;

  if (isMorte) {
    return <div className={cssClasses} style={styleProps} dangerouslySetInnerHTML={{ __html: texto }} />;
  }

  return (
    <div className={cssClasses} style={styleProps}>
      {texto}
    </div>
  );
});

export const MatrixBackground = React.memo(({ afinidade }: { afinidade?: string | null }) => {
  const isMorte = afinidade === 'Morte';
  const isSangue = afinidade === 'Sangue';

  // Define qual classe de tema aplicar
  let temaClasse = '';
  if (isMorte) temaClasse = 'tema-morte';
  else if (isSangue) temaClasse = 'tema-sangue';

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Sigilos';
          src: url('/fonts/SigilosDoOutroLado-Regular.ttf') format('truetype');
        }

        #fundo-cascata {
          position: absolute; 
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          height: 100%; 
          -webkit-user-select: none;
          user-select: none;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        /* TEMA: MORTE (TEMPO INVERTIDO)
           Gira a matrix inteira de cabeça pra baixo. 
           Isso faz a chuva subir, as gotas irem do chão pro teto, e os caracteres ficarem invertidos! */
        #fundo-cascata.tema-morte {
          transform: translateX(-50%) rotate(180deg);
        }

        /* Deixamos as cores de Morte com um tom mais cinza-cinza-escuro em vez de puro branco/preto */
        #fundo-cascata.tema-morte .coluna {
          background-image: linear-gradient(to bottom, #111111 0%, #333333 60%, #666666 85%, #999999 97%, #111111 100%);
        }

        /* Faz os caracteres da morte alternarem entre invertidos e retos aleatoriamente */
        #fundo-cascata.tema-morte .coluna span {
          display: block;
          height: 16px;
          text-align: center;
          animation: glitchFlip 4s infinite;
        }
        #fundo-cascata.tema-morte .coluna span:nth-of-type(2n) { animation-duration: 3.2s; animation-delay: -0.2s; }
        #fundo-cascata.tema-morte .coluna span:nth-of-type(3n) { animation-duration: 4.5s; animation-delay: -1.1s; }
        #fundo-cascata.tema-morte .coluna span:nth-of-type(5n) { animation-duration: 2.8s; animation-delay: -0.7s; }
        #fundo-cascata.tema-morte .coluna span:nth-of-type(7n) { animation-duration: 5.1s; animation-delay: -2.3s; }

        @keyframes glitchFlip {
          0%, 45% { transform: rotateX(0deg); }
          50%, 95% { transform: rotateX(180deg); }
          100% { transform: rotateX(360deg); }
        }

        /* --- ESTILOS DA CHUVA (NORMAL, CONHECIMENTO E SANGUE) --- */
        #fundo-cascata .bolinho {
          position: absolute;
          display: flex;
          -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
        }

        #fundo-cascata .bolinho-esparso {
          opacity: 0.65;
        }

        #fundo-cascata .bolinho-bottom {
          align-items: flex-end;
          -webkit-mask-image: linear-gradient(to top, black 60%, transparent 100%);
          mask-image: linear-gradient(to top, black 60%, transparent 100%);
        }

        #fundo-cascata .coluna {
          font-family: 'Courier New', Courier, monospace;
          font-size: 16px;
          line-height: 16px;
          width: 14px; 
          text-align: center;
          white-space: pre;
          overflow: hidden;
          
          color: transparent;
          background-image: linear-gradient(to bottom, #333333 0%, #333333 60%, #444444 85%, #666666 97%, #333333 100%);
          background-size: 100% 100vh; 
          background-repeat: repeat-y;
          
          animation: luzCaindo var(--duracao) linear infinite;
          animation-delay: var(--delay);
          -webkit-background-clip: text;
          background-clip: text;
        }

        /* TEMA: CONHECIMENTO (SIGILOS + DOURADO SUTIL) */
        #fundo-cascata .coluna.coluna-conhecimento {
          font-family: 'Sigilos', 'Courier New', monospace;
          background-image: linear-gradient(to bottom, #2b271a 0%, #2b271a 60%, #4a431c 85%, #88742b 97%, #2b271a 100%);
          font-size: 18px; 
        }

        /* TEMA: SANGUE (VERMELHO VISCOSO) */
        #fundo-cascata .coluna.coluna-sangue {
          font-weight: bold;
          line-height: 14px;
          background-image: linear-gradient(to bottom, #2b0000 0%, #4a0000 60%, #990000 85%, #ff1a1a 97%, #2b0000 100%);
          animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        @keyframes luzCaindo {
          0% { background-position: 0px -100vh; }
          100% { background-position: 0px 0vh; }
        }
      `}</style>
      
      <div id="fundo-cascata" className={temaClasse}>
        {/* CHUVA DO TOPO */}
        {ESTRUTURA.map((bolinho, i) => (
          <div 
            key={`top-${i}`} 
            className="bolinho" 
            style={{ 
              top: 0,
              ...(bolinho.right !== undefined ? { right: bolinho.right } : { left: bolinho.left }) 
            }}
          >
            {bolinho.colunas.map((altura, j) => (
              <Coluna key={j} altura={altura} afinidade={afinidade} />
            ))}
          </div>
        ))}

        {/* CHUVAS ESPARSAS (LATERAIS) */}
        {ESTRUTURA_ESPARSA.map((bolinho, i) => (
          <div 
            key={`esparsa-${i}`} 
            className="bolinho bolinho-esparso" 
            style={{ 
              top: bolinho.top,
              ...(bolinho.right !== undefined ? { right: bolinho.right } : { left: bolinho.left }) 
            }}
          >
            {bolinho.colunas.map((altura, j) => (
              <Coluna key={j} altura={altura} afinidade={afinidade} />
            ))}
          </div>
        ))}

        {/* CHUVA DO FUNDO (INVERTIDA) */}
        {ESTRUTURA.map((bolinho, i) => (
          <div 
            key={`bottom-${i}`} 
            className="bolinho bolinho-bottom" 
            style={{ 
              bottom: 0,
              ...(bolinho.right !== undefined ? { right: bolinho.right } : { left: bolinho.left }) 
            }}
          >
            {bolinho.colunas.map((altura, j) => (
              <Coluna key={j} altura={altura} afinidade={afinidade} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
});
