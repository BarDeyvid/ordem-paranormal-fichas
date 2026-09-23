"""
Ordem Paranormal - CLI Utility
Ferramenta de linha de comando para gerenciamento de banco de dados,
auditoria de regras, cálculos de fichas e testes de dados.
"""

import sys
import argparse
import json
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app.db.database import init_db, query_table
from app.services.validator import auditar_compendio
from app.services.dice import rolar_dados
from app.services.calculator import calcular_estatisticas_personagem
from app.models.schemas import RollRequestSchema, CalculoRequestSchema, AtributosBase

def cmd_audit(args):
    """Executa auditoria no banco de dados e exibe relatório."""
    print("=" * 60)
    print("🔍 AUDITORIA DO COMPÊNDIO DE ORDEM PARANORMAL")
    print("=" * 60)
    report = auditar_compendio()
    print(f"Status Geral:       {report.status_geral}")
    print(f"Total de Tabelas:   {report.total_tabelas}")
    print(f"Total de Registros: {report.total_registros}")
    print(f"Regras Automáticas: {report.regras_cadastradas}")
    print("-" * 60)
    print(f"{'Tabela':<25} | {'Registros':<10} | {'Status':<10}")
    print("-" * 60)
    for t in report.tabelas:
        print(f"{t.tabela:<25} | {t.total_linhas:<10} | {t.status:<10}")
        if t.erros:
            for err in t.erros:
                print(f"   ⚠️  {err}")
    print("=" * 60)

def cmd_seed(args):
    """Inicializa ou re-popula as tabelas a partir dos arquivos JSON."""
    print("🌱 Inicializando e verificando banco de dados SQLite...")
    init_db()
    print("✅ Banco de dados sincronizado com sucesso!")

def cmd_roll(args):
    """Rola uma expressão de dados."""
    expr = args.expressao or "1d20+5"
    crit = args.critico or 20
    req = RollRequestSchema(expressao=expr, margem_critico=crit, descricao="Rolagem CLI")
    res = rolar_dados(req)

    print("-" * 40)
    print(f"🎲 Rolagem: {res.expressao_original}")
    print(f"📊 Detalhes: {res.detalhes}")
    print(f"🏆 Total:    {res.total}")
    if res.eh_critico:
        print("⚡ CRÍTICO!")
    if res.eh_desastre:
        print("💀 DESASTRE!")
    print("-" * 40)

def cmd_calc(args):
    """Calcula estatísticas de um personagem."""
    classe = args.classe or "Combatente"
    nex = args.nex or 10
    req = CalculoRequestSchema(
        classe=classe,
        nex=nex,
        atributos=AtributosBase(FOR=args.forca, AGI=args.agilidade, INT=args.intelecto, PRE=args.presenca, VIG=args.vigor),
        regras_ativas=[]
    )
    res = calcular_estatisticas_personagem(req)
    print("=" * 50)
    print(f"👤 FICHA CALCULADA: {classe} (NEX {nex}%)")
    print("=" * 50)
    print(f"❤️  Pontos de Vida (PV Máx):   {res.pv_max}")
    print(f"⚡ Pontos de Esforço (PE Máx): {res.pe_max}")
    print(f"🧠 Sanidade (SAN Máx):         {res.san_max}")
    print(f"🔥 Limite PE por Rodada:       {res.pe_rodada}")
    print(f"🛡️  Defesa Total:               {res.defesa_total} (Esquiva: {res.esquiva} | Bloqueio: {res.bloqueio})")
    print(f"🔮 DT de Rituais:              {res.dt_rituais}")
    print(f"🏃 Deslocamento:               {res.deslocamento}m")
    print(f"🎒 Capacidade de Carga:        {res.capacidade_carga} espaços")
    print("=" * 50)

def main():
    parser = argparse.ArgumentParser(description="Ordem Paranormal CLI")
    subparsers = parser.add_subparsers(dest="command", help="Comandos disponíveis")

    # Audit
    subparsers.add_parser("audit", help="Audita a integridade do compêndio")

    # Seed
    subparsers.add_parser("seed", help="Verifica e popula o banco de dados")

    # Roll
    roll_p = subparsers.add_parser("roll", help="Rola dados de RPG")
    roll_p.add_argument("expressao", nargs="?", default="1d20+5", help="Expressão de dados (ex: 3d20k1, 2d8+3)")
    roll_p.add_argument("--critico", type=int, default=20, help="Margem de crítico")

    # Calc
    calc_p = subparsers.add_parser("calc", help="Calcula estatísticas de personagem")
    calc_p.add_argument("--classe", default="Combatente", help="Classe (Combatente, Especialista, Ocultista)")
    calc_p.add_argument("--nex", type=int, default=10, help="NEX do personagem (ex: 5, 10, 50)")
    calc_p.add_argument("--forca", type=int, default=2, help="Força")
    calc_p.add_argument("--agilidade", type=int, default=2, help="Agilidade")
    calc_p.add_argument("--intelecto", type=int, default=1, help="Intelecto")
    calc_p.add_argument("--presenca", type=int, default=1, help="Presença")
    calc_p.add_argument("--vigor", type=int, default=2, help="Vigor")

    args = parser.parse_args()

    if args.command == "audit":
        cmd_audit(args)
    elif args.command == "seed":
        cmd_seed(args)
    elif args.command == "roll":
        cmd_roll(args)
    elif args.command == "calc":
        cmd_calc(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
