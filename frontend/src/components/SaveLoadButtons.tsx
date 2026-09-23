import React, { useRef, useState, useEffect } from 'react';
import { useRPG } from '../context/RPGContext';
import { exportarFicha, importarFicha } from '../utils/saveLoad';
import { ModalBattlematConnect } from './ModalBattlematConnect';
import { getBridgeConfig } from '../services/battlematBridge';

export const SaveLoadButtons: React.FC = () => {
  const rpg = useRPG();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bridgeConfig, setBridgeConfig] = useState(getBridgeConfig());

  useEffect(() => {
    // Atualiza o estado da config quando o modal fechar ou abrir
    setBridgeConfig(getBridgeConfig());
  }, [modalOpen]);

  const handleExport = () => {
    exportarFicha(rpg);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    importarFicha(e, rpg);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 rounded bg-green-700/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-green-100 transition hover:bg-green-600"
        title="Baixar Ficha como Arquivo JSON"
      >
        <span>⬇️ Salvar</span>
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 rounded bg-zinc-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-700"
        title="Importar Ficha de um Arquivo JSON"
      >
        <span>⬆️ Carregar</span>
      </button>

      {/* Botão de Conexão com a Mesa Digital */}
      <button
        onClick={() => setModalOpen(true)}
        className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
          bridgeConfig.enabled
            ? 'bg-red-900/80 text-red-200 border border-red-500/60 hover:bg-red-800'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
        }`}
        title="Conectar à Mesa Digital (Battlemat / Unreal Engine)"
      >
        <span>🎲</span>
        <span>
          {bridgeConfig.enabled ? `Mesa: #${bridgeConfig.tokenId}` : 'Conectar Mesa'}
        </span>
      </button>

      <ModalBattlematConnect
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
};
