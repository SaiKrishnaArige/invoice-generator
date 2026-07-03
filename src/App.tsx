import { ThemeProvider } from '@/context/ThemeContext'
import { InvoiceProvider } from '@/context/InvoiceContext'
import { EstimatorPage } from '@/pages/EstimatorPage'

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <EstimatorPage />
      </InvoiceProvider>
    </ThemeProvider>
  )
}
