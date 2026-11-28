import { Alert, NativeSelect, NumberInput, SimpleGrid, Stack, Table, Text, Textarea, TextInput } from '@mantine/core';
import { useRef, useState } from 'react';
import { calculateOffer, defaultPayment, offerLines, type OfferLanguage, type OfferNumbers } from '../domain/offer';
import { CompanyFormDialog } from './CompanyFormDialog';
import './offerDocument.css';
import printStyles from './offerDocument.css?inline';

export type OfferSeed = { company?: string; hall?: string; stand?: string; sqm?: number | string };

type SavedOffer = Pick<OfferNumbers, 'prices' | 'registration' | 'vat'> & {
  language: OfferLanguage;
  valid: number | string;
  payment: Partial<Record<OfferLanguage, string>>;
};
const storageKey = 'leadscrm:offer-react';

function preferences(): SavedOffer {
  const defaults: SavedOffer = {
    prices: Object.fromEntries(offerLines.map(([key, price]) => [key, price])),
    registration: 110,
    vat: 24,
    language: 'el',
    valid: 10,
    payment: defaultPayment,
  };
  try {
    const saved: Partial<SavedOffer> = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    return {
      ...defaults,
      ...saved,
      prices: { ...defaults.prices, ...saved.prices },
      payment: { ...defaultPayment, ...saved.payment },
    };
  } catch {
    return defaults;
  }
}

async function printOffer(node: HTMLElement, title: string) {
  const popup = window.open('', '_blank', 'popup');
  if (!popup) throw new Error('Επιτρέψτε τα αναδυόμενα παράθυρα για να εκτυπώσετε την προσφορά.');
  popup.opener = null;
  const doc = popup.document;
  doc.title = title;
  const style = doc.createElement('style');
  style.textContent = printStyles;
  doc.head.append(style);
  doc.body.append(doc.importNode(node, true));
  await Promise.all([...doc.images].map((image) => image.decode().catch(() => {})));
  if (!popup.closed) {
    popup.focus();
    popup.print();
  }
}

