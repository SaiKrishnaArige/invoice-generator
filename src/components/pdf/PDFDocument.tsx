import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { CompanySettings, Invoice, InvoiceTotals } from '@/types'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import { DEFAULT_COMPLIMENTARY_NOTE, componentLabel, materialLabel } from '@/lib/defaults'

// Registering a widely-available system-agnostic font family so PDF text renders
// consistently across browsers without relying on external font files.
Font.register({
  family: 'Helvetica',
  fonts: [{ src: 'Helvetica' }],
})

const NAVY = '#0B1730'
const NAVY_LIGHT = '#1C2F5F'
const GOLD = '#DBB03E'
const INK = '#1F2937'
const MUTED = '#64748B'
const BORDER = '#E2E8F0'
const PANEL = '#F4F6FB'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: INK,
    paddingBottom: 60,
  },
  headerBanner: {
    backgroundColor: NAVY,
    paddingHorizontal: 32,
    paddingVertical: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: GOLD,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 8,
    color: '#C9D2E8',
    marginTop: 2,
  },
  companyBlock: { alignItems: 'flex-end' },
  companyName: { fontSize: 13, color: '#FFFFFF', fontWeight: 700, letterSpacing: 0.5 },
  companyTagline: { fontSize: 7, color: GOLD, marginTop: 2, letterSpacing: 1 },
  logoImage: { width: 46, height: 46, marginBottom: 4 },

  body: { paddingHorizontal: 32, paddingTop: 18 },

  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: PANEL,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  metaCol: { width: '33.33%', marginBottom: 6, paddingRight: 8 },
  metaLabel: { fontSize: 7, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: 9.5, color: NAVY, fontWeight: 700 },

  table: { borderWidth: 1, borderColor: BORDER, borderRadius: 4, overflow: 'hidden' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: NAVY_LIGHT },
  tableRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: BORDER },
  tableRowAlt: { backgroundColor: '#FAFBFD' },
  th: { color: '#FFFFFF', fontSize: 7.5, fontWeight: 700, paddingVertical: 6, paddingHorizontal: 4, textTransform: 'uppercase' },
  td: { fontSize: 8.5, paddingVertical: 5, paddingHorizontal: 4, color: INK },

  colSN: { width: '5%', textAlign: 'center' },
  colSpace: { width: '15%' },
  colParticulars: { width: '34%' },
  colLen: { width: '8%', textAlign: 'right' },
  colBr: { width: '8%', textAlign: 'right' },
  colSft: { width: '9%', textAlign: 'right' },
  colPrice: { width: '10%', textAlign: 'right' },
  colAmount: { width: '11%', textAlign: 'right' },

  totalRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: BORDER, backgroundColor: PANEL },
  totalLabel: { width: '89%', textAlign: 'right', fontSize: 9, fontWeight: 700, paddingVertical: 6, paddingHorizontal: 4, color: NAVY },
  totalValue: { width: '11%', textAlign: 'right', fontSize: 9, fontWeight: 700, paddingVertical: 6, paddingHorizontal: 4, color: NAVY },

  complimentary: { marginTop: 10, fontSize: 9, color: '#B45309', fontWeight: 700 },

  summaryBox: {
    marginTop: 14,
    alignSelf: 'flex-end',
    width: '45%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  summaryLineFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  summaryLabel: { fontSize: 8.5, color: MUTED },
  summaryValue: { fontSize: 8.5, color: INK, fontWeight: 700 },
  summaryFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: NAVY,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  summaryFinalLabel: { fontSize: 10, color: GOLD, fontWeight: 700 },
  summaryFinalValue: { fontSize: 10, color: '#FFFFFF', fontWeight: 700 },

  sectionTitle: { fontSize: 10, fontWeight: 700, color: NAVY, marginTop: 18, marginBottom: 6 },
  termsText: { fontSize: 8, lineHeight: 1.5, color: '#374151' },

  signRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 26 },
  signBlock: { width: '30%', alignItems: 'center' },
  signImage: { width: 90, height: 40, marginBottom: 4, objectFit: 'contain' },
  signLine: { borderTopWidth: 1, borderTopColor: BORDER, width: '100%', marginTop: 26, paddingTop: 4 },
  signLabel: { fontSize: 7.5, color: MUTED, textAlign: 'center' },

  qrBlock: { alignItems: 'center' },
  qrImage: { width: 64, height: 64, marginBottom: 4 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NAVY,
    paddingVertical: 10,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 7.5, color: '#C9D2E8' },
  footerGold: { color: GOLD, fontWeight: 700 },

  pageNumber: { position: 'absolute', bottom: 4, right: 32, fontSize: 7, color: MUTED },
})

interface PDFDocumentProps {
  invoice: Invoice
  company: CompanySettings
  totals: InvoiceTotals
  qrDataUrl?: string
}

