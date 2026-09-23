from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any, Union

class BaseSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="allow")

# ============================================================
# ATRIBUTOS
# ============================================================
class AtributosBase(BaseSchema):
    FOR: int = Field(1, description="Força")
    AGI: int = Field(1, description="Agilidade")
    INT: int = Field(1, description="Intelecto")
    PRE: int = Field(1, description="Presença")
    VIG: int = Field(1, description="Vigor")

# ============================================================
# COMPÊNDIO: ARMAS E EQUIPAMENTOS
# ============================================================
class ArmaSchema(BaseSchema):
    Codigo_Arma: int
    Nome_Item: str
    Descricao_Item: Optional[str] = ""
    Proficiencia: Optional[str] = "Armas Simples"
    Tipo_Arma: Optional[str] = "Corpo a Corpo"
    Empunhadura_Arma: Optional[str] = "Uma Mão"
    Dano_Arma: Optional[str] = "1d4"
    Critico_Arma: Optional[Union[int, str]] = 20
    Multiplicador_Arma: Optional[Union[int, str]] = 2
    Tipo_Dano_Arma: Optional[str] = "Impacto"
    Alcance_Item: Optional[str] = None
    Categoria_Item: Optional[Union[str, int]] = "0"
    Espacos_Item: Optional[Union[int, float, str]] = Field(None, alias="Espaços_Item")
    Agil: Optional[Union[bool, str]] = Field(None, alias="Agil?")
    Capacidade_Municao: Optional[Union[int, str]] = None
    dt_item: Optional[str] = None
    Automatica: Optional[Union[bool, str]] = Field(None, alias="Automatica?")
    Fonte_Arma: Optional[str] = "OPRPG"

class ProtecaoSchema(BaseSchema):
    Codigo_Protecao: int
    Proficiencia: Optional[str] = "Proteções Leves"
    Nome_Protecao: str
    Descricao_Protecao: Optional[str] = ""
    Defesa_Protecao: Optional[Union[int, str]] = 2
    Espacos_Protecao: Optional[Union[int, float, str]] = 2
    Categoria_Protecao: Optional[Union[str, int]] = "I"

class ItemGeralSchema(BaseSchema):
    Codigo_Item: int
    Grupo_Item: Optional[str] = "Geral"
    Nome_Item: str
    Desc_Item: Optional[str] = ""
    Categoria_Item: Optional[Union[str, int]] = "0"
    Espacos_Itens: Optional[Union[int, float, str]] = 1
    Dt_Item: Optional[str] = None
    Fonte_Item: Optional[str] = "OPRPG"

class MunicaoSchema(BaseSchema):
    Codigo_Municao: int
    Nome_Item: str
    Descricao_Item: Optional[str] = ""
    Tipo_Arma: Optional[str] = "Arma de Fogo"
    Categoria_Item: Optional[Union[str, int]] = "I"
    Espacos_Item: Optional[Union[int, float, str]] = Field(1, alias="Espaços_Item")
    Capacidade_Municao: Optional[Union[int, str]] = None

class MaldicaoSchema(BaseSchema):
    Codigo_Mald: int
    Categoria_Mald: Optional[str] = "II"
    Nome_Mald: str
    Descricao_Mald: Optional[str] = ""
    Elemento_Mald: Optional[str] = "Sangue"
    Efeito: Optional[str] = ""

class ModificacaoSchema(BaseSchema):
    Codigo_Modif: int
    Categoria_Modif: Optional[str] = "I"
    Nome_Modif: str
    Descricao_Modif: Optional[str] = ""
    Multiplica: Optional[Union[bool, str]] = Field(None, alias="Multiplica?")
    Efeito: Optional[str] = ""

class ItemAmaldicoadoSchema(BaseSchema):
    Codigo_Item_Ama: int
    Nome_Ama: str
    Desc_Ama: Optional[str] = ""
    Espacos_Ama: Optional[Union[int, float, str]] = 1
    Categoria_Ama: Optional[Union[str, int]] = "II"
    DT_Ama: Optional[str] = None
    Elemento_Ama: Optional[str] = "Sangue"
    Fonte_Ama: Optional[str] = "OPRPG"
    Vestimenta: Optional[Union[bool, str]] = Field(None, alias="Vestimenta?")
    Bonus_Vestimenta: Optional[str] = None

