export type TipoInspecao = 'Ordinária' | 'Extraordinária' | 'Correicional'

export type AreaInspecionada =
  | 'Cela'
  | 'Pátio'
  | 'Cozinha'
  | 'Enfermaria'
  | 'Administração'
  | 'Oficina'
  | 'Visita Social'
  | 'Visita Íntima'
  | 'Triagem'
  | 'Outro'

export type CategoriaConstatacao =
  | 'Infraestrutura'
  | 'Saúde'
  | 'Segurança'
  | 'Alimentação'
  | 'Superlotação'
  | 'Direitos Humanos'
  | 'Outro'

export type GravidadeConstatacao = 'Crítica' | 'Alta' | 'Média' | 'Baixa'

export type StatusInspecao = 'Rascunho' | 'Finalizado' | 'Enviado'

export interface Geolocalizacao {
  lat: number
  lng: number
  accuracy?: number
}

export interface Inspecao {
  id: number
  unidade_prisional: string
  municipio: string
  uf: string
  data_inspecao: string
  inspetor_nome: string
  equipe: string
  tipo_inspecao: TipoInspecao
  observacoes_gerais: string
  status: StatusInspecao
  enviado_em: string | null
  created_at: string
  updated_at: string
}

export interface Constatacao {
  id: number
  inspecao_id: number
  area_inspecionada: AreaInspecionada
  descricao: string
  categoria: CategoriaConstatacao
  gravidade: GravidadeConstatacao
  recomendacao: string
  prazo_recomendado: string
  responsavel: string
  geolocalizacao: Geolocalizacao | null
  observacoes: string
  created_at: string
}

export interface Foto {
  id: number
  constatacao_id: number
  blob: Blob
  nome: string
  tamanho: number
  created_at: string
}
