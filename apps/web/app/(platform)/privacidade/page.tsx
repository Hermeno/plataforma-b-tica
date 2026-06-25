import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Política de Privacidade — 3633Bet' }

const SECTIONS = [
  {
    title: '1. Dados que Coletamos',
    text: 'Coletamos: nome completo, telefone, endereço IP, dados de navegação e histórico de apostas. Para verificação KYC: documento de identidade e comprovante de endereço. Dados de pagamento são processados por intermediadores certificados — não armazenamos dados bancários completos.',
  },
  {
    title: '2. Finalidade do Tratamento',
    text: 'Seus dados são usados para: criação e gestão de conta, processamento de transações financeiras, prevenção à fraude e lavagem de dinheiro (KYC/AML), cumprimento de obrigações legais e regulatórias, comunicações sobre sua conta e, com seu consentimento, comunicações de marketing.',
  },
  {
    title: '3. Base Legal (LGPD)',
    text: 'O tratamento é fundamentado em: execução de contrato (cadastro e serviços), cumprimento de obrigação legal (KYC), legítimo interesse (segurança e prevenção a fraudes) e consentimento (comunicações de marketing). Você pode revogar o consentimento a qualquer momento.',
  },
  {
    title: '4. Compartilhamento de Dados',
    text: 'Compartilhamos dados com: processadores de pagamento PIX (obrigatório para transações), autoridades regulatórias quando exigido por lei, empresas de verificação de identidade (KYC). Não vendemos, alugamos ou comercializamos dados pessoais com terceiros para fins de marketing.',
  },
  {
    title: '5. Seus Direitos',
    text: 'Conforme a LGPD, você tem direito a: confirmação da existência de tratamento, acesso aos seus dados, correção de dados incompletos ou desatualizados, portabilidade dos dados, eliminação de dados desnecessários, revogação do consentimento e informação sobre compartilhamento. Exerça seus direitos pelo suporte.',
  },
  {
    title: '6. Segurança',
    text: 'Implementamos medidas técnicas e organizacionais para proteger seus dados: criptografia SSL/TLS em todas as comunicações, senhas armazenadas com hash bcrypt, acesso restrito aos dados por necessidade funcional, monitoramento contínuo de segurança e plano de resposta a incidentes.',
  },
  {
    title: '7. Retenção de Dados',
    text: 'Dados são retidos pelo tempo necessário para as finalidades descritas, ou pelo prazo exigido por lei (mínimo 5 anos para dados financeiros, conforme legislação tributária e antilavagem). Após o encerramento da conta, dados são anonimizados ou excluídos conforme a lei.',
  },
  {
    title: '8. Cookies',
    text: 'Utilizamos cookies essenciais para o funcionamento da plataforma (sessão, autenticação) e cookies analíticos para melhorar a experiência. Cookies de marketing só são usados com seu consentimento explícito. Você pode gerenciar cookies nas configurações do seu navegador.',
  },
  {
    title: '9. Contato — DPO',
    text: 'Nosso Encarregado de Proteção de Dados (DPO) está disponível em: privacidade@3633bet.com. Para exercer seus direitos ou reportar incidentes de segurança, entre em contato com o DPO ou pelo formulário em nossa página de Contato.',
  },
]

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Política de Privacidade</h1>
        <p className="text-text-muted mt-2 text-sm">Última atualização: 1º de junho de 2026 — Em conformidade com a LGPD (Lei 13.709/2018)</p>
      </div>
      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.title} className="card p-6">
            <h2 className="text-base font-bold text-text-primary mb-3">{s.title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-text-muted mt-8">
        Dúvidas? Contate nosso DPO: <a href="mailto:privacidade@3633bet.com" className="text-brand hover:underline">privacidade@3633bet.com</a>
      </p>
    </div>
  )
}
