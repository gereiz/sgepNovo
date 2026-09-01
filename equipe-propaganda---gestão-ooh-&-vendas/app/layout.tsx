import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Equipe Propaganda - Gestão Comercial e Mídia OOH',
  description: 'Sistema completo de controle de vendas, bi-semanas, painéis, clientes e checking fotográfico de mídia exterior.',
  openGraph: {
    title: 'Equipe Propaganda - Gestão OOH',
    description: 'Sistema completo de controle de vendas, bi-semanas, painéis e clientes.',
    type: 'website',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#f3f4f5] text-[#191c1d] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

