import { fold } from './text';

const countriesRaw = `Afghanistan|Αφγανιστάν
Albania|Αλβανία
Algeria|Αλγερία
Andorra|Ανδόρα
Angola|Αγκόλα
Antigua and Barbuda|Αντίγκουα και Μπαρμπούντα
Argentina|Αργεντινή
Armenia|Αρμενία
Australia|Αυστραλία
Austria|Αυστρία
Azerbaijan|Αζερμπαϊτζάν
Bahamas|Μπαχάμες
Bahrain|Μπαχρέιν
Bangladesh|Μπανγκλαντές
Barbados|Μπαρμπάντος
Belarus|Λευκορωσία
Belgium|Βέλγιο
Belize|Μπελίζ
Benin|Μπενίν
Bhutan|Μπουτάν
Bolivia|Βολιβία
Bosnia and Herzegovina|Βοσνία και Ερζεγοβίνη|Bosnia
Botswana|Μποτσουάνα
Brazil|Βραζιλία
Brunei|Μπρουνέι
Bulgaria|Βουλγαρία
Burkina Faso|Μπουρκίνα Φάσο
Burundi|Μπουρούντι
Cambodia|Καμπότζη
Cameroon|Καμερούν
Canada|Καναδάς
Cape Verde|Πράσινο Ακρωτήριο
Central African Republic|Κεντροαφρικανική Δημοκρατία
Chad|Τσαντ
Chile|Χιλή
China|Κίνα|PRC|P.R. China
Colombia|Κολομβία
Comoros|Κομόρες
Congo|Κονγκό
Costa Rica|Κόστα Ρίκα
Croatia|Κροατία
Cuba|Κούβα
Cyprus|Κύπρος
Czech Republic|Τσεχία|Czechia|Τσεχική Δημοκρατία
Democratic Republic of the Congo|Λαϊκή Δημοκρατία του Κονγκό|DR Congo
Denmark|Δανία
Djibouti|Τζιμπουτί
Dominica|Δομινίκα
Dominican Republic|Δομινικανή Δημοκρατία
Ecuador|Ισημερινός
Egypt|Αίγυπτος
El Salvador|Ελ Σαλβαδόρ
Equatorial Guinea|Ισημερινή Γουινέα
Eritrea|Ερυθραία
Estonia|Εσθονία
Eswatini|Εσουατίνι|Swaziland
Ethiopia|Αιθιοπία
Fiji|Φίτζι
Finland|Φινλανδία
France|Γαλλία
Gabon|Γκαμπόν
Gambia|Γκάμπια
Georgia|Γεωργία
Germany|Γερμανία|Deutschland
Ghana|Γκάνα
Greece|Ελλάδα|Ελλάς|Hellas|GR
Grenada|Γρενάδα
Guatemala|Γουατεμάλα
Guinea|Γουινέα
Guinea-Bissau|Γουινέα-Μπισάου
Guyana|Γουιάνα
Haiti|Αϊτή
Honduras|Ονδούρα
Hong Kong|Χονγκ Κονγκ
Hungary|Ουγγαρία
Iceland|Ισλανδία
India|Ινδία
Indonesia|Ινδονησία
Iran|Ιράν
Iraq|Ιράκ
Ireland|Ιρλανδία
Israel|Ισραήλ
Italy|Ιταλία
Ivory Coast|Ακτή Ελεφαντοστού|Côte d'Ivoire
Jamaica|Τζαμάικα
Japan|Ιαπωνία
Jordan|Ιορδανία
Kazakhstan|Καζακστάν
Kenya|Κένυα
Kiribati|Κιριμπάτι
Kosovo|Κοσσυφοπέδιο|Κόσοβο
Kuwait|Κουβέιτ
Kyrgyzstan|Κιργιστάν
Laos|Λάος
Latvia|Λετονία
Lebanon|Λίβανος
Lesotho|Λεσότο
Liberia|Λιβερία
Libya|Λιβύη
Liechtenstein|Λιχτενστάιν
Lithuania|Λιθουανία
Luxembourg|Λουξεμβούργο
Macau|Μακάο
Madagascar|Μαδαγασκάρη
Malawi|Μαλάουι
Malaysia|Μαλαισία
Maldives|Μαλδίβες
Mali|Μάλι
Malta|Μάλτα
Marshall Islands|Νήσοι Μάρσαλ
Mauritania|Μαυριτανία
Mauritius|Μαυρίκιος
Mexico|Μεξικό
Micronesia|Μικρονησία
Moldova|Μολδαβία
Monaco|Μονακό
Mongolia|Μογγολία
Montenegro|Μαυροβούνιο
Morocco|Μαρόκο
Mozambique|Μοζαμβίκη
Myanmar|Μιανμάρ|Burma
Namibia|Ναμίμπια
Nauru|Ναουρού
Nepal|Νεπάλ
Netherlands|Ολλανδία|Κάτω Χώρες|Holland|The Netherlands
New Zealand|Νέα Ζηλανδία
Nicaragua|Νικαράγουα
Niger|Νίγηρας
Nigeria|Νιγηρία
North Korea|Βόρεια Κορέα
North Macedonia|Βόρεια Μακεδονία|Macedonia|FYROM|Σκόπια
Norway|Νορβηγία
Oman|Ομάν
Pakistan|Πακιστάν
Palau|Παλάου
Palestine|Παλαιστίνη
Panama|Παναμάς
Papua New Guinea|Παπούα Νέα Γουινέα
Paraguay|Παραγουάη
Peru|Περού
Philippines|Φιλιππίνες
Poland|Πολωνία
Portugal|Πορτογαλία
Qatar|Κατάρ
Romania|Ρουμανία
Russia|Ρωσία|Russian Federation
Rwanda|Ρουάντα
Saint Kitts and Nevis|Άγιος Χριστόφορος και Νέβις
Saint Lucia|Αγία Λουκία
Saint Vincent and the Grenadines|Άγιος Βικέντιος και Γρεναδίνες
Samoa|Σαμόα
San Marino|Άγιος Μαρίνος|Σαν Μαρίνο
Sao Tome and Principe|Σάο Τομέ και Πρίνσιπε
Saudi Arabia|Σαουδική Αραβία
Senegal|Σενεγάλη
Serbia|Σερβία
Seychelles|Σεϋχέλλες
Sierra Leone|Σιέρα Λεόνε
Singapore|Σιγκαπούρη
Slovakia|Σλοβακία
Slovenia|Σλοβενία
Solomon Islands|Νήσοι Σολομώντα
Somalia|Σομαλία
South Africa|Νότια Αφρική
South Korea|Νότια Κορέα|Korea|Republic of Korea
South Sudan|Νότιο Σουδάν
Spain|Ισπανία
Sri Lanka|Σρι Λάνκα
Sudan|Σουδάν
Suriname|Σουρινάμ
Sweden|Σουηδία
Switzerland|Ελβετία
Syria|Συρία
Taiwan|Ταϊβάν
Tajikistan|Τατζικιστάν
Tanzania|Τανζανία
Thailand|Ταϊλάνδη
Timor-Leste|Ανατολικό Τιμόρ|East Timor
Togo|Τόγκο
Tonga|Τόνγκα
Trinidad and Tobago|Τρινιντάντ και Τομπάγκο
Tunisia|Τυνησία
Turkey|Τουρκία|Türkiye|Turkiye
Turkmenistan|Τουρκμενιστάν
Tuvalu|Τουβαλού
Uganda|Ουγκάντα
Ukraine|Ουκρανία
United Arab Emirates|Ηνωμένα Αραβικά Εμιράτα|UAE|ΗΑΕ
United Kingdom|Ηνωμένο Βασίλειο|UK|Great Britain|Britain|England|Αγγλία|Μεγάλη Βρετανία|Scotland|Σκωτία|Wales|Ουαλία|Northern Ireland
United States|Ηνωμένες Πολιτείες|USA|US|United States of America|ΗΠΑ|Αμερική
Uruguay|Ουρουγουάη
Uzbekistan|Ουζμπεκιστάν
Vanuatu|Βανουάτου
Vatican City|Βατικανό
Venezuela|Βενεζουέλα
Vietnam|Βιετνάμ|Viet Nam
Yemen|Υεμένη
Zambia|Ζάμπια
Zimbabwe|Ζιμπάμπουε`;

export const countries = countriesRaw.split('\n').map((line) => {
  const [name, greek, ...aliases] = line.split('|');
  return { name, label: `${greek} · ${name}`, aliases };
});

const countryKeys = new Map(
  countries.flatMap((country) =>
    [country.name, ...country.label.split(' · '), ...country.aliases].map((value) => [fold(value), country] as const),
  ),
);

export const countryOf = (value: string) => countryKeys.get(fold(value));
