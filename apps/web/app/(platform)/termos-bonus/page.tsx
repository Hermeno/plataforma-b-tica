import type { Metadata } from 'next'
import { Gift, Info } from 'lucide-react'

export const metadata: Metadata = { title: 'Política de Bônus — 3633Bet' }

const BONUSES = [
  {
    title: 'Bônus de Boas-Vindas — R$40',
    color: 'border-brand/30 bg-brand/5',
    items: [
      'Creditado automaticamente no cadastro',
      'Valor: R$40,00 em saldo bônus',
      'Rollover: 3.75x — necessário apostar R$150,00',
      'Válido por 30 dias após o cadastro',
      'Aplicável em: Slots, Fish, Crash, Table, Sport',
      'Não aplicável em: apostas em jogos de Mesa com RTP > 98%',
    ],
  },
  {
    title: 'Bônus de Depósito — 10%',
    color: 'border-neon-green/20 bg-neon-green/5',
    items: [
      'Creditado automaticamente a cada depósito confirmado',
      'Valor: 10% do valor depositado',
      'Exemplo: deposite R$100 → receba R$10 de bônus',
      'Rollover: 3.75x sobre o valor do bônus',
      'Sem limite máximo de depósitos beneficiados',
      'Acumulável com saldo de bônus existente',
    ],
  },
  {
    title: 'Bônus de Indicação — R$50',
    color: 'border-amber-500/20 bg-amber-500/5',
    items: [
      'Pago ao indicador quando o indicado cumprir os requisitos',
      'Valor: R$50,00 creditados em saldo real (sem rollover)',
      'Requisito 1: indicado deve depositar mínimo R$100',
      'Requisito 2: indicado deve apostar mínimo R$300 válidos',
      'Sem limite de indicações elegíveis',
      'Processado automaticamente em até 24h após elegibilidade',
    ],
  },
]

const GENERAL = [
  'Bônus são intransferíveis e vinculados à conta do usuário',
  'Apenas uma conta por CPF/telefone é elegível a bônus',
  'Apostas canceladas, nulas ou com odd abaixo de 1.20 não contam para rollover',
  'Abuso de bônus (apostas cobertas, uso de múltiplas contas etc.) resulta em cancelamento e possível banimento',
  'A 3633Bet reserva o direito de alterar ou cancelar promoções com aviso prévio de 48h',
  'Em caso de dúvida, a interpretação da 3633Bet sobre estes termos é definitiva',
]

export default function TermosBonusPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <Gift className="w-10 h-10 text-brand mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-text-primary">Política de Bônus</h1>
        <p className="text-text-muted mt-2 text-sm">Última atualização: 1º de junho de 2026</p>
      </div>

      {/* Bonus cards */}
      {BONUSES.map((b) => (
        <div key={b.title} className={`card p-6 border ${b.color}`}>
          <h2 className="text-base font-bold text-text-primary mb-4">{b.title}</h2>
          <ul className="space-y-2">
            {b.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* General rules */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-brand" /> Regras Gerais
        </h2>
        <ul className="space-y-2">
          {GENERAL.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted flex-shrink-0 mt-2" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Rollover explained */}
      <div className="rounded-xl bg-brand/5 border border-brand/20 p-5">
        <p className="font-semibold text-brand mb-2">O que é Rollover?</p>
        <p className="text-sm text-text-secondary">
          Rollover é o volume de apostas que você precisa fazer antes de sacar o saldo de bônus.
          Com rollover de 3.75x sobre R$40, você precisa fazer R$150 em apostas válidas.
          O progresso é visível na aba Carteira. Após completar o rollover, o bônus vira saldo real e pode ser sacado.
        </p>
      </div>
    </div>
  )
}
