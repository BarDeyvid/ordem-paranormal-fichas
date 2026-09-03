const fs = require('fs');

const file = 'src/hooks/useRituais.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace the URL mapping logic and remove the aggressive preload loop
const oldBlock = `          const simbolosTransformados = (simbolosRes.data || [])
            .filter(row => row.Link_Imagem)
            .map(row => {
              const rawUrl = row.Link_Imagem.replace(/[?&]dl=[01]/, (m: string) => m[0] + 'raw=1');
              return { codigo: Number(row.Codigo_Ritual), url: rawUrl };
            });
          setSimbolosRaw(simbolosTransformados);
          
          // Pre-load the images in the background so they appear instantly
          simbolosTransformados.forEach(s => {
            const img = new Image();
            img.src = s.url;
          });`;

const newBlock = `          const simbolosTransformados = (simbolosRes.data || [])
            .filter(row => row.Link_Imagem)
            .map(row => {
              // Converter links do Dropbox para links diretos (CDN) que evitam o redirecionamento (302) e carregam mais rápido
              let rawUrl = row.Link_Imagem;
              if (rawUrl.includes('dropbox.com')) {
                rawUrl = rawUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace(/[?&]dl=[01]/, '');
              }
              return { codigo: Number(row.Codigo_Ritual), url: rawUrl };
            });
          setSimbolosRaw(simbolosTransformados);
          
          // NOTA: O pre-load agressivo (new Image().src) foi removido pois estava engarrafando a fila de download 
          // do navegador (são ~76 imagens). Agora o navegador só baixa o que realmente aparece na tela, com os links ultra rápidos do CDN.`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(file, content);
  console.log('Optimized useRituais.ts');
} else {
  // Let's try matching with regex to be safe against CRLF
  const regex = /const simbolosTransformados = [\s\S]*?img\.src = s\.url;\s*\}\);/m;
  if (content.match(regex)) {
    content = content.replace(regex, newBlock);
    fs.writeFileSync(file, content);
    console.log('Optimized useRituais.ts via Regex');
  } else {
    console.log('Could not find the block in useRituais.ts');
  }
}
