/**
 * Ordem Paranormal - API Client
 * Conecta com o backend FastAPI (/api) para buscar tabelas, regras, dados e comunicação com Battlemat.
 * Fornece interface fluente compatível com consultas (.from().select().eq().order().single()).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface QueryResult<T = any> {
  data: T | null;
  error: { message: string } | null;
}

const TABLE_ROUTER_MAP: Record<string, string> = {
  'armas': '/api/armas',
  'Armas': '/api/armas',
  'itens': '/api/itens',
  'Itens': '/api/itens',
  'itens_amaldicoados': '/api/itens-amaldicoados',
  'itens-amaldicoados': '/api/itens-amaldicoados',
  'Itens Amaldiçoados': '/api/itens-amaldicoados',
  'maldicoes': '/api/maldicoes',
  'Maldições': '/api/maldicoes',
  'modificacoes': '/api/modificacoes',
  'Modificações': '/api/modificacoes',
  'municoes': '/api/municoes',
  'Munições': '/api/municoes',
  'origens': '/api/origens',
  'Origens': '/api/origens',
  'grupos_origens': '/api/grupos-origens',
  'grupos-origens': '/api/grupos-origens',
  'Grupo de Origens': '/api/grupos-origens',
  'Grupos de Origens': '/api/grupos-origens',
  'pericias': '/api/pericias',
  'Perícias': '/api/pericias',
  'poderes': '/api/poderes',
  'Poderes': '/api/poderes',
  'poderes_paranormais': '/api/poderes-paranormais',
  'poderes-paranormais': '/api/poderes-paranormais',
  'PoderesParanormais': '/api/poderes-paranormais',
  'progressao_nex': '/api/progressao-nex',
  'progressao-nex': '/api/progressao-nex',
  'Progressão NEX': '/api/progressao-nex',
  'protecoes': '/api/protecoes',
  'Proteções': '/api/protecoes',
  'rituais': '/api/rituais',
  'Rituais': '/api/rituais',
  'simbolos_rituais': '/api/simbolos-rituais',
  'simbolos-rituais': '/api/simbolos-rituais',
  'Símbolos Rituais': '/api/simbolos-rituais',
  'trilhas': '/api/trilhas',
  'Trilhas': '/api/trilhas',
  'regras_pericias': '/api/regras-pericias',
  'regras-pericias': '/api/regras-pericias',
  'Regras Perícias': '/api/regras-pericias',
  'regras_automaticas': '/api/regras-automaticas',
  'regras-automaticas': '/api/regras-automaticas',
  'Regras Automáticas': '/api/regras-automaticas',
};

export class QueryBuilder<T = any> implements PromiseLike<QueryResult<T>> {
  private tableName: string;
  private selectedFields: string[] | null = null;
  private filters: Record<string, any> = {};
  private orderField: string | null = null;
  private isAscending: boolean = true;
  private isSingle: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields: string = '*'): this {
    if (fields && fields !== '*') {
      this.selectedFields = fields.split(',').map(f => f.trim());
    }
    return this;
  }

  eq(column: string, value: any): this {
    this.filters[column] = value;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): this {
    this.orderField = column;
    this.isAscending = options?.ascending !== false;
    return this;
  }

  single(): this {
    this.isSingle = true;
    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    try {
      const endpoint = TABLE_ROUTER_MAP[this.tableName] || `/api/data/${encodeURIComponent(this.tableName)}`;
      const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);

      // Add query parameters for known filters
      for (const [k, v] of Object.entries(this.filters)) {
        if (v !== undefined && v !== null) {
          if (k === 'Classe') url.searchParams.set('classe', String(v));
          else if (k === 'Codigo_Poder') url.searchParams.set('codigo_poder', String(v));
          else url.searchParams.set(k, String(v));
        }
      }

      if (this.orderField) {
        url.searchParams.set('order_by', this.orderField);
        url.searchParams.set('ascending', String(this.isAscending));
      }

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        return { data: null, error: { message: `HTTP ${res.status}: ${res.statusText}` } };
      }

      let data = await res.json();

      // Client-side filtering if array returned and extra filters were specified
      if (Array.isArray(data)) {
        for (const [key, value] of Object.entries(this.filters)) {
          data = data.filter((item: any) => {
            if (item[key] === undefined) return true;
            return String(item[key]).toLowerCase() === String(value).toLowerCase();
          });
        }

        // Field projection
        if (this.selectedFields && this.selectedFields.length > 0) {
          data = data.map((item: any) => {
            const projected: Record<string, any> = {};
            for (const f of this.selectedFields!) {
              projected[f] = item[f];
            }
            return projected;
          });
        }

        // Sorting
        if (this.orderField) {
          const field = this.orderField;
          const asc = this.isAscending;
          data.sort((a: any, b: any) => {
            const valA = a[field] ?? '';
            const valB = b[field] ?? '';
            if (typeof valA === 'number' && typeof valB === 'number') {
              return asc ? valA - valB : valB - valA;
            }
            return asc
              ? String(valA).localeCompare(String(valB))
              : String(valB).localeCompare(String(valA));
          });
        }

        if (this.isSingle) {
          return { data: (data[0] || null) as T, error: null };
        }
      }

      return { data: data as T, error: null };
    } catch (err: any) {
      console.error(`[API Client] Erro ao consultar ${this.tableName}:`, err);
      return { data: null, error: { message: err?.message || 'Falha na comunicação com o backend' } };
    }
  }

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export const apiClient = {
  from<T = any>(table: string) {
    return new QueryBuilder<T>(table);
  },

  // Helper endpoints
  async getArmas() { return this.from('Armas').execute(); },
  async getItens() { return this.from('Itens').execute(); },
  async getItensAmaldicoados() { return this.from('Itens Amaldiçoados').execute(); },
  async getMaldicoes() { return this.from('Maldições').execute(); },
  async getModificacoes() { return this.from('Modificações').execute(); },
  async getMunicoes() { return this.from('Munições').execute(); },
  async getOrigens() { return this.from('Origens').execute(); },
  async getGruposOrigens() { return this.from('Grupo de Origens').execute(); },
  async getPericias() { return this.from('Perícias').execute(); },
  async getPoderes(classe?: string) {
    let q = this.from('Poderes');
    if (classe) q = q.eq('Classe', classe);
    return q.execute();
  },
  async getPoderesParanormais() { return this.from('PoderesParanormais').execute(); },
  async getProgressaoNex() { return this.from('Progressão NEX').execute(); },
  async getProtecoes() { return this.from('Proteções').execute(); },
  async getRituais() { return this.from('Rituais').execute(); },
  async getSimbolosRituais() { return this.from('Símbolos Rituais').execute(); },
  async getTrilhas() { return this.from('Trilhas').execute(); },
};

export default apiClient;
