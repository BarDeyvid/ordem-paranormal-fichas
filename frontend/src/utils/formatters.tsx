import React from 'react';

export function formatarTexto(texto: string) {
  if (!texto) return texto;
  if (typeof texto !== 'string') return String(texto);

  // Divide o texto onde encontrar *texto* ou _texto_
  const parts = texto.split(/(\*[^*]+\*|_[^_]+_)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <strong key={index} className="font-bold text-zinc-200">{part.slice(1, -1)}</strong>;
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
      return <em key={index} className="italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function formatarDescricao(texto: string): string {
  if (!texto) return '';
  let resultado = texto;
  if (!resultado.includes('<') && !resultado.includes('&')) {
    resultado = resultado
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    resultado = resultado.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    resultado = resultado.replace(/_(.*?)_/g, '<em>$1</em>');
  }
  resultado = resultado.replace(/\n/g, '<br />');
  return resultado;
}