# ============================================================
# RITUAIS E SÍMBOLOS
# ============================================================
class RitualSchema(BaseSchema):
    Codigo_Ritual: int
    Nome_Ritual: str
    Descricao_Ritual: Optional[str] = ""
    Elemento_Ritual: Optional[str] = "Morte"
    Circulo_Ritual: int = 1
    PE_Ritual: Optional[str] = "1"
    Execucao_Ritual: Optional[str] = "Padrão"
    Alcance_Ritual: Optional[str] = "Curto"
    Area_Ritual: Optional[str] = None
    Alvo_Ritual: Optional[str] = None
    Duracao_Ritual: Optional[str] = "Instantânea"
    Efeito_Ritual: Optional[str] = None
    Resistencia_Ritual: Optional[str] = None
    Dados_Ritual: Optional[str] = None
    Tem_Discente: Optional[Union[bool, str]] = Field(False, alias="Tem Discente?")
    Tem_Verdadeiro: Optional[Union[bool, str]] = Field(False, alias="Tem Verdadeiro?")
    Imagem: Optional[str] = None
    Requisito_Discente: Optional[str] = None
    Requisito_Verdadeiro: Optional[str] = None

class SimboloRitualSchema(BaseSchema):
    Codigo_Ritual: int
    Link_Imagem: str

# ============================================================
# PODERES, ORIGENS E PROGRESSÃO
# ============================================================
class PoderSchema(BaseSchema):
    Codigo_Poder: int
    Nome: str
    Descricao: Optional[str] = ""
    Classe: Optional[str] = "Combatente"
    Tipo: Optional[str] = "Classe"
    PreRequisitos: Optional[str] = Field(None, alias="Pre-Requisitos")
    Fonte: Optional[str] = "OPRPG"
    Pre_Codigo: Optional[int] = None
    Codigo_Regra: Optional[int] = None
    Pericia_Poder: Optional[int] = None
    Automatico: Optional[str] = None

class PoderParanormalSchema(BaseSchema):
    Codigo_Poder: int
    Nome: str
    Descricao: Optional[str] = ""
    Elemento: Optional[str] = "Sangue"
    Afinidade: Optional[str] = None
    PreRequisitos: Optional[str] = Field(None, alias="Pre-Requisitos")
    Fonte: Optional[str] = "OPRPG"
    Pre_Codigo: Optional[int] = None
    PreRequisitosAfinidade: Optional[str] = None
    Pre_Codigo_Afinidade: Optional[int] = None
    Codigo_Regra: Optional[int] = None
    Codigo_Regra_Afinidade: Optional[int] = None
    Automatico: Optional[str] = Field(None, alias="Automatico?")
    Automatico_Afinidade: Optional[str] = Field(None, alias="Automatico?_Afinidade")

class OrigemSchema(BaseSchema):
    Codigo_Origem: int
    Codigo_Grupo: Optional[int] = None
    Codigo_Regra: Optional[int] = None
    Codigo_Per_Regra: Optional[int] = None
    Nome: str
    Descricao: Optional[str] = ""
    Pericia_Treinada_1: Optional[int] = None
    Pericia_Treinada_2: Optional[int] = None
    Pericia_Treinada_Especial: Optional[Union[int, str]] = None
    Nome_Poder: Optional[str] = ""
    Descricao_Poder: Optional[str] = ""
    Fonte: Optional[str] = "OPRPG"

class GrupoOrigemSchema(BaseSchema):
    Codigo_Grupo: int
    Nome_Grupo: str
    Descricao_Grupo: Optional[str] = ""