export function OfferForm({ seed, onClose }: { seed: OfferSeed; onClose: () => void }) {
  const [prefs, setPrefs] = useState(preferences);
  const [company, setCompany] = useState(seed.company ?? '');
  const [hall, setHall] = useState(seed.hall ?? '');
  const [stand, setStand] = useState(seed.stand ?? '');
  const [quantities, setQuantities] = useState<OfferNumbers['quantities']>({ s1: seed.sqm ?? '' });
  const [discount, setDiscount] = useState<number | string>(0);
  const [extraDiscount, setExtraDiscount] = useState<number | string>(0);
  const [banks, setBanks] = useState('');
  const [error, setError] = useState('');
  const [printing, setPrinting] = useState(false);
  const documentRef = useRef<HTMLElement>(null);
  const totals = calculateOffer({ ...prefs, quantities, discount, extraDiscount });
  const en = prefs.language === 'en';
  const lang = en ? 'en-GB' : 'el-GR';
  const money = (value: number) => new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' }).format(value);
  const title = en ? 'FINANCIAL OFFER' : 'ΟΙΚΟΝΟΜΙΚΗ ΠΡΟΣΦΟΡΑ';

  async function print() {
    if (!documentRef.current || printing) return;
    setError('');
    setPrinting(true);
    try {
      try {
        localStorage.setItem(storageKey, JSON.stringify(prefs));
      } catch {
        /* Προσωρινές ρυθμίσεις. */
      }
      await printOffer(documentRef.current, `${title} ${company}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Η εκτύπωση δεν ήταν διαθέσιμη.');
    } finally {
      setPrinting(false);
    }
  }

  return (
    <CompanyFormDialog
      title="Οικονομική προσφορά"
      submitLabel="PDF / Εκτύπωση"
      pending={printing}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault();
        void print();
      }}
    >
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <NativeSelect
          label="Γλώσσα"
          data={[
            { value: 'el', label: 'Ελληνικά' },
            { value: 'en', label: 'English' },
          ]}
          value={prefs.language}
          onChange={(event) => setPrefs({ ...prefs, language: event.currentTarget.value === 'en' ? 'en' : 'el' })}
        />
        <NumberInput
          label="Ισχύς προσφοράς (ημέρες)"
          min={1}
          allowDecimal={false}
          value={prefs.valid}
          onChange={(valid) => setPrefs({ ...prefs, valid })}
        />
      </SimpleGrid>
      <TextInput
        label="Επωνυμία εταιρείας"
        data-autofocus
        required
        value={company}
        onChange={(event) => setCompany(event.currentTarget.value)}
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <TextInput label="Hall" value={hall} onChange={(event) => setHall(event.currentTarget.value)} />
        <TextInput label="Stand" value={stand} onChange={(event) => setStand(event.currentTarget.value)} />
      </SimpleGrid>
      <Table.ScrollContainer minWidth={460}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Περιγραφή</Table.Th>
              <Table.Th>Τιμή</Table.Th>
              <Table.Th>Ποσότητα</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {offerLines.map(([key, , unit, label, english]) => (
              <Table.Tr key={key}>
                <Table.Td>{en ? english : label}</Table.Td>
                <Table.Td>
                  <NumberInput
                    aria-label={`Τιμή: ${label}`}
                    min={0}
                    prefix="€ "
                    value={prefs.prices[key]}
                    onChange={(value) => setPrefs({ ...prefs, prices: { ...prefs.prices, [key]: value } })}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    aria-label={`Ποσότητα: ${label}`}
                    min={0}
                    suffix={` ${unit}`}
                    value={quantities[key] ?? ''}
                    onChange={(value) => setQuantities({ ...quantities, [key]: value })}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <NumberInput label="Έκπτωση χώρου (%)" min={0} max={100} value={discount} onChange={setDiscount} />
        <NumberInput label="Επιπλέον έκπτωση (%)" min={0} max={100} value={extraDiscount} onChange={setExtraDiscount} />
        <NumberInput
          label="Τέλος εγγραφής (€)"
          min={0}
          value={prefs.registration}
          onChange={(registration) => setPrefs({ ...prefs, registration })}
        />
        <NumberInput
          label="ΦΠΑ (%)"
          min={0}
          max={100}
          value={prefs.vat}
          onChange={(vat) => setPrefs({ ...prefs, vat })}
        />
      </SimpleGrid>
      <Textarea
        label="Τρόπος πληρωμής"
        minRows={3}
        autosize
        value={prefs.payment[prefs.language] ?? ''}
        onChange={(event) =>
          setPrefs({ ...prefs, payment: { ...prefs.payment, [prefs.language]: event.currentTarget.value } })
        }
      />
      <Textarea
        label="Τραπεζικά στοιχεία για αυτό το PDF (προαιρετικά)"
        minRows={2}
        autosize
        value={banks}
        onChange={(event) => setBanks(event.currentTarget.value)}
      />
      <Stack gap={4}>
        <Text size="sm" fw={600}>
          Προεπισκόπηση PDF
        </Text>
        <article className="crm-offer-document" lang={prefs.language} ref={documentRef}>
          <img src={new URL('../img/logo-offer.jpg', window.location.href).href} alt="FGEnergy" />
          <h1>{title}</h1>
          <p>
            <strong>{company}</strong> · {new Date().toLocaleDateString(lang)}
          </p>
          {(hall || stand) && (
            <p>
              Hall {hall} · Stand {stand}
            </p>
          )}
          <table>
            <thead>
              <tr>
                <th>{en ? 'Description' : 'Περιγραφή'}</th>
                <th>{en ? 'Amount' : 'Ποσό'}</th>
              </tr>
            </thead>
            <tbody>
              {offerLines
                .filter(([key]) => totals.lines[key] > 0)
                .map(([key, , unit, label, english]) => (
                  <tr key={key}>
                    <td>
                      {en ? english : label} · {quantities[key]} {unit === 'τεμ.' && en ? 'pcs' : unit}
                    </td>
                    <td>{money(totals.lines[key])}</td>
                  </tr>
                ))}
              {!!totals.discount && (
                <tr>
                  <td>{en ? 'Space discount' : 'Έκπτωση χώρου'}</td>
                  <td>{money(-totals.discount)}</td>
                </tr>
              )}
              {!!totals.extraDiscount && (
                <tr>
                  <td>{en ? 'Additional discount' : 'Επιπλέον έκπτωση'}</td>
                  <td>{money(-totals.extraDiscount)}</td>
                </tr>
              )}
              {!!Number(prefs.registration) && (
                <tr>
                  <td>{en ? 'Registration fee' : 'Τέλος εγγραφής'}</td>
                  <td>{money(Number(prefs.registration))}</td>
                </tr>
              )}
              <tr>
                <td>{en ? 'Subtotal' : 'Σύνολο χωρίς ΦΠΑ'}</td>
                <td>{money(totals.total)}</td>
              </tr>
              <tr>
                <td>
                  {en ? 'VAT' : 'ΦΠΑ'} ({prefs.vat}%)
                </td>
                <td>{money(totals.vat)}</td>
              </tr>
              <tr className="crm-offer-total">
                <td>{en ? 'Total including VAT' : 'Σύνολο με ΦΠΑ'}</td>
                <td>{money(totals.final)}</td>
              </tr>
            </tbody>
          </table>
          <p>
            {en
              ? `The reservation is valid for ${prefs.valid} days from the date the offer is sent.`
              : `Η δέσμευση του χώρου ισχύει για ${prefs.valid} ημέρες από την αποστολή της προσφοράς.`}
          </p>
          {prefs.payment[prefs.language] && (
            <>
              <h2>{en ? 'Payment methods' : 'Τρόπος πληρωμής'}</h2>
              <p>{prefs.payment[prefs.language]}</p>
            </>
          )}
          {banks.trim() && (
            <>
              <h2>{en ? 'Bank details' : 'Τραπεζικά στοιχεία'}</h2>
              <p>{banks}</p>
            </>
          )}
        </article>
      </Stack>
      {error && (
        <Alert color="red" role="alert">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
