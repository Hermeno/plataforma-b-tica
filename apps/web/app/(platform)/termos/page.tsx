import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Termos de Uso — 3633Bet' }

const SECTIONS = [
  {
    title: '1. Aceitação dos Termos',
    text: 'Ao acessar e utilizar a plataforma 3633Bet, você concorda com estes Termos de Uso. Se não concordar com qualquer parte, não utilize nossos serviços. Estes termos podem ser atualizados periodicamente e a continuidade do uso implica aceitação das alterações.',
  },
  {
    title: '2. Elegibilidade',
    text: 'O uso da plataforma é restrito a maiores de 18 (dezoito) anos residentes no Brasil. É vedado o acesso a funcionários da empresa, seus familiares diretos, e a pessoas com restrição judicial ao jogo. A verificação de identidade (KYC) pode ser exigida a qualquer momento.',
  },
  {
    title: '3. Cadastro e Segurança da Conta',
    text: 'Cada usuário pode ter apenas uma conta. Informações falsas resultam em suspensão imediata. Você é responsável por manter a confidencialidade de suas credenciais. Em caso de suspeita de acesso não autorizado, contate o suporte imediatamente. Contas inativas por mais de 12 meses podem ser encerradas.',
  },
  {
    title: '4. Depósitos e Saques',
    text: 'O valor mínimo de depósito é R$20,00. Saques só podem ser realizados para contas bancárias/PIX de titularidade do próprio usuário. A plataforma reserva o direito de solicitar documentação comprobatória antes de processar saques acima de R$5.000. Saques são processados em até 24h úteis.',
  },
  {
    title: '5. Bônus e Promoções',
    text: 'Bônus estão sujeitos a rollover conforme descrito na Política de Bônus. O bônus de boas-vindas de R$40 requer rollover de 3.75x (R$150 em apostas válidas). Bônus de depósito equivalem a 10% do valor depositado, sujeitos ao mesmo rollover. Abuso de bônus resulta em cancelamento.',
  },
  {
    title: '6. Jogo Responsável',
    text: 'Encorajamos o jogo responsável. Disponibilizamos ferramentas de autoexclusão, limites de depósito e limites de apostas. Se identificarmos padrões de jogo problemático, podemos aplicar restrições proativas. Para ajuda com dependência de jogos, acesse nossa página de Jogo Responsável.',
  },
  {
    title: '7. Responsabilidade',
    text: 'A plataforma não se responsabiliza por perdas financeiras decorrentes do jogo. Os resultados dos jogos são determinados por RNG (Gerador de Números Aleatórios) certificado. Problemas técnicos que afetem jogos em andamento serão resolvidos mediante análise, com possível reembolso da aposta.',
  },
  {
    title: '8. Privacidade e Dados',
    text: 'O tratamento de dados pessoais segue nossa Política de Privacidade e a Lei Geral de Proteção de Dados (LGPD). Dados são coletados para fins de identificação, prevenção à fraude e cumprimento de obrigações legais. Não vendemos dados pessoais a terceiros.',
  },
  {
    title: '9. Encerramento de Conta',
    text: 'Você pode solicitar o encerramento da sua conta a qualquer momento pelo suporte. Saldos pendentes serão pagos após verificação, deduzidos bônus não convertidos. A plataforma pode encerrar contas por violação destes termos, sem aviso prévio em casos graves.',
  },
  {
    title: '10. Legislação Aplicável',
    text: 'Estes termos são regidos pela legislação brasileira. O foro eleito para dirimir controvérsias é o da Comarca de São Paulo/SP. A plataforma opera conforme a regulamentação de apostas esportivas e jogos online aplicável no Brasil (Lei nº 14.790/2023).',
  },
]

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Termos de Uso</h1>
        <p className="text-text-muted mt-2 text-sm">Última atualização: 1º de junho de 2026</p>
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
        Dúvidas? Entre em <a href="/contato" className="text-brand hover:underline">contato</a> com nossa equipe.
      </p>
    </div>
  )
}