export function PDFDocument({ invoice, company, totals, qrDataUrl }: PDFDocumentProps) {
  const enabledCharges = invoice.extraCharges.filter((c) => c.enabled && c.amount > 0)

  return (
    <Document
      title={`Estimation ${invoice.client.quotationNumber}`}
      author={company.name}
      subject="Interior Design Estimation"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerBanner} fixed>
          <View>
            <Text style={styles.headerTitle}>ESTIMATION</Text>
            <Text style={styles.headerSubtitle}>Quotation No. {invoice.client.quotationNumber}</Text>
          </View>
          <View style={styles.companyBlock}>
            {company.logoDataUrl ? <Image src={company.logoDataUrl} style={styles.logoImage} /> : null}
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyTagline}>{company.tagline}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.metaGrid}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Client Name</Text>
              <Text style={styles.metaValue}>{invoice.client.clientName || '—'}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Phone</Text>
              <Text style={styles.metaValue}>{invoice.client.phone || '—'}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Email</Text>
              <Text style={styles.metaValue}>{invoice.client.email || '—'}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Site Address</Text>
              <Text style={styles.metaValue}>{invoice.client.siteAddress || '—'}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Project Name</Text>
              <Text style={styles.metaValue}>{invoice.client.projectName || '—'}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Prepared By</Text>
              <Text style={styles.metaValue}>{invoice.client.preparedBy || '—'}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Quotation Date</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.client.quotationDate)}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Valid Until</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.client.validUntil)}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Quotation No.</Text>
              <Text style={styles.metaValue}>{invoice.client.quotationNumber}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, styles.colSN]}>SN</Text>
              <Text style={[styles.th, styles.colSpace]}>Space</Text>
              <Text style={[styles.th, styles.colParticulars]}>Particulars</Text>
              <Text style={[styles.th, styles.colLen]}>L (ft)</Text>
              <Text style={[styles.th, styles.colBr]}>B (ft)</Text>
              <Text style={[styles.th, styles.colSft]}>SFT</Text>
              <Text style={[styles.th, styles.colPrice]}>Price/SFT</Text>
              <Text style={[styles.th, styles.colAmount]}>Amount</Text>
            </View>
            {invoice.items.map((item, idx) => (
              <View key={item.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]} wrap={false}>
                <Text style={[styles.td, styles.colSN]}>{idx + 1}</Text>
                <Text style={[styles.td, styles.colSpace]}>{item.space}</Text>
                <Text style={[styles.td, styles.colParticulars]}>
                  {`${item.particulars} — ${materialLabel(item.material)} (${componentLabel(item.component)})`}
                  {item.materialsUsed ? `\nMaterials used: ${item.materialsUsed}` : ''}
                </Text>
                <Text style={[styles.td, styles.colLen]}>{formatNumber(item.length)}</Text>
                <Text style={[styles.td, styles.colBr]}>{formatNumber(item.breadth)}</Text>
                <Text style={[styles.td, styles.colSft]}>{formatNumber(item.sft)}</Text>
                <Text style={[styles.td, styles.colPrice]}>{formatNumber(item.pricePerSft)}</Text>
                <Text style={[styles.td, styles.colAmount]}>{formatNumber(item.amount)}</Text>
              </View>
            ))}
            {enabledCharges.map((charge, idx) => (
              <View key={charge.id} style={[styles.tableRow, (invoice.items.length + idx) % 2 === 1 ? styles.tableRowAlt : {}]} wrap={false}>
                <Text style={[styles.td, styles.colSN]}>{invoice.items.length + idx + 1}</Text>
                <Text style={[styles.td, styles.colSpace]}>{charge.label}</Text>
                <Text style={[styles.td, styles.colParticulars]}>Additional charge</Text>
                <Text style={[styles.td, styles.colLen]}>—</Text>
                <Text style={[styles.td, styles.colBr]}>—</Text>
                <Text style={[styles.td, styles.colSft]}>—</Text>
                <Text style={[styles.td, styles.colPrice]}>—</Text>
                <Text style={[styles.td, styles.colAmount]}>{formatNumber(charge.amount)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Items + Charges Total</Text>
              <Text style={styles.totalValue}>{formatNumber(totals.subtotal)}</Text>
            </View>
          </View>

          <Text style={styles.complimentary}>{DEFAULT_COMPLIMENTARY_NOTE}</Text>

          <View style={styles.summaryBox}>
            <View style={styles.summaryLineFirst}>
              <Text style={styles.summaryLabel}>Total SFT</Text>
              <Text style={styles.summaryValue}>{formatNumber(totals.totalSft)}</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totals.subtotal)}</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Discount ({formatNumber(invoice.discountPercent)}%)</Text>
              <Text style={styles.summaryValue}>- {formatCurrency(totals.discountAmount)}</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>GST ({formatNumber(invoice.gstPercent)}%)</Text>
              <Text style={styles.summaryValue}>+ {formatCurrency(totals.gstAmount)}</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Round Off</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totals.roundOff)}</Text>
            </View>
            <View style={styles.summaryFinalRow}>
              <Text style={styles.summaryFinalLabel}>Final Total</Text>
              <Text style={styles.summaryFinalValue}>{formatCurrency(totals.finalTotal)}</Text>
            </View>
          </View>

          {invoice.notes ? (
            <View>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.termsText}>{invoice.notes}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <Text style={styles.termsText}>{company.termsAndConditions}</Text>

          <View style={styles.signRow}>
            <View style={styles.signBlock}>
              {company.stampDataUrl ? <Image src={company.stampDataUrl} style={styles.signImage} /> : null}
              <View style={styles.signLine}>
                <Text style={styles.signLabel}>Company Stamp</Text>
              </View>
            </View>
            {qrDataUrl ? (
              <View style={styles.qrBlock}>
                <Image src={qrDataUrl} style={styles.qrImage} />
                <Text style={styles.signLabel}>Scan to Pay (UPI)</Text>
              </View>
            ) : (
              <View style={styles.signBlock} />
            )}
            <View style={styles.signBlock}>
              {company.signatureDataUrl ? <Image src={company.signatureDataUrl} style={styles.signImage} /> : null}
              <View style={styles.signLine}>
                <Text style={styles.signLabel}>Authorized Signature</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            <Text style={styles.footerGold}>{company.phone1}</Text>
            {company.phone2 ? `  /  ${company.phone2}` : ''}
            {company.email ? `  /  ${company.email}` : ''}
          </Text>
          <Text style={styles.footerText}>
            {company.gstNumber ? `GSTIN: ${company.gstNumber}` : company.name}
          </Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}
