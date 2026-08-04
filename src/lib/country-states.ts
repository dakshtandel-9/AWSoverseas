/**
 * First-level administrative divisions per country (ISO 3166-2), for the quote
 * form's state field — picking a country narrows the state list to that
 * country's own divisions. `noun` is what that country calls them (provinces,
 * emirates, governorates…), used in the field's placeholder and empty state.
 *
 * Generated from the ISO 3166-2 subdivision data in
 * dr5hn/countries-states-cities-database (top-level entries only), keyed by the
 * country names in `COUNTRIES`. India keeps the curated list from
 * `INDIA_STATES`. Countries with no listed divisions (Macau, Vatican City)
 * are absent — the form then asks for the country alone.
 *
 * Imported dynamically by the quote form so it never lands in the initial bundle.
 */
export type CountryStates = { noun: string; names: string[] };

export const COUNTRY_STATES: Record<string, CountryStates> = {
  "Afghanistan": {
    noun: "provinces",
    names: ["Badakhshan", "Badghis", "Baghlan", "Balkh", "Bamyan", "Daykundi", "Farah", "Faryab", "Ghazni", "Ghōr", "Helmand", "Herat", "Jowzjan", "Kabul", "Kandahar", "Kapisa", "Khost", "Kunar", "Kunduz Province", "Laghman", "Logar", "Nangarhar", "Nimruz", "Nuristan", "Paktia", "Paktika", "Panjshir", "Parwan", "Samangan", "Sar-e Pol", "Takhar", "Urozgan", "Wardak", "Zabul"],
  },
  "Albania": {
    noun: "counties",
    names: ["Berat", "Dibër", "Durrës", "Elbasan", "Fier", "Gjirokastër", "Korçë", "Kukës", "Lezhë", "Shkodër", "Tirana", "Vlorë"],
  },
  "Algeria": {
    noun: "provinces",
    names: ["Adrar", "Aïn Defla", "Aïn Témouchent", "Algiers", "Annaba", "Batna", "Béchar", "Béjaïa", "Béni Abbès", "Biskra", "Blida", "Bordj Baji Mokhtar", "Bordj Bou Arréridj", "Bouïra", "Boumerdès", "Chlef", "Constantine", "Djanet", "Djelfa", "El Bayadh", "El M'ghair", "El Menia", "El Oued", "El Tarf", "Ghardaïa", "Guelma", "Illizi", "In Guezzam", "In Salah", "Jijel", "Khenchela", "Laghouat", "M'Sila", "Mascara", "Médéa", "Mila", "Mostaganem", "Naama", "Oran", "Ouargla", "Ouled Djellal", "Oum El Bouaghi", "Relizane", "Saïda", "Sétif", "Sidi Bel Abbès", "Skikda", "Souk Ahras", "Tamanghasset", "Tébessa", "Tiaret", "Timimoun", "Tindouf", "Tipasa", "Tissemsilt", "Tizi Ouzou", "Tlemcen", "Touggourt"],
  },
  "Andorra": {
    noun: "parishes",
    names: ["Andorra la Vella", "Canillo", "Encamp", "Escaldes-Engordany", "La Massana", "Ordino", "Sant Julià de Lòria"],
  },
  "Angola": {
    noun: "provinces",
    names: ["Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza", "Cuanza Norte", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"],
  },
  "Antigua and Barbuda": {
    noun: "parishes",
    names: ["Barbuda", "Redonda", "Saint George", "Saint John", "Saint Mary", "Saint Paul", "Saint Peter", "Saint Philip"],
  },
  "Argentina": {
    noun: "provinces",
    names: ["Autonomous City of Buenos Aires", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"],
  },
  "Armenia": {
    noun: "regions",
    names: ["Aragatsotn", "Ararat", "Armavir", "Gegharkunik", "Kotayk", "Lori", "Shirak", "Syunik", "Tavush", "Vayots Dzor", "Yerevan"],
  },
  "Australia": {
    noun: "states",
    names: ["Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"],
  },
  "Austria": {
    noun: "states",
    names: ["Burgenland", "Carinthia", "Lower Austria", "Salzburg", "Styria", "Tyrol", "Upper Austria", "Vienna", "Vorarlberg"],
  },
  "Azerbaijan": {
    noun: "districts",
    names: ["Absheron", "Agdam", "Agdash", "Aghjabadi", "Agstafa", "Agsu", "Astara", "Babek", "Baku", "Balakan", "Barda", "Beylagan", "Bilasuvar", "Dashkasan", "Fizuli", "Ganja", "Gədəbəy", "Gobustan", "Goranboy", "Goychay", "Goygol", "Hajigabul", "Imishli", "Ismailli", "Jabrayil", "Jalilabad", "Julfa", "Kalbajar", "Kangarli", "Khachmaz", "Khankendi", "Khizi", "Khojali", "Kurdamir", "Lachin", "Lankaran", "Lerik", "Martuni", "Masally", "Mingachevir", "Naftalan", "Nakhchivan", "Neftchala", "Oghuz", "Ordubad", "Qabala", "Qakh", "Qazakh", "Quba", "Qubadli", "Qusar", "Saatly", "Sabirabad", "Sadarak", "Salyan", "Samukh", "Shabran", "Shahbuz", "Shaki", "Shamakhi", "Shamkir", "Sharur", "Shirvan", "Shusha", "Siazan", "Sumqayit", "Tartar", "Tovuz", "Ujar", "Yardymli", "Yevlakh", "Zangilan", "Zaqatala", "Zardab"],
  },
  "Bahamas": {
    noun: "districts",
    names: ["Acklins", "Berry Islands", "Bimini", "Black Point", "Cat Island", "Central Abaco", "Central Andros", "Central Eleuthera", "Crooked Island", "East Grand Bahama", "Exuma", "Freeport", "Grand Cay", "Harbour Island", "Hope Town", "Inagua", "Long Island", "Mangrove Cay", "Mayaguana", "Moore's Island", "New Providence", "North Abaco", "North Andros", "North Eleuthera", "Ragged Island", "Rum Cay", "San Salvador Island", "South Abaco", "South Andros", "South Eleuthera", "Spanish Wells", "West Grand Bahama"],
  },
  "Bahrain": {
    noun: "governorates",
    names: ["Capital", "Muharraq", "Northern", "Southern"],
  },
  "Bangladesh": {
    noun: "divisions",
    names: ["Barisal", "Chittagong", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"],
  },
  "Barbados": {
    noun: "parishes",
    names: ["Christ Church", "Saint Andrew", "Saint George", "Saint James", "Saint John", "Saint Joseph", "Saint Lucy", "Saint Michael", "Saint Peter", "Saint Philip", "Saint Thomas"],
  },
  "Belarus": {
    noun: "oblasts",
    names: ["Brest", "Gomel", "Grodno", "Minsk", "Mogilev", "Vitebsk"],
  },
  "Belgium": {
    noun: "provinces",
    names: ["Antwerp", "East Flanders", "Flemish Brabant", "Hainaut", "Liège", "Limburg", "Luxembourg", "Namur", "Walloon Brabant", "West Flanders"],
  },
  "Belize": {
    noun: "districts",
    names: ["Belize", "Cayo", "Corozal", "Orange Walk", "Stann Creek", "Toledo"],
  },
  "Benin": {
    noun: "departments",
    names: ["Alibori", "Atakora", "Atlantique", "Borgou", "Collines", "Donga", "Kouffo", "Littoral", "Mono", "Ouémé", "Plateau", "Zou"],
  },
  "Bhutan": {
    noun: "districts",
    names: ["Bumthang", "Chukha", "Dagana", "Gasa", "Haa", "Lhuntse", "Mongar", "Paro", "Pemagatshel", "Punakha", "Samdrup Jongkhar", "Samtse", "Sarpang", "Thimphu", "Trashi Yangtse", "Trashigang", "Trongsa", "Tsirang", "Wangdue Phodrang", "Zhemgang"],
  },
  "Bolivia": {
    noun: "departments",
    names: ["Beni", "Chuquisaca", "Cochabamba", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"],
  },
  "Bosnia and Herzegovina": {
    noun: "entities",
    names: ["Brčko", "Federation of Bosnia and Herzegovina", "Republika Srpska"],
  },
  "Botswana": {
    noun: "districts",
    names: ["Central", "Chobe", "Francistown", "Gaborone", "Ghanzi", "Jwaneng", "Kgalagadi", "Kgatleng", "Kweneng", "Lobatse", "North-East", "North-West", "Selibe Phikwe", "South-East", "Southern", "Sowa Town"],
  },
  "Brazil": {
    noun: "states",
    names: ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"],
  },
  "Brunei": {
    noun: "districts",
    names: ["Belait", "Brunei-Muara", "Temburong", "Tutong"],
  },
  "Bulgaria": {
    noun: "districts",
    names: ["Blagoevgrad", "Burgas", "Dobrich", "Gabrovo", "Haskovo", "Kardzhali", "Kyustendil", "Lovech", "Montana", "Pazardzhik", "Pernik", "Pleven", "Plovdiv", "Razgrad", "Ruse", "Shumen", "Silistra", "Sliven", "Smolyan", "Sofia", "Sofia City", "Stara Zagora", "Targovishte", "Varna", "Veliko Tarnovo", "Vidin", "Vratsa", "Yambol"],
  },
  "Burkina Faso": {
    noun: "regions",
    names: ["Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", "Plateau-Central", "Sahel", "Sud-Ouest"],
  },
  "Burundi": {
    noun: "provinces",
    names: ["Bubanza", "Bujumbura Mairie", "Bujumbura Rural", "Bururi", "Cankuzo", "Cibitoke", "Gitega", "Karuzi", "Kayanza", "Kirundo", "Makamba", "Muramvya", "Muyinga", "Mwaro", "Ngozi", "Rumonge", "Rutana", "Ruyigi"],
  },
  "Cabo Verde": {
    noun: "municipalities",
    names: ["Barlavento Islands", "Boa Vista", "Brava", "Maio", "Mosteiros", "Paul", "Porto Novo", "Praia", "Ribeira Brava", "Ribeira Grande", "Ribeira Grande de Santiago", "Sal", "Santa Catarina", "Santa Catarina do Fogo", "Santa Cruz", "São Domingos", "São Filipe", "São Lourenço dos Órgãos", "São Miguel", "São Salvador do Mundo", "São Vicente", "Sotavento Islands", "Tarrafal", "Tarrafal de São Nicolau"],
  },
  "Cambodia": {
    noun: "provinces",
    names: ["Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong", "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin", "Phnom Penh", "Preah Vihear", "Prey Veng", "Pursat", "Ratanakiri", "Siem Reap", "Sihanoukville", "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum"],
  },
  "Cameroon": {
    noun: "regions",
    names: ["Adamawa", "Centre", "East", "Far North", "Littoral", "North", "Northwest", "South", "Southwest", "West"],
  },
  "Canada": {
    noun: "provinces",
    names: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"],
  },
  "Central African Republic": {
    noun: "prefectures",
    names: ["Bamingui-Bangoran", "Bangui", "Basse-Kotto", "Haut-Mbomou", "Haute-Kotto", "Kémo", "Lobaye", "Mambéré-Kadéï", "Mbomou", "Nana-Grébizi", "Nana-Mambéré", "Ombella-M'Poko", "Ouaka", "Ouham", "Ouham-Pendé", "Sangha-Mbaéré", "Vakaga"],
  },
  "Chad": {
    noun: "provinces",
    names: ["Bahr el Gazel", "Batha", "Borkou", "Chari-Baguirmi", "Ennedi-Est", "Ennedi-Ouest", "Guéra", "Hadjer-Lamis", "Kanem", "Lac", "Logone Occidental", "Logone Oriental", "Mandoul", "Mayo-Kebbi Est", "Mayo-Kebbi Ouest", "Moyen-Chari", "N'Djamena", "Ouaddaï", "Salamat", "Sila", "Tandjilé", "Tibesti", "Wadi Fira"],
  },
  "Chile": {
    noun: "regions",
    names: ["Aisén del General Carlos Ibañez del Campo", "Antofagasta", "Arica y Parinacota", "Atacama", "Biobío", "Coquimbo", "La Araucanía", "Libertador General Bernardo O'Higgins", "Los Lagos", "Los Ríos", "Magallanes y de la Antártica Chilena", "Maule", "Ñuble", "Región Metropolitana de Santiago", "Tarapacá", "Valparaíso"],
  },
  "China": {
    noun: "provinces",
    names: ["Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan", "Hong Kong SAR", "Hubei", "Hunan", "Inner Mongolia", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Macau SAR", "Ningxia", "Qinghai", "Shaanxi", "Shandong", "Shanghai", "Shanxi", "Sichuan", "Taiwan", "Tianjin", "Tibet", "Xinjiang", "Yunnan", "Zhejiang"],
  },
  "Colombia": {
    noun: "departments",
    names: ["Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés, Providencia y Santa Catalina", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"],
  },
  "Comoros": {
    noun: "islands",
    names: ["Anjouan", "Grande Comore", "Mohéli"],
  },
  "Congo (Democratic Republic of the)": {
    noun: "provinces",
    names: ["Bas-Uélé", "Équateur", "Haut-Katanga", "Haut-Lomami", "Haut-Uélé", "Ituri", "Kasaï", "Kasaï Central", "Kasaï Oriental", "Kinshasa", "Kongo Central", "Kwango", "Kwilu", "Lomami", "Lualaba", "Mai-Ndombe", "Maniema", "Mongala", "Nord-Kivu", "Nord-Ubangi", "Sankuru", "Sud-Kivu", "Sud-Ubangi", "Tanganyika", "Tshopo", "Tshuapa"],
  },
  "Congo (Republic of the)": {
    noun: "departments",
    names: ["Bouenza", "Brazzaville", "Cuvette", "Cuvette-Ouest", "Kouilou", "Lékoumou", "Likouala", "Niari", "Plateaux", "Pointe-Noire", "Pool", "Sangha"],
  },
  "Costa Rica": {
    noun: "provinces",
    names: ["Alajuela", "Cartago", "Guanacaste", "Heredia", "Limón", "Puntarenas", "San José"],
  },
  "Croatia": {
    noun: "counties",
    names: ["Bjelovar-Bilogora", "Brod-Posavina", "Dubrovnik-Neretva", "Istria", "Karlovac", "Koprivnica-Križevci", "Krapina-Zagorje", "Lika-Senj", "Međimurje", "Osijek-Baranja", "Požega-Slavonia", "Primorje-Gorski Kotar", "Šibenik-Knin", "Sisak-Moslavina", "Split-Dalmatia", "Varaždin", "Virovitica-Podravina", "Vukovar-Syrmia", "Zadar", "Zagreb"],
  },
  "Cuba": {
    noun: "provinces",
    names: ["Artemisa", "Camagüey", "Ciego de Ávila", "Cienfuegos", "Granma", "Guantánamo", "Havana", "Holguín", "Isla de la Juventud", "Las Tunas", "Matanzas", "Mayabeque", "Pinar del Río", "Sancti Spíritus", "Santiago de Cuba", "Villa Clara"],
  },
  "Cyprus": {
    noun: "districts",
    names: ["Famagusta (Mağusa)", "Kyrenia (Keryneia)", "Larnaca (Larnaka)", "Limassol (Leymasun)", "Nicosia (Lefkoşa)", "Paphos (Pafos)"],
  },
  "Czechia": {
    noun: "regions",
    names: ["Jihočeský kraj", "Jihomoravský kraj", "Karlovarský kraj", "Kraj Vysočina", "Královéhradecký kraj", "Liberecký kraj", "Moravskoslezský kraj", "Olomoucký kraj", "Pardubický kraj", "Plzeňský kraj", "Praha, Hlavní město", "Středočeský kraj", "Ústecký kraj", "Zlínský kraj"],
  },
  "Denmark": {
    noun: "regions",
    names: ["Central Denmark", "Denmark", "North Denmark", "Southern Denmark", "Zealand"],
  },
  "Djibouti": {
    noun: "regions",
    names: ["Ali Sabieh", "Arta", "Dikhil", "Djibouti", "Obock", "Tadjourah"],
  },
  "Dominica": {
    noun: "parishes",
    names: ["Saint Andrew", "Saint David", "Saint George", "Saint John", "Saint Joseph", "Saint Luke", "Saint Mark", "Saint Patrick", "Saint Paul", "Saint Peter"],
  },
  "Dominican Republic": {
    noun: "provinces",
    names: ["Azua", "Baoruco", "Barahona", "Cibao Nordeste", "Cibao Noroeste", "Cibao Norte", "Cibao Sur", "Dajabón", "Distrito Nacional", "Duarte", "El Seibo", "El Valle", "Elías Piña", "Enriquillo", "Espaillat", "Hato Mayor", "Hermanas Mirabal", "Higuamo", "Independencia", "La Altagracia", "La Romana", "La Vega", "María Trinidad Sánchez", "Monseñor Nouel", "Monte Cristi", "Monte Plata", "Ozama", "Pedernales", "Peravia", "Puerto Plata", "Samaná", "San Cristóbal", "San José de Ocoa", "San Juan", "San Pedro de Macorís", "Sánchez Ramírez", "Santiago", "Santiago Rodríguez", "Santo Domingo", "Valdesia", "Valverde", "Yuma"],
  },
  "Ecuador": {
    noun: "provinces",
    names: ["Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona-Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", "Zamora Chinchipe"],
  },
  "Egypt": {
    noun: "governorates",
    names: ["Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta", "Faiyum", "Gharbia", "Giza", "Ismailia", "Kafr El-Sheikh", "Luxor", "Matrouh", "Minya", "Monufia", "New Valley", "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez"],
  },
  "El Salvador": {
    noun: "departments",
    names: ["Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", "La Paz", "La Unión", "Morazán", "San Miguel", "San Salvador", "San Vicente", "Santa Ana", "Sonsonate", "Usulután"],
  },
  "Equatorial Guinea": {
    noun: "provinces",
    names: ["Annobón", "Bioko Norte", "Bioko Sur", "Centro Sur", "Djibloho", "Insular", "Kié-Ntem", "Litoral", "Río Muni", "Wele-Nzas"],
  },
  "Eritrea": {
    noun: "regions",
    names: ["Anseba", "Debub", "Gash-Barka", "Maekel", "Northern Red Sea", "Southern Red Sea"],
  },
  "Estonia": {
    noun: "counties",
    names: ["Harju", "Hiiu", "Ida-Viru", "Järva", "Jõgeva", "Lääne", "Lääne-Viru", "Pärnu", "Põlva", "Rapla", "Saare", "Tartu", "Valga", "Viljandi", "Võru"],
  },
  "Eswatini": {
    noun: "regions",
    names: ["Hhohho", "Lubombo", "Manzini", "Shiselweni"],
  },
  "Ethiopia": {
    noun: "regions",
    names: ["Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa", "Gambela", "Harari", "Oromia", "Sidama", "Somali", "Southern Nations, Nationalities, and Peoples", "Southwest Ethiopia Peoples", "Tigray"],
  },
  "Fiji": {
    noun: "provinces",
    names: ["Ba", "Bua", "Cakaudrove", "Kadavu", "Lau", "Lomaiviti", "Macuata", "Nadroga-Navosa", "Naitasiri", "Namosi", "Ra", "Rewa", "Serua", "Tailevu"],
  },
  "Finland": {
    noun: "regions",
    names: ["Central Finland", "Central Ostrobothnia", "Finland Proper", "Kainuu", "Kymenlaakso", "Lapland", "North Karelia", "Northern Ostrobothnia", "Northern Savonia", "Ostrobothnia", "Päijänne Tavastia", "Pirkanmaa", "Satakunta", "South Karelia", "Southern Ostrobothnia", "Southern Savonia", "Tavastia Proper", "Uusimaa"],
  },
  "France": {
    noun: "regions",
    names: ["Alsace", "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire", "Clipperton", "Corse", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Grand-Est", "Guadeloupe", "Hauts-de-France", "Île-de-France", "La Réunion", "Martinique", "Mayotte", "Métropole de Lyon", "Normandie", "Nouvelle-Aquitaine", "Nouvelle-Calédonie", "Occitanie", "Paris", "Pays-de-la-Loire", "Provence-Alpes-Côte-d’Azur", "Saint Pierre and Miquelon", "Saint-Barthélemy", "Saint-Martin", "Wallis and Futuna"],
  },
  "Gabon": {
    noun: "provinces",
    names: ["Estuaire", "Haut-Ogooué", "Moyen-Ogooué", "Ngounié", "Nyanga", "Ogooué-Ivindo", "Ogooué-Lolo", "Ogooué-Maritime", "Woleu-Ntem"],
  },
  "Gambia": {
    noun: "divisions",
    names: ["Banjul", "Central River", "Lower River", "North Bank", "Upper River", "West Coast"],
  },
  "Georgia": {
    noun: "regions",
    names: ["Abkhazia", "Adjara", "Guria", "Imereti", "Kakheti", "Kvemo Kartli", "Mtskheta-Mtianeti", "Racha-Lechkhumi and Kvemo Svaneti", "Samegrelo-Zemo Svaneti", "Samtskhe-Javakheti", "Shida Kartli", "Tbilisi"],
  },
  "Germany": {
    noun: "states",
    names: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"],
  },
  "Ghana": {
    noun: "regions",
    names: ["Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"],
  },
  "Greece": {
    noun: "administrative regions",
    names: ["Attica", "Central Greece", "Central Macedonia", "Crete", "East Macedonia and Thrace", "Epirus", "Ionian Islands", "North Aegean", "Peloponnese", "South Aegean", "Thessaly", "West Greece", "West Macedonia"],
  },
  "Grenada": {
    noun: "parishes",
    names: ["Carriacou", "Saint Andrew", "Saint David", "Saint George", "Saint John", "Saint Mark", "Saint Patrick"],
  },
  "Guatemala": {
    noun: "departments",
    names: ["Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla", "Guatemala", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango", "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa"],
  },
  "Guinea": {
    noun: "administrative regions",
    names: ["Boké", "Conakry", "Faranah", "Kankan", "Kindia", "Labé", "Mamou", "Nzérékoré"],
  },
  "Guinea-Bissau": {
    noun: "regions",
    names: ["Bafatá", "Biombo", "Bolama", "Cacheu", "Gabú", "Oio", "Quinara", "Tombali"],
  },
  "Guyana": {
    noun: "regions",
    names: ["Barima-Waini", "Cuyuni-Mazaruni", "Demerara-Mahaica", "East Berbice-Corentyne", "Essequibo Islands-West Demerara", "Mahaica-Berbice", "Pomeroon-Supenaam", "Potaro-Siparuni", "Upper Demerara-Berbice", "Upper Takutu-Upper Essequibo"],
  },
  "Haiti": {
    noun: "departments",
    names: ["Artibonite", "Centre", "Grand'Anse", "Nippes", "Nord", "Nord-Est", "Nord-Ouest", "Ouest", "Sud", "Sud-Est"],
  },
  "Honduras": {
    noun: "departments",
    names: ["Atlántida", "Bay Islands", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso", "Francisco Morazán", "Gracias a Dios", "Intibucá", "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"],
  },
  "Hong Kong": {
    noun: "districts",
    names: ["Central and Western", "Eastern", "Islands", "Kowloon City", "Kwai Tsing", "Kwun Tong", "North", "Sai Kung", "Sha Tin", "Sham Shui Po", "Southern", "Tai Po", "Tsuen Wan", "Tuen Mun", "Wan Chai", "Wong Tai Sin", "Yau Tsim Mong", "Yuen Long"],
  },
  "Hungary": {
    noun: "regions",
    names: ["Bács-Kiskun", "Baranya", "Békés", "Békéscsaba", "Borsod-Abaúj-Zemplén", "Budapest", "Csongrád County", "Debrecen", "Dunaújváros", "Eger", "Érd", "Fejér County", "Győr", "Győr-Moson-Sopron County", "Hajdú-Bihar County", "Heves County", "Hódmezővásárhely", "Jász-Nagykun-Szolnok County", "Kaposvár", "Kecskemét", "Komárom-Esztergom", "Miskolc", "Nagykanizsa", "Nógrád County", "Nyíregyháza", "Pécs", "Pest County", "Salgótarján", "Somogy County", "Sopron", "Szabolcs-Szatmár-Bereg County", "Szeged", "Székesfehérvár", "Szekszárd", "Szolnok", "Szombathely", "Tatabánya", "Tolna County", "Vas County", "Veszprém", "Veszprém County", "Zala County", "Zalaegerszeg"],
  },
  "Iceland": {
    noun: "municipalities",
    names: ["Akranes", "Akureyri", "Árborg", "Árneshreppur", "Ásahreppur", "Bláskógabyggð", "Bolungarvík", "Borgarbyggð", "Capital", "Dalabyggð", "Dalvíkurbyggð", "Eastern", "Eyja- og Miklaholtshreppur", "Eyjafjarðarsveit", "Fjallabyggð", "Fjarðabyggð", "Fljótsdalshreppur", "Flóahreppur", "Garðabær", "Grímsnes- og Grafningshreppur", "Grindavík", "Grundarfjörður", "Grýtubakkahreppur", "Hafnarfjörður", "Hörðarsveit", "Hornafjörður", "Hrunamannahreppur", "Húnabyggð", "Húnaþing vestra", "Hvalfjarðarsveit", "Hveragerði", "Ísafjörður", "Kaldrananeshreppur", "Kjósarhreppur", "Kópavogur", "Langanesbyggð", "Mosfellsbær", "Múlaþing", "Mýrdalshreppur", "Norðurþing", "Northeastern", "Northwestern", "Ölfus", "Rangárþing eystra", "Rangárþing ytra", "Reykhólahreppur", "Reykjanesbær", "Reykjavík", "Seltjarnarnes", "Skaftárhreppur", "Skagabyggð", "Skagafjörður", "Skagaströnd", "Skeiða- og Gnúpverjahreppur", "Skorradalshreppur", "Snæfellsbær", "Southern", "Southern Peninsula", "Strandabyggð", "Stykkishólmur", "Súðavík", "Suðurnesjabær", "Svalbardsstrandarhreppur", "Tálknafjarðarhreppur", "Tjörneshreppur", "Vestmannaeyjar", "Vesturbyggð", "Vogar", "Vopnafjarðarhreppur", "Western", "Westfjords", "Þingeyjarsveit"],
  },
  "India": {
    noun: "states",
    names: ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
  },
  "Indonesia": {
    noun: "provinces",
    names: ["Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta", "Gorontalo", "Jambi", "Jawa", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan", "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat", "Papua Barat Daya", "Papua Pegunungan", "Papua Selatan", "Papua Tengah", "Riau", "Sulawesi", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera", "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"],
  },
  "Iran": {
    noun: "provinces",
    names: ["Alborz", "Ardabil", "Bushehr", "Chaharmahal and Bakhtiari", "East Azerbaijan", "Fars", "Gilan", "Golestan", "Hamadan", "Hormozgan", "Ilam", "Isfahan", "Kerman", "Kermanshah", "Khuzestan", "Kohgiluyeh and Boyer-Ahmad", "Kurdistan", "Lorestan", "Markazi", "Mazandaran", "North Khorasan", "Qazvin", "Qom", "Razavi Khorasan", "Semnan", "Sistan and Baluchestan", "South Khorasan", "Tehran", "West Azarbaijan", "Yazd", "Zanjan"],
  },
  "Iraq": {
    noun: "governorates",
    names: ["Al Anbar", "Al Muthanna", "Al-Qādisiyyah", "Babylon", "Baghdad", "Basra", "Dhi Qar", "Diyala", "Dohuk", "Erbil", "Iqlim Kurdistan", "Karbala", "Kirkuk", "Maysan", "Najaf", "Nineveh", "Saladin", "Sulaymaniyah", "Wasit"],
  },
  "Ireland": {
    noun: "counties",
    names: ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"],
  },
  "Israel": {
    noun: "districts",
    names: ["Central", "Haifa", "Jerusalem", "Northern", "Southern", "Tel Aviv"],
  },
  "Italy": {
    noun: "regions",
    names: ["Abruzzo", "Aosta Valley", "Apulia", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli–Venezia Giulia", "Lazio", "Liguria", "Lombardy", "Marche", "Molise", "Piedmont", "Sardinia", "Sicily", "Trentino-South Tyrol", "Tuscany", "Umbria", "Veneto"],
  },
  "Ivory Coast": {
    noun: "districts",
    names: ["Abidjan", "Bas-Sassandra", "Comoé", "Denguélé", "Gôh-Djiboua", "Lacs", "Lagunes", "Montagnes", "Sassandra-Marahoué", "Savanes", "Vallée du Bandama", "Woroba", "Yamoussoukro", "Zanzan"],
  },
  "Jamaica": {
    noun: "parishes",
    names: ["Clarendon", "Hanover", "Kingston", "Manchester", "Portland", "Saint Andrew", "Saint Ann", "Saint Catherine", "Saint Elizabeth", "Saint James", "Saint Mary", "Saint Thomas", "Trelawny", "Westmoreland"],
  },
  "Japan": {
    noun: "prefectures",
    names: ["Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", "Gunma", "Hiroshima", "Hokkaidō", "Hyōgo", "Ibaraki", "Ishikawa", "Iwate", "Kagawa", "Kagoshima", "Kanagawa", "Kōchi", "Kumamoto", "Kyōto", "Mie", "Miyagi", "Miyazaki", "Nagano", "Nagasaki", "Nara", "Niigata", "Ōita", "Okayama", "Okinawa", "Ōsaka", "Saga", "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi", "Tokushima", "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"],
  },
  "Jordan": {
    noun: "governorates",
    names: ["Ajloun", "Amman", "Aqaba", "Balqa", "Irbid", "Jerash", "Karak", "Ma'an", "Madaba", "Mafraq", "Tafilah", "Zarqa"],
  },
  "Kazakhstan": {
    noun: "regions",
    names: ["Abai", "Akmola", "Aktobe", "Almaty", "Astana", "Atyrau", "East Kazakhstan", "Jambyl", "Jetisu", "Karaganda", "Kostanay", "Kyzylorda", "Mangystau", "North Kazakhstan", "Pavlodar", "Shymkent", "Turkistan", "Ulytau", "West Kazakhstan"],
  },
  "Kenya": {
    noun: "counties",
    names: ["Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi City", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita–Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"],
  },
  "Kiribati": {
    noun: "islands",
    names: ["Gilbert", "Line", "Phoenix"],
  },
  "Kosovo": {
    noun: "districts",
    names: ["Ferizaj", "Gjakove", "Gjilan", "Mitrovica", "Peja", "Pristina", "Prizren"],
  },
  "Kuwait": {
    noun: "governorates",
    names: ["Al Ahmadi", "Al Asimah", "Al Farwaniyah", "Al Jahra", "Hawalli", "Mubarak Al-Kabeer"],
  },
  "Kyrgyzstan": {
    noun: "regions",
    names: ["Batken", "Bishkek", "Chuy", "Issyk-Kul", "Jalal-Abad", "Naryn", "Osh", "Talas"],
  },
  "Laos": {
    noun: "provinces",
    names: ["Attapeu", "Bokeo", "Bolikhamsai", "Champasak", "Houaphanh", "Khammouane", "Luang Namtha", "Luang Prabang", "Oudomxay", "Phongsaly", "Sainyabuli", "Salavan", "Savannakhet", "Sekong", "Vientiane", "Xaisomboun", "Xiangkhouang"],
  },
  "Latvia": {
    noun: "municipalities",
    names: ["Ādaži", "Aizkraukle", "Alūksne", "Augšdaugava", "Balvi", "Bauska", "Cēsis", "Daugavpils", "Dienvidkurzemes", "Dobele", "Gulbene", "Jēkabpils", "Jelgava", "Jūrmala", "Ķekava", "Krāslava", "Kuldīga", "Liepāja", "Limbaži", "Līvāni", "Ludza", "Madona", "Mārupe", "Ogre", "Olaine", "Preiļi", "Rēzekne", "Riga", "Ropaži", "Salaspils", "Saldus", "Saulkrasti", "Sigulda", "Smiltene", "Talsi", "Tukums", "Valka", "Valmiera", "Varakļāni", "Ventspils"],
  },
  "Lebanon": {
    noun: "governorates",
    names: ["Akkar", "Baalbek-Hermel", "Beirut", "Beqaa", "Mount Lebanon", "Nabatieh", "North", "South"],
  },
  "Lesotho": {
    noun: "districts",
    names: ["Berea", "Butha-Buthe", "Leribe", "Mafeteng", "Maseru", "Mohale's Hoek", "Mokhotlong", "Qacha's Nek", "Quthing", "Thaba-Tseka"],
  },
  "Liberia": {
    noun: "counties",
    names: ["Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount", "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland", "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe"],
  },
  "Libya": {
    noun: "popularates",
    names: ["Al Butnan", "Al Wahat", "Benghazi", "Derna", "Ghat", "Jabal al Akhdar", "Jabal al Gharbi", "Jafara", "Jufra", "Kufra", "Marj", "Misrata", "Murqub", "Murzuq", "Nalut", "Nuqat al Khams", "Sabha", "Sirte", "Tripoli", "Wadi al Hayaa", "Wadi al Shatii", "Zawiya"],
  },
  "Liechtenstein": {
    noun: "communes",
    names: ["Balzers", "Eschen", "Gamprin", "Mauren", "Planken", "Ruggell", "Schaan", "Schellenberg", "Triesen", "Triesenberg", "Vaduz"],
  },
  "Lithuania": {
    noun: "counties",
    names: ["Alytus", "Kaunas", "Klaipėda", "Marijampolė", "Panevėžys", "Šiauliai", "Tauragė", "Telšiai", "Utena", "Vilnius"],
  },
  "Luxembourg": {
    noun: "cantons",
    names: ["Capellen", "Clervaux", "Diekirch", "Echternach", "Esch-sur-Alzette", "Grevenmacher", "Luxembourg", "Mersch", "Redange", "Remich", "Vianden", "Wiltz"],
  },
  "Madagascar": {
    noun: "provinces",
    names: ["Antananarivo", "Antsiranana", "Fianarantsoa", "Mahajanga", "Toamasina", "Toliara"],
  },
  "Malawi": {
    noun: "districts",
    names: ["Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa", "Dedza", "Dowa", "Karonga", "Kasungu", "Likoma", "Lilongwe", "Machinga", "Mangochi", "Mchinji", "Mulanje", "Mwanza", "Mzimba", "Neno", "Nkhata Bay", "Nkhotakota", "Nsanje", "Ntcheu", "Ntchisi", "Phalombe", "Rumphi", "Salima", "Thyolo", "Zomba"],
  },
  "Malaysia": {
    noun: "states",
    names: ["Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"],
  },
  "Maldives": {
    noun: "administrative atolls",
    names: ["Addu", "Alif Alif", "Alif Dhaal", "Baa", "Dhaalu", "Faafu", "Gaafu Alif", "Gaafu Dhaalu", "Gnaviyani", "Haa Alif", "Haa Dhaalu", "Kaafu", "Laamu", "Lhaviyani", "Malé", "Meemu", "Noonu", "Raa", "Shaviyani", "Thaa", "Vaavu"],
  },
  "Mali": {
    noun: "regions",
    names: ["Bamako", "Gao", "Kayes", "Kidal", "Koulikoro", "Ménaka", "Mopti", "Ségou", "Sikasso", "Taoudénit", "Tombouctou"],
  },
  "Malta": {
    noun: "local councils",
    names: ["Attard", "Balzan", "Birgu", "Birkirkara", "Birżebbuġa", "Cospicua", "Dingli", "Fgura", "Floriana", "Fontana", "Għajnsielem", "Għarb", "Għargħur", "Għasri", "Għaxaq", "Gudja", "Gżira", "Ħamrun", "Iklin", "Kalkara", "Kerċem", "Kirkop", "Lija", "Luqa", "Marsa", "Marsaskala", "Marsaxlokk", "Mdina", "Mellieħa", "Mġarr", "Mosta", "Mqabba", "Msida", "Mtarfa", "Munxar", "Nadur", "Naxxar", "Paola", "Pembroke", "Pietà", "Qala", "Qormi", "Qrendi", "Rabat", "Safi", "San Ġwann", "San Lawrenz", "Sannat", "Santa Luċija", "Santa Venera", "Senglea", "Siġġiewi", "Sliema", "St. Julian's", "St. Paul's Bay", "Swieqi", "Ta' Xbiex", "Tarxien", "Valletta", "Victoria", "Xagħra", "Xewkija", "Xgħajra", "Żabbar", "Żebbuġ Gozo", "Żebbuġ Malta", "Żejtun", "Żurrieq"],
  },
  "Marshall Islands": {
    noun: "municipalities",
    names: ["Ailinglaplap", "Ailuk", "Arno", "Aur", "Bikini & Kili", "Ebon", "Enewetak & Ujelang", "Jabat", "Jaluit", "Kwajalein", "Lae", "Lib", "Likiep", "Majuro", "Maloelap", "Mejit", "Mili", "Namdrik", "Namu", "Rongelap", "Ujae", "Utrik", "Wotho", "Wotje"],
  },
  "Mauritania": {
    noun: "regions",
    names: ["Adrar", "Assaba", "Brakna", "Dakhlet Nouadhibou", "Gorgol", "Guidimaka", "Hodh Ech Chargui", "Hodh El Gharbi", "Inchiri", "Nouakchott-Nord", "Nouakchott-Ouest", "Nouakchott-Sud", "Tagant", "Tiris Zemmour", "Trarza"],
  },
  "Mauritius": {
    noun: "districts",
    names: ["Agalega Islands", "Black River", "Flacq", "Grand Port", "Moka", "Pamplemousses", "Plaines Wilhems", "Port Louis", "Rivière du Rempart", "Rodrigues Island", "Saint Brandon Islands", "Savanne"],
  },
  "Mexico": {
    noun: "states",
    names: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila de Zaragoza", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán de Ocampo", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz de Ignacio de la Llave", "Yucatán", "Zacatecas"],
  },
  "Micronesia": {
    noun: "states",
    names: ["Chuuk", "Kosrae", "Pohnpei", "Yap"],
  },
  "Moldova": {
    noun: "districts",
    names: ["Anenii Noi", "Bălți", "Basarabeasca", "Bender", "Briceni", "Cahul", "Călărași", "Cantemir", "Căușeni", "Chișinău", "Cimișlia", "Criuleni", "Dondușeni", "Drochia", "Dubăsari", "Edineț", "Fălești", "Florești", "Gagauzia", "Glodeni", "Hîncești", "Ialoveni", "Leova", "Nisporeni", "Ocnița", "Orhei", "Rezina", "Rîșcani", "Sîngerei", "Șoldănești", "Soroca", "Ștefan Vodă", "Strășeni", "Taraclia", "Telenești", "Transnistria", "Ungheni"],
  },
  "Monaco": {
    noun: "quarters",
    names: ["Fontvieille", "Jardin Exotique", "La Colle", "La Condamine", "La Gare", "La Source", "Larvotto", "Malbousquet", "Monaco-Ville", "Moneghetti", "Monte-Carlo", "Moulins", "Port-Hercule", "Saint-Roman", "Sainte-Dévote", "Spélugues", "Vallon de la Rousse"],
  },
  "Mongolia": {
    noun: "provinces",
    names: ["Arkhangai", "Bayan-Ölgii", "Bayankhongor", "Bulgan", "Darkhan-Uul", "Dornod", "Dornogovi", "Dundgovi", "Govi-Altai", "Govisümber", "Khentii", "Khovd", "Khövsgöl", "Ömnögovi", "Orkhon", "Övörkhangai", "Selenge", "Sükhbaatar", "Töv", "Ulaanbaatar", "Uvs", "Zavkhan"],
  },
  "Montenegro": {
    noun: "municipalities",
    names: ["Andrijevica", "Bar", "Berane", "Bijelo Polje", "Budva", "Danilovgrad", "Gusinje", "Herceg-Novi", "Kolašin", "Kotor", "Mojkovac", "Nikšić", "Old Royal Capital Cetinje", "Petnjica", "Plav", "Pljevlja", "Plužine", "Podgorica", "Rožaje", "Šavnik", "Tivat", "Tuzi", "Ulcinj", "Žabljak", "Zeta"],
  },
  "Morocco": {
    noun: "regions",
    names: ["Béni Mellal-Khénifra", "Casablanca-Settat", "Dakhla-Oued Ed-Dahab (EH)", "Drâa-Tafilalet", "Fès-Meknès", "Guelmim-Oued Noun (EH-partial)", "L'Oriental", "Laâyoune-Sakia El Hamra (EH-partial)", "Marrakesh-Safi", "Rabat-Salé-Kénitra", "Souss-Massa", "Tanger-Tétouan-Al Hoceïma"],
  },
  "Mozambique": {
    noun: "provinces",
    names: ["Cabo Delgado", "Gaza", "Inhambane", "Manica", "Maputo", "Nampula", "Niassa", "Sofala", "Tete", "Zambezia"],
  },
  "Myanmar": {
    noun: "regions",
    names: ["Ayeyarwady", "Bago", "Chin", "Kachin", "Kayah", "Kayin", "Magway", "Mandalay", "Mon State", "Naypyidaw", "Rakhine", "Sagaing", "Shan", "Tanintharyi", "Yangon"],
  },
  "Namibia": {
    noun: "regions",
    names: ["Erongo", "Hardap", "Karas", "Kavango East", "Kavango West", "Khomas", "Kunene", "Ohangwena", "Omaheke", "Omusati", "Oshana", "Oshikoto", "Otjozondjupa", "Zambezi"],
  },
  "Nauru": {
    noun: "districts",
    names: ["Aiwo", "Anabar", "Anetan", "Anibare", "Baiti", "Boe", "Buada", "Denigomodu", "Ewa", "Ijuw", "Meneng", "Nibok", "Uaboe", "Yaren"],
  },
  "Nepal": {
    noun: "provinces",
    names: ["Bagmati", "Gandaki", "Karnali", "Koshi", "Lumbini", "Madhesh", "Sudurpashchim"],
  },
  "Netherlands": {
    noun: "provinces",
    names: ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant", "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"],
  },
  "New Zealand": {
    noun: "regions",
    names: ["Auckland", "Bay of Plenty", "Canterbury", "Chatham Islands", "Gisborne", "Hawke's Bay", "Manawatu-Whanganui", "Marlborough", "Nelson", "Northland", "Otago", "Southland", "Taranaki", "Tasman", "Waikato", "Wellington", "West Coast"],
  },
  "Nicaragua": {
    noun: "departments",
    names: ["Boaco", "Carazo", "Chinandega", "Chontales", "Estelí", "Granada", "Jinotega", "León", "Madriz", "Managua", "Masaya", "Matagalpa", "North Caribbean Coast", "Nueva Segovia", "Río San Juan", "Rivas", "South Caribbean Coast"],
  },
  "Niger": {
    noun: "regions",
    names: ["Agadez", "Diffa", "Dosso", "Maradi", "Niamey", "Tahoua", "Tillabéri", "Zinder"],
  },
  "Nigeria": {
    noun: "states",
    names: ["Abia", "Abuja Federal Capital Territory", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"],
  },
  "North Korea": {
    noun: "provinces",
    names: ["Chagang", "Kaesong", "Kangwon", "Nampho", "North Hamgyong", "North Hwanghae", "North Pyongan", "Pyongyang", "Rason", "Ryanggang", "South Hamgyong", "South Hwanghae", "South Pyongan"],
  },
  "North Macedonia": {
    noun: "municipalities",
    names: ["Aerodrom", "Aračinovo", "Berovo", "Bitola", "Bogdanci", "Bogovinje", "Bosilovo", "Brvenica", "Butel", "Čair", "Čaška", "Centar", "Centar Župa", "Češinovo-Obleševo", "Čučer-Sandevo", "Debar", "Debarca", "Delčevo", "Demir Hisar", "Demir Kapija", "Dojran", "Dolneni", "Gazi Baba", "Gevgelija", "Gjorče Petrov", "Gostivar", "Gradsko", "Ilinden", "Jegunovce", "Karbinci", "Karpoš", "Kavadarci", "Kičevo", "Kisela Voda", "Kočani", "Konče", "Kratovo", "Kriva Palanka", "Krivogaštani", "Kruševo", "Kumanovo", "Lipkovo", "Lozovo", "Makedonska Kamenica", "Makedonski Brod", "Mavrovo and Rostuša", "Mogila", "Negotino", "Novaci", "Novo Selo", "Ohrid", "Pehčevo", "Petrovec", "Plasnica", "Prilep", "Probištip", "Radoviš", "Rankovce", "Resen", "Rosoman", "Saraj", "Sopište", "Staro Nagoričane", "Štip", "Struga", "Strumica", "Studeničani", "Šuto Orizari", "Sveti Nikole", "Tearce", "Tetovo", "Valandovo", "Vasilevo", "Veles", "Vevčani", "Vinica", "Vrapčište", "Zelenikovo", "Želino", "Zrnovci"],
  },
  "Norway": {
    noun: "counties",
    names: ["Agder", "Akershus", "Buskerud", "Finnmark", "Innlandet", "Jan Mayen", "Møre og Romsdal", "Nordland", "Oslo", "Østfold", "Rogaland", "Svalbard", "Telemark", "Troms", "Trøndelag", "Vestfold", "Vestland"],
  },
  "Oman": {
    noun: "governorates",
    names: ["Ad Dakhiliyah", "Ad Dhahirah", "Al Batinah North", "Al Batinah South", "Al Buraimi", "Al Wusta", "Ash Sharqiyah North", "Ash Sharqiyah South", "Dhofar", "Musandam", "Muscat"],
  },
  "Pakistan": {
    noun: "provinces",
    names: ["Azad Kashmir", "Balochistan", "Gilgit-Baltistan", "Islamabad", "Khyber Pakhtunkhwa", "Punjab", "Sindh"],
  },
  "Palau": {
    noun: "states",
    names: ["Aimeliik", "Airai", "Angaur", "Hatohobei", "Kayangel", "Koror", "Melekeok", "Ngaraard", "Ngarchelong", "Ngardmau", "Ngatpang", "Ngchesar", "Ngeremlengui", "Ngiwal", "Peleliu", "Sonsorol"],
  },
  "Palestine": {
    noun: "governorates",
    names: ["Bethlehem", "Deir El Balah", "Gaza", "Hebron", "Jenin", "Jericho", "Jerusalem (Quds)", "Khan Yunis", "Nablus", "North Gaza", "Qalqilya", "Rafah", "Ramallah", "Salfit", "Tubas", "Tulkarm"],
  },
  "Panama": {
    noun: "provinces",
    names: ["Bocas del Toro", "Chiriquí Province", "Coclé", "Colón", "Darién", "Emberá-Wounaan Comarca", "Guna", "Herrera", "Los Santos", "Naso Tjër Di", "Ngöbe-Buglé Comarca", "Panamá", "Panamá Oeste", "Veraguas"],
  },
  "Papua New Guinea": {
    noun: "provinces",
    names: ["Bougainville", "Central", "Chimbu", "East New Britain", "East Sepik", "Eastern Highlands", "Enga", "Gulf", "Hela", "Jiwaka", "Madang", "Manus", "Milne Bay", "Morobe", "New Ireland", "Oro", "Port Moresby", "Sandaun", "Southern Highlands", "West New Britain", "Western", "Western Highlands"],
  },
  "Paraguay": {
    noun: "departments",
    names: ["Alto Paraguay", "Alto Paraná", "Amambay", "Asuncion", "Boquerón", "Caaguazú", "Caazapá", "Canindeyú", "Central", "Concepción", "Cordillera", "Guairá", "Itapúa", "Misiones", "Ñeembucú", "Paraguarí", "Presidente Hayes", "San Pedro"],
  },
  "Peru": {
    noun: "regions",
    names: ["Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huanuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Municipalidad Metropolitana de Lima", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"],
  },
  "Philippines": {
    noun: "regions",
    names: ["Autonomous Region in Muslim Mindanao", "Bicol", "Cagayan Valley", "Calabarzon", "Caraga", "Central Luzon", "Central Visayas", "Cordillera Administrative", "Davao", "Eastern Visayas", "Ilocos", "Mimaropa", "National Capital Region (Metro Manila)", "Northern Mindanao", "Soccsksargen", "Western Visayas", "Zamboanga Peninsula"],
  },
  "Poland": {
    noun: "voivodships",
    names: ["Greater Poland", "Holy Cross", "Kuyavia-Pomerania", "Lesser Poland", "Łódź", "Lower Silesia", "Lublin", "Lubusz", "Mazovia", "Podlaskie", "Pomerania", "Silesia", "Subcarpathia", "Upper Silesia", "Warmia-Masuria", "West Pomerania"],
  },
  "Portugal": {
    noun: "districts",
    names: ["Açores", "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisbon", "Madeira", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"],
  },
  "Qatar": {
    noun: "municipalities",
    names: ["Al Daayen", "Al Khor", "Al Rayyan", "Al Wakrah", "Al-Shahaniya", "Doha", "Madinat ash Shamal", "Umm Salal"],
  },
  "Romania": {
    noun: "departments",
    names: ["Alba", "Arad", "Arges", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Braila", "Brașov", "Bucharest", "Buzău", "Călărași", "Caraș-Severin", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui", "Vrancea"],
  },
  "Russia": {
    noun: "administrative regions",
    names: ["Adygea", "Altai", "Amur", "Arkhangelsk", "Astrakhan", "Bashkortostan", "Belgorod", "Bryansk", "Buryatia", "Chechen", "Chelyabinsk", "Chukotka", "Chuvash", "Dagestan", "Ingushetia", "Irkutsk", "Ivanovo", "Jewish", "Kabardino-Balkar", "Kaliningrad", "Kalmykia", "Kaluga", "Kamchatka", "Karachay-Cherkess", "Karelia", "Kemerovo", "Khabarovsk", "Khakassia", "Khanty-Mansi", "Kirov", "Komi", "Kostroma", "Krasnodar", "Krasnoyarsk", "Kurgan", "Kursk", "Leningrad", "Lipetsk", "Magadan", "Mari El", "Mordovia", "Moscow", "Murmansk", "Nenets", "Nizhny Novgorod", "North Ossetia-Alania", "Novgorod", "Novosibirsk", "Omsk", "Orenburg", "Oryol", "Penza", "Perm", "Primorsky", "Pskov", "Rostov", "Ryazan", "Saint Petersburg", "Sakha", "Sakhalin", "Samara", "Saratov", "Smolensk", "Stavropol", "Sverdlovsk", "Tambov", "Tatarstan", "Tomsk", "Tula", "Tuva", "Tver", "Tyumen", "Udmurt", "Ulyanovsk", "Vladimir", "Volgograd Oblast", "Vologda", "Voronezh", "Yamalo-Nenets", "Yaroslavl", "Zabaykalsky"],
  },
  "Rwanda": {
    noun: "provinces",
    names: ["Eastern", "Kigali", "Northern", "Southern", "Western"],
  },
  "Saint Kitts and Nevis": {
    noun: "parishes",
    names: ["Christ Church Nichola Town", "Saint Anne Sandy Point", "Saint George Basseterre", "Saint George Gingerland", "Saint James Windward", "Saint John Capisterre", "Saint John Figtree", "Saint Mary Cayon", "Saint Paul Capisterre", "Saint Paul Charlestown", "Saint Peter Basseterre", "Saint Thomas Lowland", "Saint Thomas Middle Island", "Trinity Palmetto Point"],
  },
  "Saint Lucia": {
    noun: "districts",
    names: ["Anse la Raye", "Canaries", "Castries", "Choiseul", "Dennery", "Gros Islet", "Laborie", "Micoud", "Soufrière", "Vieux Fort"],
  },
  "Saint Vincent and the Grenadines": {
    noun: "parishes",
    names: ["Charlotte", "Grenadines", "Saint Andrew", "Saint David", "Saint George", "Saint Patrick"],
  },
  "Samoa": {
    noun: "districts",
    names: ["A'ana", "Aiga-i-le-Tai", "Atua", "Fa'asaleleaga", "Gaga'emauga", "Gaga'ifomauga", "Palauli", "Satupa'itea", "Tuamasaga", "Va'a-o-Fonoti", "Vaisigano"],
  },
  "San Marino": {
    noun: "municipalities",
    names: ["Acquaviva", "Borgo Maggiore", "Chiesanuova", "Domagnano", "Faetano", "Fiorentino", "Montegiardino", "San Marino", "Serravalle"],
  },
  "Sao Tome and Principe": {
    noun: "districts",
    names: ["Água Grande", "Cantagalo", "Caué", "Lemba", "Lobata", "Mé-Zóchi", "Príncipe"],
  },
  "Saudi Arabia": {
    noun: "regions",
    names: ["Al Bahah", "Al Jawf", "Al Madinah", "Al-Qassim", "Asir", "Eastern Province", "Ha'il", "Jizan", "Makkah", "Najran", "Northern Borders", "Riyadh", "Tabuk"],
  },
  "Senegal": {
    noun: "regions",
    names: ["Dakar", "Diourbel Region", "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda", "Louga", "Matam", "Saint-Louis", "Sédhiou", "Tambacounda Region", "Thiès Region", "Ziguinchor"],
  },
  "Serbia": {
    noun: "districts",
    names: ["Belgrade", "Bor", "Braničevo", "Central Banat", "Jablanica", "Kolubara", "Kosovo", "Kosovo-Metohija", "Kosovo-Pomoravlje", "Kosovska Mitrovica", "Mačva", "Moravica", "Nišava", "North Bačka", "North Banat", "Pčinja", "Peć", "Pirot", "Podunavlje", "Pomoravlje", "Prizren", "Rasina", "Raška", "South Bačka", "South Banat", "Srem", "Šumadija", "Toplica", "Vojvodina", "West Bačka", "Zaječar", "Zlatibor"],
  },
  "Seychelles": {
    noun: "districts",
    names: ["Anse Boileau", "Anse Etoile", "Anse Royale", "Anse-aux-Pins", "Au Cap", "Baie Lazare", "Baie Sainte Anne", "Beau Vallon", "Bel Air", "Bel Ombre", "Cascade", "Glacis", "Grand'Anse Mahé", "Grand'Anse Praslin", "Ile Perseverance I", "Ile Perseverance II", "La Digue", "La Rivière Anglaise", "Les Mamelles", "Mont Buxton", "Mont Fleuri", "Plaisance", "Pointe La Rue", "Port Glaud", "Roche Caiman", "Saint Louis", "Takamaka"],
  },
  "Sierra Leone": {
    noun: "provinces",
    names: ["Eastern", "North Western", "Northern", "Southern", "Western"],
  },
  "Singapore": {
    noun: "districts",
    names: ["Central Singapore", "North East", "North West", "South East", "South West"],
  },
  "Slovakia": {
    noun: "regions",
    names: ["Banská Bystrica", "Bratislava", "Košice", "Nitra", "Prešov", "Trenčín", "Trnava", "Žilina"],
  },
  "Slovenia": {
    noun: "municipalities",
    names: ["Ajdovščina", "Ankaran", "Apače", "Beltinci", "Benedikt", "Bistrica ob Sotli", "Bled", "Bloke", "Bohinj", "Borovnica", "Bovec", "Braslovče", "Brda", "Brežice", "Brezovica", "Cankova", "Celje", "Cerklje na Gorenjskem", "Cerknica", "Cerkno", "Cerkvenjak", "Cirkulane", "Črenšovci", "Črna na Koroškem", "Črnomelj", "Destrnik", "Divača", "Dobje", "Dobrepolje", "Dobrna", "Dobrova–Polhov Gradec", "Dobrovnik", "Dol pri Ljubljani", "Dolenjske Toplice", "Domžale", "Dornava", "Dravograd", "Duplek", "Gorenja Vas–Poljane", "Gorišnica", "Gorje", "Gornja Radgona", "Gornji Grad", "Gornji Petrovci", "Grad", "Grosuplje", "Hajdina", "Hoče–Slivnica", "Hodoš", "Horjul", "Hrastnik", "Hrpelje–Kozina", "Idrija", "Ig", "Ilirska Bistrica", "Ivančna Gorica", "Izola", "Jesenice", "Jezersko", "Juršinci", "Kamnik", "Kanal ob Soči", "Kidričevo", "Kobarid", "Kobilje", "Kočevje", "Komen", "Komenda", "Koper", "Kostanjevica na Krki", "Kostel", "Kozje", "Kranj", "Kranjska Gora", "Križevci", "Krško", "Kungota", "Kuzma", "Laško", "Lenart", "Lendava", "Litija", "Ljubljana", "Ljubno", "Ljutomer", "Log–Dragomer", "Logatec", "Loška Dolina", "Loški Potok", "Lovrenc na Pohorju", "Luče", "Lukovica", "Majšperk", "Makole", "Maribor", "Markovci", "Medvode", "Mengeš", "Metlika", "Mežica", "Miklavž na Dravskem Polju", "Miren–Kostanjevica", "Mirna", "Mirna Peč", "Mislinja", "Mokronog–Trebelno", "Moravče", "Moravske Toplice", "Mozirje", "Murska Sobota", "Muta", "Naklo", "Nazarje", "Nova Gorica", "Novo Mesto", "Odranci", "Oplotnica", "Ormož", "Osilnica", "Pesnica", "Piran", "Pivka", "Podčetrtek", "Podlehnik", "Podvelka", "Poljčane", "Polzela", "Postojna", "Prebold", "Preddvor", "Prevalje", "Ptuj", "Puconci", "Rače–Fram", "Radeče", "Radenci", "Radlje ob Dravi", "Radovljica", "Ravne na Koroškem", "Razkrižje", "Rečica ob Savinji", "Renče–Vogrsko", "Ribnica", "Ribnica na Pohorju", "Rogaška Slatina", "Rogašovci", "Rogatec", "Ruše", "Šalovci", "Selnica ob Dravi", "Semič", "Šempeter–Vrtojba", "Šenčur", "Šentilj", "Šentjernej", "Šentjur", "Šentrupert", "Sevnica", "Sežana", "Škocjan", "Škofja Loka", "Škofljica", "Slovenj Gradec", "Slovenska Bistrica", "Slovenske Konjice", "Šmarje pri Jelšah", "Šmarješke Toplice", "Šmartno ob Paki", "Šmartno pri Litiji", "Sodražica", "Solčava", "Šoštanj", "Središče ob Dravi", "Starše", "Štore", "Straža", "Sveta Ana", "Sveta Trojica v Slovenskih Goricah", "Sveti Andraž v Slovenskih Goricah", "Sveti Jurij ob Ščavnici", "Sveti Jurij v Slovenskih Goricah", "Sveti Tomaž", "Tabor", "Tišina", "Tolmin", "Trbovlje", "Trebnje", "Trnovska Vas", "Tržič", "Trzin", "Turnišče", "Velenje", "Velika Polana", "Velike Lašče", "Veržej", "Videm", "Vipava", "Vitanje", "Vodice", "Vojnik", "Vransko", "Vrhnika", "Vuzenica", "Zagorje ob Savi", "Žalec", "Zavrč", "Železniki", "Žetale", "Žiri", "Žirovnica", "Zreče", "Žužemberk"],
  },
  "Solomon Islands": {
    noun: "provinces",
    names: ["Central", "Choiseul", "Guadalcanal", "Honiara", "Isabel", "Makira-Ulawa", "Malaita", "Rennell and Bellona", "Temotu", "Western"],
  },
  "Somalia": {
    noun: "regions",
    names: ["Awdal", "Bakool", "Banaadir", "Bari", "Bay", "Galguduud", "Gedo", "Hiran", "Lower Juba", "Lower Shebelle", "Middle Juba", "Middle Shebelle", "Mudug", "Nugal", "Sanaag", "Sool", "Togdheer", "Woqooyi Galbeed"],
  },
  "South Africa": {
    noun: "provinces",
    names: ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"],
  },
  "South Korea": {
    noun: "provinces",
    names: ["Busan", "Daegu", "Daejeon", "Gangwon", "Gwangju", "Gyeonggi", "Incheon", "Jeju", "North Chungcheong", "North Gyeongsang", "North Jeolla", "Sejong City", "Seoul", "South Chungcheong", "South Gyeongsang", "South Jeolla", "Ulsan"],
  },
  "South Sudan": {
    noun: "states",
    names: ["Central Equatoria", "Eastern Equatoria", "Jonglei State", "Lakes", "Northern Bahr el Ghazal", "Unity", "Upper Nile", "Warrap", "Western Bahr el Ghazal", "Western Equatoria"],
  },
  "Spain": {
    noun: "autonomous communities",
    names: ["Andalusia", "Aragon", "Asturias, Principality of", "Balearic Islands", "Basque Country", "Canary Islands", "Cantabria", "Castile and Leon", "Castilla-La Mancha", "Catalonia", "Ceuta", "Community of Madrid", "Estremadura", "Galicia", "La Rioja", "Melilla", "Navarre", "Region of Murcia", "Valencian Community"],
  },
  "Sri Lanka": {
    noun: "provinces",
    names: ["Central", "Eastern", "North Central", "North Western", "Northern", "Sabaragamuwa", "Southern", "Uva", "Western"],
  },
  "Sudan": {
    noun: "states",
    names: ["Al Jazirah", "Al Qadarif", "Blue Nile", "Central Darfur", "East Darfur", "Kassala", "Khartoum", "North Darfur", "North Kordofan", "Northern", "Red Sea", "River Nile", "Sennar", "South Darfur", "South Kordofan", "West Darfur", "West Kordofan", "White Nile"],
  },
  "Suriname": {
    noun: "districts",
    names: ["Brokopondo", "Commewijne", "Coronie", "Marowijne", "Nickerie", "Para", "Paramaribo", "Saramacca", "Sipaliwini", "Wanica"],
  },
  "Sweden": {
    noun: "counties",
    names: ["Blekinge", "Dalarna", "Gävleborg", "Gotland", "Halland", "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Örebro", "Östergötland", "Skåne", "Södermanland", "Stockholm", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland"],
  },
  "Switzerland": {
    noun: "cantons",
    names: ["Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Land", "Basel-Stadt", "Bern", "Fribourg", "Geneva", "Glarus", "Graubünden", "Jura", "Lucerne", "Neuchâtel", "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau", "Ticino", "Uri", "Valais", "Vaud", "Zug", "Zürich"],
  },
  "Syria": {
    noun: "provinces",
    names: ["Al-Hasakah", "Al-Raqqah", "Aleppo", "As-Suwayda", "Damascus", "Daraa", "Deir ez-Zor", "Hama", "Homs", "Idlib", "Latakia", "Quneitra", "Rif Dimashq", "Tartus"],
  },
  "Taiwan": {
    noun: "counties",
    names: ["Changhua", "Chiayi", "Chiayi County", "Hsinchu", "Hsinchu County", "Hualien", "Kaohsiung", "Keelung", "Kinmen", "Lienchiang", "Miaoli", "Nantou", "New Taipei", "Penghu", "Pingtung", "Taichung", "Tainan", "Taipei", "Taitung", "Taoyuan", "Yilan", "Yunlin"],
  },
  "Tajikistan": {
    noun: "regions",
    names: ["Dushanbe", "Gorno-Badakhshan", "Khatlon", "Nohiyahoi Tobei Jumhurí", "Sughd"],
  },
  "Tanzania": {
    noun: "regions",
    names: ["Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza", "Njombe", "Pemba North", "Pemba South", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Zanzibar North", "Zanzibar South", "Zanzibar West"],
  },
  "Thailand": {
    noun: "provinces",
    names: ["Amnat Charoen", "Ang Thong", "Bangkok", "Bueng Kan", "Buri Ram", "Chachoengsao", "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chon Buri", "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi", "Lampang", "Lamphun", "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham", "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lam Phu", "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Pattaya", "Phangnga", "Phatthalung", "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phra Nakhon Si Ayutthaya", "Phrae", "Phuket", "Prachin Buri", "Prachuap Khiri Khan", "Ranong", "Ratchaburi", "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon", "Samut Songkhram", "Saraburi", "Satun", "Si Sa Ket", "Sing Buri", "Songkhla", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang", "Trat", "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"],
  },
  "Timor-Leste": {
    noun: "municipalities",
    names: ["Aileu", "Ainaro", "Baucau", "Bobonaro", "Cova Lima", "Dili", "Ermera", "Lautém", "Liquiçá", "Manatuto", "Manufahi", "Oecusse", "Viqueque"],
  },
  "Togo": {
    noun: "regions",
    names: ["Centrale", "Kara", "Maritime", "Plateaux", "Savanes"],
  },
  "Tonga": {
    noun: "divisions",
    names: ["Haʻapai", "ʻEua", "Niuas", "Tongatapu", "Vavaʻu"],
  },
  "Trinidad and Tobago": {
    noun: "regions",
    names: ["Arima", "Chaguanas", "Couva-Tabaquite-Talparo", "Diego Martin", "Eastern Tobago", "Penal-Debe", "Point Fortin", "Port of Spain", "Princes Town", "Rio Claro-Mayaro", "San Fernando", "San Juan-Laventille", "Sangre Grande", "Siparia", "Tobago", "Tunapuna-Piarco", "Western Tobago"],
  },
  "Tunisia": {
    noun: "governorates",
    names: ["Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kebili", "Kef", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"],
  },
  "Turkey": {
    noun: "provinces",
    names: ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kırıkkale", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt", "Sinop", "Sivas", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"],
  },
  "Turkmenistan": {
    noun: "regions",
    names: ["Ahal", "Ashgabat", "Balkan", "Daşoguz", "Lebap", "Mary"],
  },
  "Tuvalu": {
    noun: "island councils",
    names: ["Funafuti", "Nanumanga", "Nanumea", "Niutao Island Council", "Nui", "Nukufetau", "Nukulaelae", "Vaitupu"],
  },
  "Uganda": {
    noun: "districts",
    names: ["Abim", "Adjumani", "Agago", "Alebtong", "Amolatar", "Amudat", "Amuria", "Amuru", "Apac", "Arua", "Budaka", "Bududa", "Bugiri", "Bugweri", "Buhweju", "Buikwe", "Bukedea", "Bukomansimbi", "Bukwo", "Bulambuli", "Buliisa", "Bundibugyo", "Bunyangabu", "Bushenyi", "Busia", "Butaleja", "Butambala", "Butebo", "Buvuma", "Buyende", "Dokolo", "Gomba", "Gulu", "Hoima", "Ibanda", "Iganga", "Isingiro", "Jinja", "Kaabong", "Kabale", "Kabarole", "Kaberamaido", "Kagadi", "Kakumiro", "Kalaki", "Kalangala", "Kaliro", "Kalungu", "Kampala", "Kamuli", "Kamwenge", "Kanungu", "Kapchorwa", "Kapelebyong", "Karenga", "Kasanda", "Kasese", "Katakwi", "Kayunga", "Kazo", "Kibaale", "Kiboga", "Kibuku", "Kikuube", "Kiruhura", "Kiryandongo", "Kisoro", "Kitagwenda", "Kitgum", "Koboko", "Kole", "Kotido", "Kumi", "Kwania", "Kween", "Kyankwanzi", "Kyegegwa", "Kyenjojo", "Kyotera", "Lamwo", "Lira", "Luuka", "Luwero", "Lwengo", "Lyantonde", "Madi-Okollo", "Manafwa", "Maracha", "Masaka", "Masindi", "Mayuge", "Mbale", "Mbarara", "Mitooma", "Mityana", "Moroto", "Moyo", "Mpigi", "Mubende", "Mukono", "Nabilatuk", "Nakapiripirit", "Nakaseke", "Nakasongola", "Namayingo", "Namisindwa", "Namutumba", "Napak", "Nebbi", "Ngora", "Ntoroko", "Ntungamo", "Nwoya", "Obongi", "Omoro", "Otuke", "Oyam", "Pader", "Pakwach", "Pallisa", "Rakai", "Rubanda", "Rubirizi", "Rukiga", "Rukungiri", "Rwampara", "Sembabule", "Serere", "Sheema", "Sironko", "Soroti", "Tororo", "Wakiso", "Yumbe", "Zombo"],
  },
  "Ukraine": {
    noun: "regions",
    names: ["Autonomous Republic of Crimea", "Cherkaska", "Chernihivska", "Chernivetska", "Dnipropetrovska", "Donetska", "Ivano-Frankivska", "Kharkivska", "Khersonska", "Khmelnytska", "Kirovohradska", "Kyiv", "Kyivska", "Luhanska", "Lvivska", "Mykolaivska", "Odeska", "Poltavska", "Rivnenska", "Sevastopol", "Sumska", "Ternopilska", "Vinnytska", "Volynska", "Zakarpatska", "Zaporizka", "Zhytomyrska"],
  },
  "United Arab Emirates": {
    noun: "emirates",
    names: ["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain"],
  },
  "United Kingdom": {
    noun: "regions",
    names: ["Aberdeen", "Aberdeenshire", "Angus", "Antrim and Newtownabbey", "Ards and North Down", "Argyll and Bute", "Armagh, Banbridge and Craigavon", "Barking and Dagenham", "Barnet", "Barnsley", "Bath and North East Somerset", "Bedford", "Belfast", "Bexley", "Birmingham", "Blackburn with Darwen", "Blackpool", "Blaenau Gwent", "Bolton", "Bournemouth, Christchurch and Poole", "Bracknell Forest", "Bradford", "Brent", "Bridgend", "Brighton and Hove", "Bristol", "Bromley", "Buckinghamshire", "Bury", "Caerphilly", "Calderdale", "Cambridgeshire", "Camden", "Cardiff", "Carmarthenshire", "Causeway Coast and Glens", "Central Bedfordshire", "Ceredigion", "Cheshire East", "Cheshire West and Chester", "City of Kingston upon Hull", "City of Southampton", "Clackmannanshire", "Conwy", "Cornwall", "Coventry", "Croydon", "Cumbria", "Darlington", "Denbighshire", "Derby", "Derbyshire", "Derry City and Strabane", "Devon", "Doncaster", "Dorset", "Dudley", "Dumfries and Galloway", "Dundee", "Durham", "Ealing", "East Ayrshire", "East Dunbartonshire", "East Lothian", "East Renfrewshire", "East Riding of Yorkshire", "East Sussex", "Edinburgh", "Enfield", "Essex", "Falkirk", "Fermanagh and Omagh", "Fife", "Flintshire", "Gateshead", "Glasgow", "Gloucestershire", "Greenwich", "Gwynedd", "Hackney", "Halton", "Hammersmith and Fulham", "Hampshire", "Haringey", "Harrow", "Hartlepool", "Havering", "Herefordshire", "Hertfordshire", "Highland", "Hillingdon", "Hounslow", "Inverclyde", "Isle of Anglesey", "Isle of Wight", "Isles of Scilly", "Islington", "Kensington and Chelsea", "Kent", "Kingston upon Thames", "Kirklees", "Knowsley", "Lambeth", "Lancashire", "Leeds", "Leicester", "Leicestershire", "Lewisham", "Lincolnshire", "Lisburn and Castlereagh", "Liverpool", "London", "Luton", "Manchester", "Medway", "Merthyr Tydfil", "Merton", "Mid and East Antrim", "Mid Ulster", "Middlesbrough", "Midlothian", "Milton Keynes", "Monmouthshire", "Moray", "Neath Port Talbot", "Newcastle upon Tyne", "Newham", "Newport", "Newry, Mourne and Down", "Norfolk", "North Ayrshire", "North East Lincolnshire", "North Lanarkshire", "North Lincolnshire", "North Northamptonshire", "North Somerset", "North Tyneside", "North Yorkshire", "Northumberland", "Nottingham", "Nottinghamshire", "Oldham", "Orkney Islands", "Outer Hebrides", "Oxfordshire", "Pembrokeshire", "Perth and Kinross", "Peterborough", "Plymouth", "Portsmouth", "Powys", "Reading", "Redbridge", "Redcar and Cleveland", "Renfrewshire", "Rhondda Cynon Taf", "Richmond upon Thames", "Rochdale", "Rotherham", "Rutland", "Salford", "Sandwell", "Scottish Borders", "Sefton", "Sheffield", "Shetland Islands", "Shropshire", "Slough", "Solihull", "Somerset", "South Ayrshire", "South Gloucestershire", "South Lanarkshire", "South Tyneside", "Southend-on-Sea", "Southwark", "St Helens", "Staffordshire", "Stirling", "Stockport", "Stockton-on-Tees", "Stoke-on-Trent", "Suffolk", "Sunderland", "Surrey", "Sutton", "Swansea", "Swindon", "Tameside", "Telford and Wrekin", "Thurrock", "Torbay", "Torfaen", "Tower Hamlets", "Trafford", "Vale of Glamorgan", "Wakefield", "Walsall", "Waltham Forest", "Wandsworth", "Warrington", "Warwickshire", "West Berkshire", "West Dunbartonshire", "West Lothian", "West Northamptonshire", "West Sussex", "Westminster", "Wigan", "Wiltshire", "Windsor and Maidenhead", "Wirral", "Wokingham", "Wolverhampton", "Worcestershire", "Wrexham", "York"],
  },
  "United States": {
    noun: "states",
    names: ["Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "Armed Forces Europe", "Armed Forces of the Americas", "Armed Forces Pacific", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "United States Minor Outlying Islands", "United States Virgin Islands", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
  },
  "Uruguay": {
    noun: "departments",
    names: ["Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"],
  },
  "Uzbekistan": {
    noun: "regions",
    names: ["Andijan", "Bukhara", "Fergana", "Jizzakh", "Karakalpakstan", "Namangan", "Navoiy", "Qashqadaryo", "Samarqand", "Sirdaryo", "Surxondaryo", "Tashkent", "Xorazm"],
  },
  "Vanuatu": {
    noun: "provinces",
    names: ["Malampa", "Penama", "Sanma", "Shefa", "Tafea", "Torba"],
  },
  "Venezuela": {
    noun: "states",
    names: ["Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "La Guaira", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Venezuela", "Yaracuy", "Zulia"],
  },
  "Vietnam": {
    noun: "provinces",
    names: ["An Giang", "Bắc Ninh", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Nội", "Hà Tĩnh", "Hải Phòng", "Hồ Chí Minh", "Hưng Yên", "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên-Huế", "Tuyên Quang", "Vĩnh Long"],
  },
  "Yemen": {
    noun: "governorates",
    names: ["Abyan", "Ad Dali'", "Adan", "Al Bayda'", "Al Hudaydah", "Al Jawf", "Al Mahrah", "Al Mahwit", "Amanat Al Asimah", "Amran", "Dhamar", "Hadhramaut", "Hajjah", "Ibb", "Lahij", "Ma'rib", "Raymah", "Saada", "Sana'a", "Shabwah", "Socotra", "Ta'izz"],
  },
  "Zambia": {
    noun: "provinces",
    names: ["Central", "Copperbelt", "Eastern", "Luapula", "Lusaka", "Muchinga", "Northern", "Northwestern", "Southern", "Western"],
  },
  "Zimbabwe": {
    noun: "provinces",
    names: ["Bulawayo", "Harare", "Manicaland", "Mashonaland Central", "Mashonaland East", "Mashonaland West", "Masvingo", "Matabeleland North", "Matabeleland South", "Midlands"],
  },
};