class TrilhaSchema(BaseSchema):
    Codigo_Trilha: int
    Classe_Trilha: str
    Nome_Trilha: str
    Descricao_Trilha: Optional[str] = ""
    Especial_Trilha: Optional[str] = None
    Pericia_Trilha: Optional[int] = Field(None, alias="Perícia_Trilha")
    Nome_Habilidade_10: Optional[str] = ""
    Descricao_Habilidade_10: Optional[str] = ""
    Nome_Habilidade_40: Optional[str] = ""
    Descricao_Habilidade_40: Optional[str] = ""
    Nome_Habilidade_65: Optional[str] = ""
    Descricao_Habilidade_65: Optional[str] = ""
    Nome_Habilidade_99: Optional[str] = ""
    Descricao_Habilidade_99: Optional[str] = ""
    Fonte_Trilha: Optional[str] = "OPRPG"

class PericiaSchema(BaseSchema):
    Codigo_Pericia: int
    Nome_Pericia: str
    Atributo_Pericia: str
    Kit: Optional[Union[bool, str]] = False
    Desc_Pericia: Optional[str] = ""

class ProgressaoNexSchema(BaseSchema):
    Codigo_Progrecao: int
    Nex_Progrecao: str
    Desc_Progrecao: str
    Elemento_Progrecao: Optional[str] = None

class RegraAutomaticaSchema(BaseSchema):
    Codigo_Regra: int
    Descricao_Regra: str

class RegraPericiaSchema(BaseSchema):
    Codigo_Per_Regra: int
    Descricao_Regra: str

# ============================================================
# CÁLCULOS E FICHA
# ============================================================
class CalculoRequestSchema(BaseSchema):
    classe: str = Field("Combatente", description="Combatente, Especialista ou Ocultista")
    nex: int = Field(5, ge=0, le=99, description="NEX do personagem (0 a 99)")
    nivel: Optional[int] = Field(1, ge=1, le=20, description="Nível se usando regras de nível")
    usar_nivel: bool = Field(False, description="Usar nível em vez de NEX direto")
    atributos: AtributosBase
    regras_ativas: List[int] = Field(default_factory=list, description="IDs de regras automáticas ativas")
    defesa_equipamentos: int = Field(0, description="Defesa vinda de proteções equipadas")
    defesa_outros: int = Field(0, description="Bônus avulsos de defesa")
    bonus_pv_vestimentas: int = Field(0, description="Bônus de PV de vestimentas/maldições")
    bonus_pe_vestimentas: int = Field(0, description="Bônus de PE de vestimentas/maldições")

class CalculoResponseSchema(BaseSchema):
    pv_max: int
    pe_max: int
    san_max: int
    pe_rodada: int
    defesa_total: int
    esquiva: int
    bloqueio: int
    dt_rituais: int
    deslocamento: int
    capacidade_carga: int
    atributos_finais: AtributosBase
    passivos_aplicados: List[str]

# ============================================================
# DADOS (DICE ROLLER)
# ============================================================
class RollRequestSchema(BaseSchema):
    expressao: str = Field("1d20+5", description="Ex: 1d20+5, 3d20k1, 2d8+3, 1d20-2")
    margem_critico: int = Field(20, ge=1, le=20, description="Margem de ameaça para crítico")
    descricao: Optional[str] = Field("Teste", description="Nome ou propósito do teste")

class DieResult(BaseSchema):
    faces: int
    valor: int
    mantido: bool = True
    critico: bool = False
    desastre: bool = False

class RollResponseSchema(BaseSchema):
    expressao_original: str
    total: int
    dados_rolados: List[DieResult]
    modificador: int
    eh_critico: bool
    eh_desastre: bool
    detalhes: str
    descricao: str

# ============================================================
# PERSISTÊNCIA DE FICHAS
# ============================================================
class FichaSchema(BaseSchema):
    id: Optional[str] = None
    nome: str = "Investigador"
    classe: str = "Investigador"
    nex: int = 5
    conteudo: Dict[str, Any]

# ============================================================
# AUDITORIA DO COMPÊNDIO
# ============================================================
class TableAuditInfo(BaseSchema):
    tabela: str
    total_linhas: int
    status: str
    erros: List[str] = Field(default_factory=list)

class AuditReportSchema(BaseSchema):
    status_geral: str
    total_tabelas: int
    total_registros: int
    tabelas: List[TableAuditInfo]
    regras_cadastradas: int
