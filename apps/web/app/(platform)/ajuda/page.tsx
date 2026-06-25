'use client'

import { useState } from 'react'
import { ChevronDown, Search, MessageCircle, Mail } from 'lucide-react'
import Link from 'next/link'

const FAQS = [
  {
    cat: 'Conta',
    items: [
      { q: 'Como criar minha conta?', a: 'Clique em "Cadastrar", informe seu nome completo, telefone e senha. O cadastro é rápido e gratuito. Você já recebe R$40 de bônus de boas-vindas.' },
      { q: 'Como alterar minha senha?', a: 'Acesse Meu Perfil > Segurança > Alterar Senha. Você precisará informar a senha atual e a nova senha.' },
      { q: 'Esqueci minha senha, o que faço?', a: 'Na tela de login, clique em "Esqueci minha senha" e informe seu telefone cadastrado. Você receberá um SMS com o código de recuperação.' },
      { q: 'Como verificar minha conta (KYC)?', a: 'Acesse Meu Perfil > Verificação e envie uma foto do seu documento de identidade (RG ou CNH) e um comprovante de endereço recente.' },
    ],
  },
  {
    cat: 'Depósitos e Saques',
    items: [
      { q: 'Quais métodos de pagamento são aceitos?', a: 'Aceitamos exclusivamente PIX. É o método mais rápido, disponível 24h por dia, 7 dias por semana.' },
      { q: 'Qual o valor mínimo de depósito?', a: 'O valor mínimo de depósito é R$20,00.' },
      { q: 'Em quanto tempo cai o depósito?', a: 'Depósitos via PIX são processados em até 5 minutos após a confirmação do pagamento.' },
      { q: 'Qual o prazo para saque?', a: 'Saques são processados em até 24h úteis após a solicitação, desde que o rollover esteja completo.' },
      { q: 'O que é rollover?', a: 'Rollover é o valor que você precisa apostar antes de poder sacar o bônus. Por exemplo, um bônus de R$40 com rollover de 3.75x requer R$150 em apostas.' },
    ],
  },
  {
    cat: 'Bônus',
    items: [
      { q: 'Qual é o bônus de boas-vindas?', a: 'Ao criar sua conta, você recebe R$40,00 em saldo de bônus automaticamente. O bônus tem rollover de 3.75x (R$150 em apostas).' },
      { q: 'Como funciona o bônus de depósito?', a: 'A cada depósito, você recebe 10% de bônus sobre o valor depositado. Ex: deposite R$100 e receba R$10 de bônus adicional.' },
      { q: 'Posso sacar o bônus diretamente?', a: 'Não. O bônus precisa ter o rollover completado antes de ser convertido em saldo sacável.' },
    ],
  },
  {
    cat: 'Jogos',
    items: [
      { q: 'Os jogos são justos?', a: 'Sim. Todos os jogos utilizam RNG (Gerador de Números Aleatórios) certificado pelas provedoras. Os resultados são completamente aleatórios.' },
      { q: 'Posso jogar pelo celular?', a: 'Sim! Nossa plataforma é 100% responsiva e funciona em qualquer smartphone ou tablet.' },
      { q: 'O que fazer se um jogo travar?', a: 'Atualize a página. Se o problema persistir, entre em contato com nosso suporte. Apostas com erro técnico são reembolsadas automaticamente.' },
    ],
  },
]

export default function AjudaPage() {
  const [open, setOpen] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = FAQS.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (i) => !search || i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Central de Ajuda</h1>
        <p className="text-text-muted mt-2">Encontre respostas para as principais dúvidas</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Buscar dúvida..."
          className="input-base pl-10 py-3"
        />
      </div>

      {/* FAQ */}
      {filtered.map((cat) => (
        <div key={cat.cat}>
          <h2 className="text-sm font-semibold text-brand uppercase tracking-wider mb-3">{cat.cat}</h2>
          <div className="space-y-2">
            {cat.items.map((item) => {
              const key = item.q
              const isOpen = open === key
              return (
                <div key={key} className="card overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-medium text-text-primary text-sm">{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-text-muted flex-shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-text-secondary border-t border-surface-border pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Contact CTA */}
      <div className="card p-6 text-center">
        <p className="font-semibold text-text-primary mb-1">Não encontrou o que procurava?</p>
        <p className="text-sm text-text-muted mb-4">Nossa equipe de suporte está disponível 24h</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/suporte" className="btn-brand py-2.5 px-5 text-sm flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Falar com Suporte
          </Link>
          <Link href="/contato" className="btn-ghost py-2.5 px-5 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" /> Enviar Mensagem
          </Link>
        </div>
      </div>
    </div>
  )
}
