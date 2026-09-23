import React, { useState, useEffect } from 'react';
import {
  getBridgeConfig,
  saveBridgeConfig,
  testBridgeConnection,
  sendCharacterStatus,
  type BattlematConfig,
} from '../services/battlematBridge';
import { useRPG } from '../context/RPGContext';

interface ModalBattlematConnectProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalBattlematConnect: React.FC<ModalBattlematConnectProps> = ({ isOpen, onClose }) => {
  const rpg = useRPG();
  const [config, setConfig] = useState<BattlematConfig>(getBridgeConfig());
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getBridgeConfig());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testBridgeConnection(config.host);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = async () => {
    saveBridgeConfig(config);
    if (config.enabled) {
      // Já dispara o status atual imediatamente após salvar
      await sendCharacterStatus(
        rpg.nomeEditando || 'Investigador',
        rpg.classe || 'Investigador',
        rpg.status.pvAtual,
        rpg.status.pvMax,
        rpg.status.sanAtual,
        rpg.status.sanMax,
        rpg.status.peAtual,
        rpg.status.peMax
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-zinc-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎲</span>
            <h2 className="text-lg font-bold tracking-wide uppercase text-zinc-200">
              Conexão com a Mesa Digital
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 transition text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
          Projeta seus <strong className="text-zinc-200">Pontos de Vida, Sanidade, PE</strong> e rituais diretamente sob a sua miniatura física no monitor da mesa através de visão computacional.
        </p>

        <div className="space-y-4">
          {/* Toggle Ativar */}
          <div className="flex items-center justify-between rounded-lg bg-zinc-800/60 p-3 border border-zinc-700/50">
            <div>
              <span className="text-sm font-semibold text-zinc-200">Transmitir para a Mesa</span>
              <p className="text-xs text-zinc-400">Sincroniza dano e cura em tempo real</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {/* Miniatura Física (ID ArUco) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Qual é a sua Miniatura Física?
            </label>
            <select
              value={config.tokenId}
              onChange={(e) => setConfig({ ...config, tokenId: Number(e.target.value) })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-red-500 focus:outline-none"
            >
              <option value={1}>Token #1 (Investigador 1)</option>
              <option value={2}>Token #2 (Investigador 2)</option>
              <option value={3}>Token #3 (Investigador 3)</option>
              <option value={4}>Token #4 (Investigador 4)</option>
              <option value={5}>Token #5 (Investigador 5)</option>
              <option value={20}>Token #20 (NPC / Aliado)</option>
            </select>
          </div>

          {/* Endereço IP / Host */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Endereço da Mesa (IP ou Localhost)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={config.host}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                placeholder="ex: localhost:8080 ou 192.168.1.15:8080"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="rounded-lg bg-zinc-700 hover:bg-zinc-600 px-3 py-2 text-xs font-bold text-zinc-200 transition disabled:opacity-50"
              >
                {testing ? 'Testando...' : 'Testar'}
              </button>
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Se estiver no mesmo PC, use <code>localhost:8080</code>. No celular/Wi-Fi, use o IP do PC do mestre.
            </span>
          </div>

          {/* Feedback do Teste */}
          {testResult && (
            <div
              className={`rounded-lg p-3 text-xs border ${
                testResult.success
                  ? 'border-green-500/50 bg-green-950/40 text-green-300'
                  : 'border-red-500/50 bg-red-950/40 text-red-300'
              }`}
            >
              <strong>{testResult.success ? '✓ Sucesso: ' : '✕ Falha: '}</strong>
              {testResult.message}
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex justify-end gap-3 border-t border-zinc-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-red-700 hover:bg-red-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition"
          >
            Salvar e Conectar
          </button>
        </div>
      </div>
    </div>
  );
};
