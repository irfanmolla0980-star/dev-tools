// TIME ZONE CONVERTER — Part 1
// Navbar + Theme + Database + Elements + Helpers + Clocks

// Navbar toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
}

// Active link
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const linkPath = link.getAttribute('href').split('/').pop();
  if (linkPath === currentPath) link.classList.add('active');
});

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========== COUNTRIES ==========
const COUNTRIES = [
  // === ASIA ===
  {
    name: 'India',
    continent: 'Asia',
    capital: 'New Delhi',
    cities: [
      { name: 'New Delhi', tz: 'Asia/Kolkata', capital: true }
    ]
  },
  {
    name: 'Pakistan',
    continent: 'Asia',
    capital: 'Karachi',
    cities: [
      { name: 'Karachi', tz: 'Asia/Karachi', capital: true }
    ]
  },
  {
    name: 'China',
    continent: 'Asia',
    capital: 'Beijing',
    cities: [
      { name: 'Beijing', tz: 'Asia/Shanghai', capital: true },
      { name: 'Shanghai', tz: 'Asia/Shanghai' },
      { name: 'Guangzhou', tz: 'Asia/Shanghai' },
      { name: 'Shenzhen', tz: 'Asia/Shanghai' },
      { name: 'Hong Kong', tz: 'Asia/Hong_Kong' }
    ]
  },
  {
    name: 'Nepal',
    continent: 'Asia',
    capital: 'Kathmandu',
    cities: [
      { name: 'Kathmandu', tz: 'Asia/Kathmandu', capital: true }
    ]
  },
  {
    name: 'Bangladesh',
    continent: 'Asia',
    capital: 'Dhaka',
    cities: [
      { name: 'Dhaka', tz: 'Asia/Dhaka', capital: true }
    ]
  },
  {
    name: 'Sri Lanka',
    continent: 'Asia',
    capital: 'Colombo',
    cities: [
      { name: 'Colombo', tz: 'Asia/Colombo', capital: true }
    ]
  },
  {
    name: 'United Arab Emirates',
    continent: 'Asia',
    capital: 'Abu Dhabi',
    cities: [
      { name: 'Abu Dhabi', tz: 'Asia/Dubai', capital: true }
    ]
  },
  {
    name: 'Japan',
    continent: 'Asia',
    capital: 'Tokyo',
    cities: [
      { name: 'Tokyo', tz: 'Asia/Tokyo', capital: true }
    ]
  },
  {
    name: 'South Korea',
    continent: 'Asia',
    capital: 'Seoul',
    cities: [
      { name: 'Seoul', tz: 'Asia/Seoul', capital: true }
    ]
  },
  {
    name: 'Singapore',
    continent: 'Asia',
    capital: 'Singapore',
    cities: [
      { name: 'Singapore', tz: 'Asia/Singapore', capital: true }
    ]
  },
  {
    name: 'Malaysia',
    continent: 'Asia',
    capital: 'Kuala Lumpur',
    cities: [
      { name: 'Kuala Lumpur', tz: 'Asia/Kuala_Lumpur', capital: true }
    ]
  },
  {
    name: 'Thailand',
    continent: 'Asia',
    capital: 'Bangkok',
    cities: [
      { name: 'Bangkok', tz: 'Asia/Bangkok', capital: true }
    ]
  },
  {
    name: 'Indonesia',
    continent: 'Asia',
    capital: 'Jakarta',
    cities: [
      { name: 'Jakarta', tz: 'Asia/Jakarta', capital: true },
      { name: 'Bali', tz: 'Asia/Makassar' },
      { name: 'Jayapura', tz: 'Asia/Jayapura' }
    ]
  },
  {
    name: 'Philippines',
    continent: 'Asia',
    capital: 'Manila',
    cities: [
      { name: 'Manila', tz: 'Asia/Manila', capital: true }
    ]
  },
  {
    name: 'Vietnam',
    continent: 'Asia',
    capital: 'Hanoi',
    cities: [
      { name: 'Hanoi', tz: 'Asia/Ho_Chi_Minh', capital: true }
    ]
  },
  {
  name: 'Saudi Arabia',
  continent: 'Asia',
  capital: 'Riyadh',
  cities: [
    { name: 'Riyadh', tz: 'Asia/Riyadh', capital: true }
  ]
  },
  {
    name: 'Turkey',
    continent: 'Asia',
    capital: 'Ankara',
    cities: [
      { name: 'Ankara', tz: 'Europe/Istanbul', capital: true }
    ]
  },
  {
    name: 'Iran',
    continent: 'Asia',
    capital: 'Tehran',
    cities: [
      { name: 'Tehran', tz: 'Asia/Tehran', capital: true }
    ]
  },
  {
    name: 'Iraq',
    continent: 'Asia',
    capital: 'Baghdad',
    cities: [
      { name: 'Baghdad', tz: 'Asia/Baghdad', capital: true }
    ]
  },
  {
    name: 'Kazakhstan',
    continent: 'Asia',
    capital: 'Astana',
    cities: [
      { name: 'Astana', tz: 'Asia/Almaty', capital: true },
      { name: 'Almaty', tz: 'Asia/Almaty' },
      { name: 'Aktobe', tz: 'Asia/Aqtobe' },
      { name: 'Atyrau', tz: 'Asia/Atyrau' }
    ]
  },
  {
  name: 'Maldives',
  continent: 'Asia',
  capital: 'Malé',
  cities: [
    { name: 'Malé', tz: 'Indian/Maldives', capital: true }
  ]
},
  {
    name: 'Myanmar',
    continent: 'Asia',
    capital: 'Naypyidaw',
    cities: [
      { name: 'Naypyidaw', tz: 'Asia/Yangon', capital: true }
    ]
  },
  {
    name: 'Cambodia',
    continent: 'Asia',
    capital: 'Phnom Penh',
    cities: [
      { name: 'Phnom Penh', tz: 'Asia/Phnom_Penh', capital: true }
    ]
  },
  {
    name: 'Taiwan',
    continent: 'Asia',
    capital: 'Taipei',
    cities: [
      { name: 'Taipei', tz: 'Asia/Taipei', capital: true }
    ]
  },
  {
    name: 'Azerbaijan',
    continent: 'Asia',
    capital: 'Baku',
    cities: [
      { name: 'Baku', tz: 'Asia/Baku', capital: true }
    ]
  },
  {
  name: 'Mongolia',
  continent: 'Asia',
  capital: 'Ulaanbaatar',
  cities: [
    { name: 'Ulaanbaatar', tz: 'Asia/Ulaanbaatar', capital: true },
    { name: 'Khovd', tz: 'Asia/Hovd' }
  ]
  },
  {
    name: 'Uzbekistan',
    continent: 'Asia',
    capital: 'Tashkent',
    cities: [
      { name: 'Tashkent', tz: 'Asia/Tashkent', capital: true },
      { name: 'Samarkand', tz: 'Asia/Samarkand' }
    ]
  },
  {
    name: 'Laos',
    continent: 'Asia',
    capital: 'Vientiane',
    cities: [
      { name: 'Vientiane', tz: 'Asia/Vientiane', capital: true }
    ]
  },
  {
    name: 'Macau',
    continent: 'Asia',
    capital: 'Macau',
    cities: [
      { name: 'Macau', tz: 'Asia/Macau', capital: true }
    ]
  },
  {
    name: 'Syria',
    continent: 'Asia',
    capital: 'Damascus',
    cities: [
      { name: 'Damascus', tz: 'Asia/Damascus', capital: true }
    ]
  },
  {
  name: 'Afghanistan',
  continent: 'Asia',
  capital: 'Kabul',
  cities: [
    { name: 'Kabul', tz: 'Asia/Kabul', capital: true }
  ]
  },
  {
    name: 'Bhutan',
    continent: 'Asia',
    capital: 'Thimphu',
    cities: [
      { name: 'Thimphu', tz: 'Asia/Thimphu', capital: true }
    ]
  },
  {
    name: 'Brunei',
    continent: 'Asia',
    capital: 'Bandar Seri Begawan',
    cities: [
      { name: 'Bandar Seri Begawan', tz: 'Asia/Brunei', capital: true }
    ]
  },
  {
    name: 'Jordan',
    continent: 'Asia',
    capital: 'Amman',
    cities: [
      { name: 'Amman', tz: 'Asia/Amman', capital: true }
    ]
  },
  {
    name: 'Lebanon',
    continent: 'Asia',
    capital: 'Beirut',
    cities: [
      { name: 'Beirut', tz: 'Asia/Beirut', capital: true }
    ]
  },
  {
  name: 'Oman',
  continent: 'Asia',
  capital: 'Muscat',
  cities: [
    { name: 'Muscat', tz: 'Asia/Muscat', capital: true }
  ]
  },
  {
    name: 'Yemen',
    continent: 'Asia',
    capital: 'Sanaa',
    cities: [
      { name: 'Sanaa', tz: 'Asia/Aden', capital: true }
    ]
  },
  {
    name: 'Kuwait',
    continent: 'Asia',
    capital: 'Kuwait City',
    cities: [
      { name: 'Kuwait City', tz: 'Asia/Kuwait', capital: true }
    ]
  },
  {
    name: 'Bahrain',
    continent: 'Asia',
    capital: 'Manama',
    cities: [
      { name: 'Manama', tz: 'Asia/Bahrain', capital: true }
    ]
  },
  {
    name: 'Qatar',
    continent: 'Asia',
    capital: 'Doha',
    cities: [
      { name: 'Doha', tz: 'Asia/Qatar', capital: true }
    ]
  },
  {
    name: 'Tajikistan',
    continent: 'Asia',
    capital: 'Dushanbe',
    cities: [
      { name: 'Dushanbe', tz: 'Asia/Dushanbe', capital: true }
    ]
  },
  {
    name: 'Turkmenistan',
    continent: 'Asia',
    capital: 'Ashgabat',
    cities: [
      { name: 'Ashgabat', tz: 'Asia/Ashgabat', capital: true }
    ]
  },
  {
    name: 'Kyrgyzstan',
    continent: 'Asia',
    capital: 'Bishkek',
    cities: [
      { name: 'Bishkek', tz: 'Asia/Bishkek', capital: true }
    ]
  },
  {
    name: 'Armenia',
    continent: 'Asia',
    capital: 'Yerevan',
    cities: [
      { name: 'Yerevan', tz: 'Asia/Yerevan', capital: true }
    ]
  },
  {
    name: 'Georgia',
    continent: 'Asia',
    capital: 'Tbilisi',
    cities: [
      { name: 'Tbilisi', tz: 'Asia/Tbilisi', capital: true }
    ]
  },
  {
    name: 'North Korea',
    continent: 'Asia',
    capital: 'Pyongyang',
    cities: [
      { name: 'Pyongyang', tz: 'Asia/Pyongyang', capital: true }
    ]
  },
  {
    name: 'Timor-Leste',
    continent: 'Asia',
    capital: 'Dili',
    cities: [
      { name: 'Dili', tz: 'Asia/Dili', capital: true }
    ]
  },
  {
    name: 'Palestine',
    continent: 'Asia',
    capital: 'Ramallah',
    cities: [
      { name: 'Ramallah', tz: 'Asia/Hebron', capital: true },
      { name: 'Gaza', tz: 'Asia/Gaza' }
    ]
  },

  // === EUROPE ===
  {
    name: 'United Kingdom',
    continent: 'Europe',
    capital: 'London',
    cities: [
      { name: 'London', tz: 'Europe/London', capital: true }
    ]
  },
  {
    name: 'Germany',
    continent: 'Europe',
    capital: 'Berlin',
    cities: [
      { name: 'Berlin', tz: 'Europe/Berlin', capital: true }
    ]
  },
  {
    name: 'France',
    continent: 'Europe',
    capital: 'Paris',
    cities: [
      { name: 'Paris', tz: 'Europe/Paris', capital: true }
    ]
  },
  {
    name: 'Russia',
    continent: 'Europe',
    capital: 'Moscow',
    cities: [
      { name: 'Kaliningrad', tz: 'Europe/Kaliningrad' },
      { name: 'Moscow', tz: 'Europe/Moscow', capital: true },
      { name: 'Samara', tz: 'Europe/Samara' },
      { name: 'Yekaterinburg', tz: 'Asia/Yekaterinburg' },
      { name: 'Omsk', tz: 'Asia/Omsk' },
      { name: 'Krasnoyarsk', tz: 'Asia/Krasnoyarsk' },
      { name: 'Novosibirsk', tz: 'Asia/Novosibirsk' },
      { name: 'Irkutsk', tz: 'Asia/Irkutsk' },
      { name: 'Yakutsk', tz: 'Asia/Yakutsk' },
      { name: 'Vladivostok', tz: 'Asia/Vladivostok' },
      { name: 'Magadan', tz: 'Asia/Magadan' },
      { name: 'Kamchatka', tz: 'Asia/Kamchatka' }
    ]
  },
  {
    name: 'Italy',
    continent: 'Europe',
    capital: 'Rome',
    cities: [
      { name: 'Rome', tz: 'Europe/Rome', capital: true }
    ]
  },
  {
    name: 'Spain',
    continent: 'Europe',
    capital: 'Madrid',
    cities: [
      { name: 'Madrid', tz: 'Europe/Madrid', capital: true },
      { name: 'Barcelona', tz: 'Europe/Madrid' },
      { name: 'Canary Islands', tz: 'Atlantic/Canary' }
    ]
  },
  {
    name: 'Netherlands',
    continent: 'Europe',
    capital: 'Amsterdam',
    cities: [
      { name: 'Amsterdam', tz: 'Europe/Amsterdam', capital: true }
    ]
  },
  {
    name: 'Switzerland',
    continent: 'Europe',
    capital: 'Zurich',
    cities: [
      { name: 'Zurich', tz: 'Europe/Zurich', capital: true }
    ]
  },
  {
  name: 'Sweden',
  continent: 'Europe',
  capital: 'Stockholm',
  cities: [
    { name: 'Stockholm', tz: 'Europe/Stockholm', capital: true }
  ]
  },
  {
    name: 'Norway',
    continent: 'Europe',
    capital: 'Oslo',
    cities: [
      { name: 'Oslo', tz: 'Europe/Oslo', capital: true },
      { name: 'Bergen', tz: 'Europe/Oslo' },
      { name: 'Longyearbyen', tz: 'Arctic/Longyearbyen' }
    ]
  },
  {
    name: 'Poland',
    continent: 'Europe',
    capital: 'Warsaw',
    cities: [
      { name: 'Warsaw', tz: 'Europe/Warsaw', capital: true }
    ]
  },
  {
    name: 'Ukraine',
    continent: 'Europe',
    capital: 'Kyiv',
    cities: [
      { name: 'Kyiv', tz: 'Europe/Kyiv', capital: true }
    ]
  },
  {
    name: 'Greece',
    continent: 'Europe',
    capital: 'Athens',
    cities: [
      { name: 'Athens', tz: 'Europe/Athens', capital: true }
    ]
  },
  {
  name: 'Ireland',
  continent: 'Europe',
  capital: 'Dublin',
  cities: [
    { name: 'Dublin', tz: 'Europe/Dublin', capital: true }
  ]
  },
  {
    name: 'Portugal',
    continent: 'Europe',
    capital: 'Lisbon',
    cities: [
      { name: 'Lisbon', tz: 'Europe/Lisbon', capital: true },
      { name: 'Porto', tz: 'Europe/Lisbon' },
      { name: 'Azores', tz: 'Atlantic/Azores' }
    ]
  },
  {
    name: 'Belgium',
    continent: 'Europe',
    capital: 'Brussels',
    cities: [
      { name: 'Brussels', tz: 'Europe/Brussels', capital: true }
    ]
  },
  {
    name: 'Austria',
    continent: 'Europe',
    capital: 'Vienna',
    cities: [
      { name: 'Vienna', tz: 'Europe/Vienna', capital: true }
    ]
  },
  {
    name: 'Romania',
    continent: 'Europe',
    capital: 'Bucharest',
    cities: [
      { name: 'Bucharest', tz: 'Europe/Bucharest', capital: true }
    ]
  },
  {
  name: 'Czechia',
  continent: 'Europe',
  capital: 'Prague',
  cities: [
    { name: 'Prague', tz: 'Europe/Prague', capital: true }
  ]
  },
  {
    name: 'Hungary',
    continent: 'Europe',
    capital: 'Budapest',
    cities: [
      { name: 'Budapest', tz: 'Europe/Budapest', capital: true }
    ]
  },
  {
    name: 'Finland',
    continent: 'Europe',
    capital: 'Helsinki',
    cities: [
      { name: 'Helsinki', tz: 'Europe/Helsinki', capital: true }
    ]
  },
  {
    name: 'Denmark',
    continent: 'Europe',
    capital: 'Copenhagen',
    cities: [
      { name: 'Copenhagen', tz: 'Europe/Copenhagen', capital: true },
      { name: 'Faroe Islands', tz: 'Atlantic/Faroe' }
    ]
  },
  {
    name: 'Bulgaria',
    continent: 'Europe',
    capital: 'Sofia',
    cities: [
      { name: 'Sofia', tz: 'Europe/Sofia', capital: true },
      { name: 'Varna', tz: 'Europe/Sofia' }
    ]
  },
  {
  name: 'Belarus',
  continent: 'Europe',
  capital: 'Minsk',
  cities: [
    { name: 'Minsk', tz: 'Europe/Minsk', capital: true }
  ]
  },
  {
    name: 'Slovakia',
    continent: 'Europe',
    capital: 'Bratislava',
    cities: [
      { name: 'Bratislava', tz: 'Europe/Bratislava', capital: true }
    ]
  },
  {
    name: 'Croatia',
    continent: 'Europe',
    capital: 'Zagreb',
    cities: [
      { name: 'Zagreb', tz: 'Europe/Zagreb', capital: true }
    ]
  },
  {
    name: 'Serbia',
    continent: 'Europe',
    capital: 'Belgrade',
    cities: [
      { name: 'Belgrade', tz: 'Europe/Belgrade', capital: true }
    ]
  },
  {
    name: 'Estonia',
    continent: 'Europe',
    capital: 'Tallinn',
    cities: [
      { name: 'Tallinn', tz: 'Europe/Tallinn', capital: true }
    ]
  },
  {
  name: 'Iceland',
  continent: 'Europe',
  capital: 'Reykjavik',
  cities: [
    { name: 'Reykjavik', tz: 'Atlantic/Reykjavik', capital: true }
  ]
  },
  {
    name: 'Latvia',
    continent: 'Europe',
    capital: 'Riga',
    cities: [
      { name: 'Riga', tz: 'Europe/Riga', capital: true }
    ]
  },
  {
    name: 'Lithuania',
    continent: 'Europe',
    capital: 'Vilnius',
    cities: [
      { name: 'Vilnius', tz: 'Europe/Vilnius', capital: true }
    ]
  },
  {
    name: 'Moldova',
    continent: 'Europe',
    capital: 'Chisinau',
    cities: [
      { name: 'Chisinau', tz: 'Europe/Chisinau', capital: true }
    ]
  },
  {
    name: 'Albania',
    continent: 'Europe',
    capital: 'Tirana',
    cities: [
      { name: 'Tirana', tz: 'Europe/Tirane', capital: true }
    ]
  },
  {
  name: 'Slovenia',
  continent: 'Europe',
  capital: 'Ljubljana',
  cities: [
    { name: 'Ljubljana', tz: 'Europe/Ljubljana', capital: true }
  ]
  },
  {
    name: 'Bosnia and Herzegovina',
    continent: 'Europe',
    capital: 'Sarajevo',
    cities: [
      { name: 'Sarajevo', tz: 'Europe/Sarajevo', capital: true }
    ]
  },
  {
    name: 'North Macedonia',
    continent: 'Europe',
    capital: 'Skopje',
    cities: [
      { name: 'Skopje', tz: 'Europe/Skopje', capital: true }
    ]
  },
  {
    name: 'Montenegro',
    continent: 'Europe',
    capital: 'Podgorica',
    cities: [
      { name: 'Podgorica', tz: 'Europe/Podgorica', capital: true }
    ]
  },
  {
    name: 'Luxembourg',
    continent: 'Europe',
    capital: 'Luxembourg City',
    cities: [
      { name: 'Luxembourg City', tz: 'Europe/Luxembourg', capital: true }
    ]
  },
  {
    name: 'Malta',
    continent: 'Europe',
    capital: 'Valletta',
    cities: [
      { name: 'Valletta', tz: 'Europe/Malta', capital: true }
    ]
  },
  {
    name: 'Cyprus',
    continent: 'Europe',
    capital: 'Nicosia',
    cities: [
      { name: 'Nicosia', tz: 'Asia/Nicosia', capital: true },
      { name: 'Limassol', tz: 'Asia/Nicosia' }
    ]
  },
  {
    name: 'Andorra',
    continent: 'Europe',
    capital: 'Andorra la Vella',
    cities: [
      { name: 'Andorra la Vella', tz: 'Europe/Andorra', capital: true }
    ]
  },
  {
    name: 'Monaco',
    continent: 'Europe',
    capital: 'Monaco',
    cities: [
      { name: 'Monaco', tz: 'Europe/Monaco', capital: true }
    ]
  },
  {
    name: 'San Marino',
    continent: 'Europe',
    capital: 'San Marino',
    cities: [
      { name: 'San Marino', tz: 'Europe/San_Marino', capital: true }
    ]
  },
  {
    name: 'Liechtenstein',
    continent: 'Europe',
    capital: 'Vaduz',
    cities: [
      { name: 'Vaduz', tz: 'Europe/Vaduz', capital: true }
    ]
  },

  // === AFRICA ===
  {
    name: 'South Africa',
    continent: 'Africa',
    capital: 'Pretoria',
    cities: [
      { name: 'Pretoria', tz: 'Africa/Johannesburg', capital: true }
    ]
  },
  {
    name: 'Egypt',
    continent: 'Africa',
    capital: 'Cairo',
    cities: [
      { name: 'Cairo', tz: 'Africa/Cairo', capital: true }
    ]
  },
  {
    name: 'Nigeria',
    continent: 'Africa',
    capital: 'Abuja',
    cities: [
      { name: 'Abuja', tz: 'Africa/Lagos', capital: true }
    ]
  },
  {
    name: 'Kenya',
    continent: 'Africa',
    capital: 'Nairobi',
    cities: [
      { name: 'Nairobi', tz: 'Africa/Nairobi', capital: true }
    ]
  },
  {
    name: 'Ethiopia',
    continent: 'Africa',
    capital: 'Addis Ababa',
    cities: [
      { name: 'Addis Ababa', tz: 'Africa/Addis_Ababa', capital: true }
    ]
  },
  {
    name: 'Morocco',
    continent: 'Africa',
    capital: 'Rabat',
    cities: [
      { name: 'Rabat', tz: 'Africa/Casablanca', capital: true }
    ]
  },
  {
  name: 'Algeria',
  continent: 'Africa',
  capital: 'Algiers',
  cities: [
    { name: 'Algiers', tz: 'Africa/Algiers', capital: true }
  ]
  },
  {
    name: 'Tunisia',
    continent: 'Africa',
    capital: 'Tunis',
    cities: [
      { name: 'Tunis', tz: 'Africa/Tunis', capital: true }
    ]
  },
  {
    name: 'Ghana',
    continent: 'Africa',
    capital: 'Accra',
    cities: [
      { name: 'Accra', tz: 'Africa/Accra', capital: true },
      { name: 'Kumasi', tz: 'Africa/Accra' }
    ]
  },
  {
    name: 'Senegal',
    continent: 'Africa',
    capital: 'Dakar',
    cities: [
      { name: 'Dakar', tz: 'Africa/Dakar', capital: true }
    ]
  },
  {
    name: 'Democratic Republic of the Congo',
    continent: 'Africa',
    capital: 'Kinshasa',
    cities: [
      { name: 'Kinshasa', tz: 'Africa/Kinshasa', capital: true },
      { name: 'Lubumbashi', tz: 'Africa/Lubumbashi' }
    ]
  },
  {
  name: 'Angola',
  continent: 'Africa',
  capital: 'Luanda',
  cities: [
    { name: 'Luanda', tz: 'Africa/Luanda', capital: true }
  ]
  },
  {
    name: 'Zambia',
    continent: 'Africa',
    capital: 'Lusaka',
    cities: [
      { name: 'Lusaka', tz: 'Africa/Lusaka', capital: true }
    ]
  },
  {
    name: 'Zimbabwe',
    continent: 'Africa',
    capital: 'Harare',
    cities: [
      { name: 'Harare', tz: 'Africa/Harare', capital: true }
    ]
  },
  {
    name: 'Mozambique',
    continent: 'Africa',
    capital: 'Maputo',
    cities: [
      { name: 'Maputo', tz: 'Africa/Maputo', capital: true }
    ]
  },
  {
    name: 'Madagascar',
    continent: 'Africa',
    capital: 'Antananarivo',
    cities: [
      { name: 'Antananarivo', tz: 'Indian/Antananarivo', capital: true }
    ]
  },
  {
  name: 'Tanzania',
  continent: 'Africa',
  capital: 'Dar es Salaam',
  cities: [
    { name: 'Dar es Salaam', tz: 'Africa/Dar_es_Salaam', capital: true }
  ]
  },
  {
    name: 'Uganda',
    continent: 'Africa',
    capital: 'Kampala',
    cities: [
      { name: 'Kampala', tz: 'Africa/Kampala', capital: true }
    ]
  },
  {
    name: 'Sudan',
    continent: 'Africa',
    capital: 'Khartoum',
    cities: [
      { name: 'Khartoum', tz: 'Africa/Khartoum', capital: true }
    ]
  },
  {
    name: 'Libya',
    continent: 'Africa',
    capital: 'Tripoli',
    cities: [
      { name: 'Tripoli', tz: 'Africa/Tripoli', capital: true }
    ]
  },
  {
    name: 'Somalia',
    continent: 'Africa',
    capital: 'Mogadishu',
    cities: [
      { name: 'Mogadishu', tz: 'Africa/Mogadishu', capital: true }
    ]
  },
  {
  name: 'Rwanda',
  continent: 'Africa',
  capital: 'Kigali',
  cities: [
    { name: 'Kigali', tz: 'Africa/Kigali', capital: true }
  ]
  },
  {
    name: 'Mauritius',
    continent: 'Africa',
    capital: 'Port Louis',
    cities: [
      { name: 'Port Louis', tz: 'Indian/Mauritius', capital: true }
    ]
  },
  {
    name: 'Seychelles',
    continent: 'Africa',
    capital: 'Victoria',
    cities: [
      { name: 'Victoria', tz: 'Indian/Mahe', capital: true }
    ]
  },
  {
    name: 'Namibia',
    continent: 'Africa',
    capital: 'Windhoek',
    cities: [
      { name: 'Windhoek', tz: 'Africa/Windhoek', capital: true }
    ]
  },
  {
    name: 'Botswana',
    continent: 'Africa',
    capital: 'Gaborone',
    cities: [
      { name: 'Gaborone', tz: 'Africa/Gaborone', capital: true }
    ]
  },
  {
  name: 'Mali',
  continent: 'Africa',
  capital: 'Bamako',
  cities: [
    { name: 'Bamako', tz: 'Africa/Bamako', capital: true }
  ]
  },
  {
    name: 'Burkina Faso',
    continent: 'Africa',
    capital: 'Ouagadougou',
    cities: [
      { name: 'Ouagadougou', tz: 'Africa/Ouagadougou', capital: true }
    ]
  },
  {
    name: 'Niger',
    continent: 'Africa',
    capital: 'Niamey',
    cities: [
      { name: 'Niamey', tz: 'Africa/Niamey', capital: true }
    ]
  },
  {
    name: 'Chad',
    continent: 'Africa',
    capital: 'N\'Djamena',
    cities: [
      { name: 'N\'Djamena', tz: 'Africa/Ndjamena', capital: true }
    ]
  },
  {
    name: 'Cameroon',
    continent: 'Africa',
    capital: 'Yaoundé',
    cities: [
      { name: 'Yaoundé', tz: 'Africa/Douala', capital: true }
    ]
  },
  {
  name: 'Ivory Coast',
  continent: 'Africa',
  capital: 'Yamoussoukro',
  cities: [
    { name: 'Yamoussoukro', tz: 'Africa/Abidjan', capital: true }
  ]
  },
  {
    name: 'Guinea',
    continent: 'Africa',
    capital: 'Conakry',
    cities: [
      { name: 'Conakry', tz: 'Africa/Conakry', capital: true }
    ]
  },
  {
    name: 'Benin',
    continent: 'Africa',
    capital: 'Porto-Novo',
    cities: [
      { name: 'Porto-Novo', tz: 'Africa/Porto-Novo', capital: true }
    ]
  },
  {
    name: 'Togo',
    continent: 'Africa',
    capital: 'Lomé',
    cities: [
      { name: 'Lomé', tz: 'Africa/Lome', capital: true }
    ]
  },
  {
    name: 'Malawi',
    continent: 'Africa',
    capital: 'Lilongwe',
    cities: [
      { name: 'Lilongwe', tz: 'Africa/Blantyre', capital: true }
    ]
  },
  {
  name: 'Mauritania',
  continent: 'Africa',
  capital: 'Nouakchott',
  cities: [
    { name: 'Nouakchott', tz: 'Africa/Nouakchott', capital: true }
  ]
  },
  {
    name: 'Gabon',
    continent: 'Africa',
    capital: 'Libreville',
    cities: [
      { name: 'Libreville', tz: 'Africa/Libreville', capital: true }
    ]
  },
  {
    name: 'Republic of the Congo',
    continent: 'Africa',
    capital: 'Brazzaville',
    cities: [
      { name: 'Brazzaville', tz: 'Africa/Brazzaville', capital: true }
    ]
  },
  {
    name: 'Cape Verde',
    continent: 'Africa',
    capital: 'Praia',
    cities: [
      { name: 'Praia', tz: 'Atlantic/Cape_Verde', capital: true }
    ]
  },
  {
    name: 'Sao Tome and Principe',
    continent: 'Africa',
    capital: 'São Tomé',
    cities: [
      { name: 'São Tomé', tz: 'Africa/Sao_Tome', capital: true }
    ]
  },
  {
  name: 'South Sudan',
  continent: 'Africa',
  capital: 'Juba',
  cities: [
    { name: 'Juba', tz: 'Africa/Juba', capital: true }
  ]
  },
  {
    name: 'Eritrea',
    continent: 'Africa',
    capital: 'Asmara',
    cities: [
      { name: 'Asmara', tz: 'Africa/Asmara', capital: true }
    ]
  },
  {
    name: 'Djibouti',
    continent: 'Africa',
    capital: 'Djibouti',
    cities: [
      { name: 'Djibouti', tz: 'Africa/Djibouti', capital: true }
    ]
  },
  {
    name: 'Somaliland',
    continent: 'Africa',
    capital: 'Hargeisa',
    cities: [
      { name: 'Hargeisa', tz: 'Africa/Mogadishu', capital: true }
    ]
  },
  {
    name: 'Lesotho',
    continent: 'Africa',
    capital: 'Maseru',
    cities: [
      { name: 'Maseru', tz: 'Africa/Maseru', capital: true }
    ]
  },
  {
  name: 'Eswatini',
  continent: 'Africa',
  capital: 'Mbabane',
  cities: [
    { name: 'Mbabane', tz: 'Africa/Mbabane', capital: true }
  ]
  },
  {
    name: 'Comoros',
    continent: 'Africa',
    capital: 'Moroni',
    cities: [
      { name: 'Moroni', tz: 'Indian/Comoro', capital: true }
    ]
  },
  {
    name: 'Guinea-Bissau',
    continent: 'Africa',
    capital: 'Bissau',
    cities: [
      { name: 'Bissau', tz: 'Africa/Bissau', capital: true }
    ]
  },
  {
    name: 'Equatorial Guinea',
    continent: 'Africa',
    capital: 'Malabo',
    cities: [
      { name: 'Malabo', tz: 'Africa/Malabo', capital: true }
    ]
  },
  {
    name: 'Liberia',
    continent: 'Africa',
    capital: 'Monrovia',
    cities: [
      { name: 'Monrovia', tz: 'Africa/Monrovia', capital: true }
    ]
  },
  {
    name: 'Sierra Leone',
    continent: 'Africa',
    capital: 'Freetown',
    cities: [
      { name: 'Freetown', tz: 'Africa/Freetown', capital: true }
    ]
  },
  {
    name: 'Gambia',
    continent: 'Africa',
    capital: 'Banjul',
    cities: [
      { name: 'Banjul', tz: 'Africa/Banjul', capital: true }
    ]
  },
  {
    name: 'Central African Republic',
    continent: 'Africa',
    capital: 'Bangui',
    cities: [
      { name: 'Bangui', tz: 'Africa/Bangui', capital: true }
    ]
  },

  // === NORTH AMERICA ===
  {
    name: 'United States',
    continent: 'North America',
    capital: 'Washington D.C.',
    cities: [
      { name: 'Washington D.C.', tz: 'America/New_York', capital: true },
      { name: 'New York', tz: 'America/New_York' },
      { name: 'Chicago', tz: 'America/Chicago' },
      { name: 'Denver', tz: 'America/Denver' },
      { name: 'Los Angeles', tz: 'America/Los_Angeles' }
    ]
  },
  {
    name: 'Canada',
    continent: 'North America',
    capital: 'Ottawa',
    cities: [
      { name: 'Ottawa', tz: 'America/Toronto', capital: true },
      { name: 'Toronto', tz: 'America/Toronto' },
      { name: 'Montreal', tz: 'America/Toronto' },
      { name: 'Vancouver', tz: 'America/Vancouver' },
      { name: 'Calgary', tz: 'America/Edmonton' },
      { name: 'Winnipeg', tz: 'America/Winnipeg' },
      { name: 'Halifax', tz: 'America/Halifax' },
      { name: 'St. John\'s', tz: 'America/St_Johns' }
    ]
  },
  {
    name: 'Mexico',
    continent: 'North America',
    capital: 'Mexico City',
    cities: [
      { name: 'Mexico City', tz: 'America/Mexico_City', capital: true },
      { name: 'Cancun', tz: 'America/Cancun' },
      { name: 'Chihuahua', tz: 'America/Chihuahua' },
      { name: 'Tijuana', tz: 'America/Tijuana' }
    ]
  },
  {
  name: 'Guatemala',
  continent: 'North America',
  capital: 'Guatemala City',
  cities: [
    { name: 'Guatemala City', tz: 'America/Guatemala', capital: true }
  ]
  },
  {
    name: 'Belize',
    continent: 'North America',
    capital: 'Belmopan',
    cities: [
      { name: 'Belmopan', tz: 'America/Belize', capital: true },
      { name: 'Belize City', tz: 'America/Belize' }
    ]
  },
  {
    name: 'Honduras',
    continent: 'North America',
    capital: 'Tegucigalpa',
    cities: [
      { name: 'Tegucigalpa', tz: 'America/Tegucigalpa', capital: true }
    ]
  },
  {
    name: 'El Salvador',
    continent: 'North America',
    capital: 'San Salvador',
    cities: [
      { name: 'San Salvador', tz: 'America/El_Salvador', capital: true }
    ]
  },
  {
    name: 'Nicaragua',
    continent: 'North America',
    capital: 'Managua',
    cities: [
      { name: 'Managua', tz: 'America/Managua', capital: true }
    ]
  },
  {
    name: 'Costa Rica',
    continent: 'North America',
    capital: 'San José',
    cities: [
      { name: 'San José', tz: 'America/Costa_Rica', capital: true }
    ]
  },
  {
    name: 'Panama',
    continent: 'North America',
    capital: 'Panama City',
    cities: [
      { name: 'Panama City', tz: 'America/Panama', capital: true }
    ]
  },
  {
    name: 'Cuba',
    continent: 'North America',
    capital: 'Havana',
    cities: [
      { name: 'Havana', tz: 'America/Havana', capital: true }
    ]
  },
  {
    name: 'Jamaica',
    continent: 'North America',
    capital: 'Kingston',
    cities: [
      { name: 'Kingston', tz: 'America/Jamaica', capital: true }
    ]
  },
  {
    name: 'Haiti',
    continent: 'North America',
    capital: 'Port-au-Prince',
    cities: [
      { name: 'Port-au-Prince', tz: 'America/Port-au-Prince', capital: true }
    ]
  },
  {
    name: 'Dominican Republic',
    continent: 'North America',
    capital: 'Santo Domingo',
    cities: [
      { name: 'Santo Domingo', tz: 'America/Santo_Domingo', capital: true }
    ]
  },
  {
    name: 'Bahamas',
    continent: 'North America',
    capital: 'Nassau',
    cities: [
      { name: 'Nassau', tz: 'America/Nassau', capital: true }
    ]
  },
  {
    name: 'Trinidad and Tobago',
    continent: 'North America',
    capital: 'Port of Spain',
    cities: [
      { name: 'Port of Spain', tz: 'America/Port_of_Spain', capital: true }
    ]
  },
  {
    name: 'Barbados',
    continent: 'North America',
    capital: 'Bridgetown',
    cities: [
      { name: 'Bridgetown', tz: 'America/Barbados', capital: true }
    ]
  },
  {
    name: 'Saint Lucia',
    continent: 'North America',
    capital: 'Castries',
    cities: [
      { name: 'Castries', tz: 'America/St_Lucia', capital: true }
    ]
  },
  {
    name: 'Grenada',
    continent: 'North America',
    capital: 'St. George\'s',
    cities: [
      { name: 'St. George\'s', tz: 'America/Grenada', capital: true }
    ]
  },
  {
    name: 'Antigua and Barbuda',
    continent: 'North America',
    capital: 'St. John\'s',
    cities: [
      { name: 'St. John\'s', tz: 'America/Antigua', capital: true }
    ]
  },
  {
    name: 'Dominica',
    continent: 'North America',
    capital: 'Roseau',
    cities: [
      { name: 'Roseau', tz: 'America/Dominica', capital: true }
    ]
  },
  {
    name: 'Saint Vincent and the Grenadines',
    continent: 'North America',
    capital: 'Kingstown',
    cities: [
      { name: 'Kingstown', tz: 'America/St_Vincent', capital: true }
    ]
  },
  {
    name: 'Saint Kitts and Nevis',
    continent: 'North America',
    capital: 'Basseterre',
    cities: [
      { name: 'Basseterre', tz: 'America/St_Kitts', capital: true }
    ]
  },

  // === SOUTH AMERICA ===
  {
    name: 'Brazil',
    continent: 'South America',
    capital: 'Brasília',
    cities: [
      { name: 'Brasília', tz: 'America/Sao_Paulo', capital: true },
      { name: 'São Paulo', tz: 'America/Sao_Paulo' },
      { name: 'Rio de Janeiro', tz: 'America/Sao_Paulo' },
      { name: 'Manaus', tz: 'America/Manaus' },
      { name: 'Fernando de Noronha', tz: 'America/Noronha' }
    ]
  },
  {
    name: 'Argentina',
    continent: 'South America',
    capital: 'Buenos Aires',
    cities: [
      { name: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires', capital: true },
      { name: 'Cordoba', tz: 'America/Argentina/Cordoba' },
      { name: 'Mendoza', tz: 'America/Argentina/Mendoza' },
      { name: 'Salta', tz: 'America/Argentina/Salta' }
    ]
  },
  {
    name: 'Chile',
    continent: 'South America',
    capital: 'Santiago',
    cities: [
      { name: 'Santiago', tz: 'America/Santiago', capital: true },
      { name: 'Punta Arenas', tz: 'America/Punta_Arenas' },
      { name: 'Easter Island', tz: 'Pacific/Easter' }
    ]
  },
  {
    name: 'Ecuador',
    continent: 'South America',
    capital: 'Quito',
    cities: [
      { name: 'Quito', tz: 'America/Guayaquil', capital: true },
      { name: 'Guayaquil', tz: 'America/Guayaquil' },
      { name: 'Galapagos Islands', tz: 'Pacific/Galapagos' }
    ]
  },
  {
    name: 'Peru',
    continent: 'South America',
    capital: 'Lima',
    cities: [
      { name: 'Lima', tz: 'America/Lima', capital: true }
    ]
  },
  {
  name: 'Colombia',
  continent: 'South America',
  capital: 'Bogotá',
  cities: [
    { name: 'Bogotá', tz: 'America/Bogota', capital: true }
  ]
  },
  {
    name: 'Venezuela',
    continent: 'South America',
    capital: 'Caracas',
    cities: [
      { name: 'Caracas', tz: 'America/Caracas', capital: true }
    ]
  },
  {
    name: 'Guyana',
    continent: 'South America',
    capital: 'Georgetown',
    cities: [
      { name: 'Georgetown', tz: 'America/Guyana', capital: true }
    ]
  },
  {
    name: 'Suriname',
    continent: 'South America',
    capital: 'Paramaribo',
    cities: [
      { name: 'Paramaribo', tz: 'America/Paramaribo', capital: true }
    ]
  },
  {
    name: 'Uruguay',
    continent: 'South America',
    capital: 'Montevideo',
    cities: [
      { name: 'Montevideo', tz: 'America/Montevideo', capital: true }
    ]
  },
  {
    name: 'Paraguay',
    continent: 'South America',
    capital: 'Asunción',
    cities: [
      { name: 'Asunción', tz: 'America/Asuncion', capital: true }
    ]
  },
  {
    name: 'Bolivia',
    continent: 'South America',
    capital: 'La Paz',
    cities: [
      { name: 'La Paz', tz: 'America/La_Paz', capital: true }
    ]
  },

  // === OCEANIA ===
  {
    name: 'Australia',
    continent: 'Oceania',
    capital: 'Canberra',
    cities: [
      { name: 'Sydney', tz: 'Australia/Sydney' },
      { name: 'Melbourne', tz: 'Australia/Melbourne' },
      { name: 'Brisbane', tz: 'Australia/Brisbane' },
      { name: 'Perth', tz: 'Australia/Perth' },
      { name: 'Adelaide', tz: 'Australia/Adelaide' },
      { name: 'Canberra', tz: 'Australia/Sydney', capital: true }
    ]
  },
  {
    name: 'New Zealand',
    continent: 'Oceania',
    capital: 'Auckland',
    cities: [
      { name: 'Auckland', tz: 'Pacific/Auckland', capital: true }
    ]
  },
  {
  name: 'Fiji',
  continent: 'Oceania',
  capital: 'Suva',
  cities: [
    { name: 'Suva', tz: 'Pacific/Fiji', capital: true }
  ]
  },
  {
    name: 'Papua New Guinea',
    continent: 'Oceania',
    capital: 'Port Moresby',
    cities: [
      { name: 'Port Moresby', tz: 'Pacific/Port_Moresby', capital: true }
    ]
  },
  {
    name: 'Solomon Islands',
    continent: 'Oceania',
    capital: 'Honiara',
    cities: [
      { name: 'Honiara', tz: 'Pacific/Guadalcanal', capital: true }
    ]
  },
  {
    name: 'Vanuatu',
    continent: 'Oceania',
    capital: 'Port Vila',
    cities: [
      { name: 'Port Vila', tz: 'Pacific/Efate', capital: true }
    ]
  },
  {
    name: 'Samoa',
    continent: 'Oceania',
    capital: 'Apia',
    cities: [
      { name: 'Apia', tz: 'Pacific/Apia', capital: true }
    ]
  },
  {
    name: 'Tonga',
    continent: 'Oceania',
    capital: 'Nuku\'alofa',
    cities: [
      { name: 'Nuku\'alofa', tz: 'Pacific/Tongatapu', capital: true }
    ]
  },
  {
  name: 'Kiribati',
  continent: 'Oceania',
  capital: 'Tarawa',
  cities: [
    { name: 'Tarawa', tz: 'Pacific/Tarawa', capital: true },
    { name: 'Kiritimati', tz: 'Pacific/Kiritimati' }
  ]
  },
  {
    name: 'Micronesia',
    continent: 'Oceania',
    capital: 'Palikir',
    cities: [
      { name: 'Palikir', tz: 'Pacific/Pohnpei', capital: true }
    ]
  },
  {
    name: 'Marshall Islands',
    continent: 'Oceania',
    capital: 'Majuro',
    cities: [
      { name: 'Majuro', tz: 'Pacific/Majuro', capital: true }
    ]
  },
  {
    name: 'Palau',
    continent: 'Oceania',
    capital: 'Ngerulmud',
    cities: [
      { name: 'Ngerulmud', tz: 'Pacific/Palau', capital: true }
    ]
  },
  {
    name: 'Nauru',
    continent: 'Oceania',
    capital: 'Yaren',
    cities: [
      { name: 'Yaren', tz: 'Pacific/Nauru', capital: true }
    ]
  },
  {
    name: 'Tuvalu',
    continent: 'Oceania',
    capital: 'Funafuti',
    cities: [
      { name: 'Funafuti', tz: 'Pacific/Funafuti', capital: true }
    ]
  },
];

// Elements
const liveClockTime = document.getElementById('liveClockTime');
const liveClockDate = document.getElementById('liveClockDate');
const liveClockZone = document.getElementById('liveClockZone');
const utcTime = document.getElementById('utcTime');
const utcDate = document.getElementById('utcDate');
const utcCopyBtn = document.getElementById('utcCopyBtn');

const zoneSearch = document.getElementById('zoneSearch');
const searchClearBtn = document.getElementById('searchClearBtn');
const zonesCount = document.getElementById('zonesCount');

const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const nowBtn = document.getElementById('nowBtn');

const fromDisplay = document.getElementById('fromDisplay');
const toDisplay = document.getElementById('toDisplay');
const fromSearch = document.getElementById('fromSearch');
const toSearch = document.getElementById('toSearch');
const fromList = document.getElementById('fromList');
const toList = document.getElementById('toList');
const fromPicker = document.getElementById('fromPicker');
const toPicker = document.getElementById('toPicker');
const isoBtn = document.getElementById('isoBtn');
const swapBtn = document.getElementById('swapBtn');
const mainValue = document.getElementById('mainValue');
const mainCopyBtn = document.getElementById('mainCopyBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const shareBtn = document.getElementById('shareBtn');

const timeDiff = document.getElementById('timeDiff');

const formatBtns = document.querySelectorAll('.format-btn');
const quickZones = document.querySelectorAll('.quick-zone');

const allZonesList = document.getElementById('allZonesList');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

// State
let fromZoneValue = 'Asia/Kolkata';
let toZoneValue = 'America/New_York';
let currentSearchTerm = '';
let currentFormat = '12';
const expandedCountries = new Set();

// Flat list for converter dropdowns
const ALL_ZONES = [];
COUNTRIES.forEach(c => {
  const uniqueZones = new Set(c.cities.map(city => city.tz));

  // If all cities share the same time zone → only capital
  if (uniqueZones.size === 1) {
    const capital = c.cities.find(city => city.capital) || c.cities[0];
    ALL_ZONES.push({
      value: capital.tz,
      label: `${c.name} (${capital.name})`
    });
  } else {
    // Otherwise show each city with its own zone
    c.cities.forEach(city => {
      ALL_ZONES.push({
        value: city.tz,
        label: `${city.name} (${c.name})${city.capital ? ' ★' : ''}`
      });
    });
  }
});
ALL_ZONES.unshift({ value: 'UTC', label: 'UTC — Universal Time' });
// ===== Helpers =====
function formatTime(date, tz, use12 = currentFormat === '12') {
  const opts = {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12
  };
  return new Intl.DateTimeFormat('en-US', opts).format(date);
}

function formatDateOnly(date, tz) {
  const opts = {
    timeZone: tz,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  return new Intl.DateTimeFormat('en-US', opts).format(date);
}

function formatDateTime(date, tz, use12 = currentFormat === '12') {
  const opts = {
    timeZone: tz,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12
  };
  return new Intl.DateTimeFormat('en-US', opts).format(date);
}

function getOffset(tz, date) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const parts = dtf.formatToParts(date);
  const v = {};
  parts.forEach(p => v[p.type] = p.value);
  const asUTC = Date.UTC(
    parseInt(v.year), parseInt(v.month) - 1, parseInt(v.day),
    parseInt(v.hour === '24' ? '0' : v.hour), parseInt(v.minute), parseInt(v.second)
  );
  return (asUTC - date.getTime()) / 60000;
}

function formatOffset(off) {
  const h = Math.floor(Math.abs(off) / 60);
  const m = Math.abs(off) % 60;
  return `UTC${off >= 0 ? '+' : '-'}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
}

function getAbbr(tz, date) {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' });
    const parts = dtf.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  } catch (e) { return ''; }
}

function isDST(tz, date) {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const janOff = getOffset(tz, jan);
  const julOff = getOffset(tz, jul);
  if (janOff === julOff) return false;
  const thisOff = getOffset(tz, date);
  const stdOff = Math.max(janOff, julOff) === julOff ? julOff : janOff;
  return thisOff < stdOff;
}

// Live clock + UTC (every second)
function updateClocks() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  const use12 = currentFormat === '12';
  if (use12) {
    let h = now.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    liveClockTime.textContent = `${h}:${mm}:${ss} ${ampm}`;
  } else {
    liveClockTime.textContent = `${hh}:${mm}:${ss}`;
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  liveClockDate.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  liveClockZone.textContent = localZone;

  utcTime.textContent = now.toISOString().substring(11, 19) + ' UTC';
  const yyyy = now.getUTCFullYear();
  const mo = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  utcDate.textContent = `${yyyy}-${mo}-${dd}`;
}
updateClocks();
setInterval(updateClocks, 1000);

// Init date/time
function initDateTime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  timeInput.value = `${hh}:${min}`;
}
initDateTime();

// Build dropdown list
function buildZoneList(filter, container) {
  const filtered = ALL_ZONES.filter(z => z.label.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    container.innerHTML = '<div class="zone-option empty">No zones found</div>';
    return;
  }

  let html = '';
  filtered.forEach(zone => {
    const isSelected = (container === fromList && zone.value === fromZoneValue) ||
                       (container === toList && zone.value === toZoneValue);
    html += `<div class="zone-option ${isSelected ? 'selected' : ''}" data-value="${zone.value}">${zone.label}</div>`;
  });
  container.innerHTML = html;

  container.querySelectorAll('.zone-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const value = opt.dataset.value;
      if (container === fromList) {
        fromZoneValue = value;
        updateDisplay(fromDisplay, value);
        fromPicker.classList.remove('open');
        fromSearch.value = '';
        buildZoneList('', fromList);
      } else {
        toZoneValue = value;
        updateDisplay(toDisplay, value);
        toPicker.classList.remove('open');
        toSearch.value = '';
        buildZoneList('', toList);
      }
      updateConversion();
    });
  });
}

function updateDisplay(el, value) {
  const zone = ALL_ZONES.find(z => z.value === value);
  if (zone) el.querySelector('.zone-picker-text').textContent = zone.label;
}

updateDisplay(fromDisplay, fromZoneValue);
updateDisplay(toDisplay, toZoneValue);
buildZoneList('', fromList);
buildZoneList('', toList);

fromDisplay.addEventListener('click', (e) => {
  e.stopPropagation();
  fromPicker.classList.toggle('open');
  toPicker.classList.remove('open');
  if (fromPicker.classList.contains('open')) setTimeout(() => fromSearch.focus(), 100);
});
toDisplay.addEventListener('click', (e) => {
  e.stopPropagation();
  toPicker.classList.toggle('open');
  fromPicker.classList.remove('open');
  if (toPicker.classList.contains('open')) setTimeout(() => toSearch.focus(), 100);
});
document.addEventListener('click', (e) => {
  if (!fromPicker.contains(e.target)) fromPicker.classList.remove('open');
  if (!toPicker.contains(e.target)) toPicker.classList.remove('open');
});
fromList.addEventListener('click', (e) => e.stopPropagation());
toList.addEventListener('click', (e) => e.stopPropagation());
fromSearch.addEventListener('click', (e) => e.stopPropagation());
toSearch.addEventListener('click', (e) => e.stopPropagation());
fromSearch.addEventListener('input', () => buildZoneList(fromSearch.value, fromList));
toSearch.addEventListener('input', () => buildZoneList(toSearch.value, toList));

// Convert
function convertTime(date, time, fromZone, toZone) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const localDate = new Date(y, m - 1, d, hh, mm);
  const fromOff = getOffset(fromZone, localDate);
  const toOff = getOffset(toZone, localDate);
  const diff = toOff - fromOff;
  return new Date(localDate.getTime() + diff * 60000);
}

// Update main conversion
function updateConversion() {
  const date = dateInput.value;
  const time = timeInput.value;
  if (!date || !time) return;

  const converted = convertTime(date, time, fromZoneValue, toZoneValue);
  mainValue.textContent = formatDateTime(converted, toZoneValue);

  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const localDate = new Date(y, m - 1, d, hh, mm);
  const fromOff = getOffset(fromZoneValue, localDate);
  const toOff = getOffset(toZoneValue, localDate);
  const diffMin = toOff - fromOff;
  const diffH = Math.floor(Math.abs(diffMin) / 60);
  const diffM = Math.abs(diffMin) % 60;
  const sign = diffMin >= 0 ? '+' : '-';

  timeDiff.textContent = `${sign}${diffH}h ${diffM}m`;
  timeDiff.className = 'time-diff ' + (diffMin >= 0 ? 'positive' : 'negative');

  renderAllZones(date, time, fromZoneValue);
  buildDetails(date, time, fromZoneValue, toZoneValue, converted);
}

// URL SHARE LOGIC

// Function to read URL parameters on load
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  
  const from = params.get('from');
  const to = params.get('to');
  const date = params.get('date');
  const time = params.get('time');

  if (from) {
    fromZoneValue = from;
    updateDisplay(fromDisplay, from);
  }
  if (to) {
    toZoneValue = to;
    updateDisplay(toDisplay, to);
  }
  if (date) dateInput.value = date;
  if (time) timeInput.value = time;

  // If at least one valid setting is found, update the conversion
  if (from || to || date || time) {
    buildZoneList('', fromList);
    buildZoneList('', toList);
    updateConversion();
  }
}

// Call on load (after initial setup)
loadFromURL();

// Share button click
if (shareBtn) {
  shareBtn.addEventListener('click', () => {
    // Build URL based on current state
    const baseUrl = window.location.href.split('?')[0];
    const params = new URLSearchParams({
      from: fromZoneValue,
      to: toZoneValue,
      date: dateInput.value,
      time: timeInput.value
    });
    
    const shareUrl = `${baseUrl}?${params.toString()}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      const original = shareBtn.textContent;
      shareBtn.textContent = '✓ Link Copied!';
      shareBtn.classList.add('copied');
      
      setTimeout(() => {
        shareBtn.textContent = original;
        shareBtn.classList.remove('copied');
      }, 2000);
    });
  });
}

// ISO 8601 COPY LOGIC

if (isoBtn) {
  isoBtn.addEventListener('click', () => {
    const date = dateInput.value;
    const time = timeInput.value;
    if (!date || !time) return;

    // Convert local input to the target zone
    const converted = convertTime(date, time, fromZoneValue, toZoneValue);
    
    // Get ISO string (e.g., "2026-10-15T14:30:00.000Z")
    // We use the converted time but keep the UTC representation of the target zone's moment.
    const isoString = converted.toISOString();
    
    navigator.clipboard.writeText(isoString).then(() => {
      const original = isoBtn.textContent;
      isoBtn.textContent = '✓ ISO Copied!';
      isoBtn.classList.add('copied');
      
      setTimeout(() => {
        isoBtn.textContent = original;
        isoBtn.classList.remove('copied');
      }, 2000);
    });
  });
}

// ===== Update all country/city times (every 30 seconds) =====
function tickAllZones() {
  if (!dateInput.value || !timeInput.value) return;
  const date = dateInput.value;
  const time = timeInput.value;

  document.querySelectorAll('.country-block').forEach(block => {
    const row = block.querySelector('.country-row');
    if (!row) return;
    const countryName = row.dataset.country;
    const country = COUNTRIES.find(c => c.name === countryName);
    if (!country) return;

    const capital = country.cities.find(c => c.capital) || country.cities[0];
    const capConv = convertTime(date, time, fromZoneValue, capital.tz);
    const capClock = block.querySelector('.country-clock');
    const capDateEl = block.querySelector('.country-date');
    if (capClock) capClock.textContent = formatTime(capConv, capital.tz);
    if (capDateEl) capDateEl.textContent = formatDateOnly(capConv, capital.tz);

    block.querySelectorAll('.city-row').forEach(crow => {
      const tz = crow.dataset.zone;
      const city = country.cities.find(c => c.tz === tz);
      if (!city) return;
      const conv = convertTime(date, time, fromZoneValue, city.tz);
      const cClock = crow.querySelector('.city-clock');
      const cDate = crow.querySelector('.city-date');
      if (cClock) cClock.textContent = formatTime(conv, city.tz);
      if (cDate) cDate.textContent = formatDateOnly(conv, city.tz);
    });
  });
}

setInterval(tickAllZones, 30000);

// Render all zones
function renderAllZones(date, time, fromZone) {
  const search = currentSearchTerm.toLowerCase();

  const filtered = COUNTRIES.filter(c => {
    if (!search) return true;
    if (c.name.toLowerCase().includes(search)) return true;
    return c.cities.some(city => city.name.toLowerCase().includes(search));
  });

  const totalCities = filtered.reduce((sum, c) => sum + c.cities.length, 0);
  zonesCount.textContent = `${filtered.length} countries · ${totalCities} cities`;

  if (filtered.length === 0) {
    allZonesList.innerHTML = '<p class="output-placeholder">No zones match your search.</p>';
    return;
  }

    let html = '';
    let lastContinent = '';
    let continentCount = 0; 

    const continentTotals = {};
    COUNTRIES.forEach(c => {
      const cont = c.continent || 'Other';
      continentTotals[cont] = (continentTotals[cont] || 0) + 1;
    });

    filtered.forEach(country => {
    const continent = country.continent || 'Other';

    // Add heading when continent changes
    if (continent !== lastContinent) {
      const total = continentTotals[continent] || 0;
      html += `<div class="continent-heading">🌍 ${continent} <span class="continent-count">(${total})</span></div>`;
      lastContinent = continent;
    }

  const isExpanded = expandedCountries.has(country.name) || search.length > 0;
    const capital = country.cities.find(c => c.capital) || country.cities[0];

    const capConverted = convertTime(date, time, fromZone, capital.tz);
    const capTime = formatTime(capConverted, capital.tz);
    const capDate = formatDateOnly(capConverted, capital.tz);
    const capOff = getOffset(capital.tz, capConverted);
    const capOffStr = formatOffset(capOff);
    const capAbbr = getAbbr(capital.tz, capConverted);
    const capDST = isDST(capital.tz, capConverted);

    html += `
      <div class="country-block">
        <div class="country-row ${isExpanded ? 'expanded' : ''}" data-country="${country.name}">
          <span class="country-arrow">${isExpanded ? '▼' : '▶'}</span>
          <div class="country-info">
            <span class="country-name">${country.name} <span class="country-capital">(${country.capital})</span></span>
            <span class="country-meta">
              <span>${capOffStr}</span>
              <span>${capAbbr}</span>
              ${capDST ? '<span class="dst-badge">DST</span>' : ''}
            </span>
          </div>
          <div class="country-time">
            <span class="country-clock">${capTime}</span>
            <span class="country-date">${capDate}</span>
          </div>
        </div>
        <div class="city-list" ${isExpanded ? '' : 'style="display:none"'}>
  ${(() => {
    const uniqueZones = new Set(country.cities.map(c => c.tz));
    if (uniqueZones.size === 1) {
      return `<div class="same-zone-note">🌐 All cities in ${country.name} share the same time zone.</div>`;
    }
    return country.cities.map(city => {
      const conv = convertTime(date, time, fromZone, city.tz);
      const t = formatTime(conv, city.tz);
      const d = formatDateOnly(conv, city.tz);
      const off = getOffset(city.tz, conv);
      const offStr = formatOffset(off);
      const abbr = getAbbr(city.tz, conv);
      const dst = isDST(city.tz, conv);
      const isFrom = city.tz === fromZone;
      return `
        <div class="city-row ${isFrom ? 'highlight' : ''}" data-zone="${city.tz}">
          <div class="city-info">
            <span class="city-name">${city.name}${city.capital ? ' ★' : ''}</span>
            <span class="city-meta">
              <span>${offStr}</span>
              <span>${abbr}</span>
              ${dst ? '<span class="dst-badge">DST</span>' : ''}
            </span>
          </div>
          <div class="city-time">
            <span class="city-clock">${t}</span>
            <span class="city-date">${d}</span>
          </div>
        </div>
      `;
    }).join('');
  })()}
</div>
      </div>
    `;
  });

  allZonesList.innerHTML = html;

  // Country click
  allZonesList.querySelectorAll('.country-row').forEach(row => {
    row.addEventListener('click', () => {
      const name = row.dataset.country;
      if (expandedCountries.has(name)) expandedCountries.delete(name);
      else expandedCountries.add(name);
      renderAllZones(dateInput.value, timeInput.value, fromZoneValue);
    });
  });

  // City click → copy
  allZonesList.querySelectorAll('.city-row').forEach(row => {
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      const zone = row.dataset.zone;
      const conv = convertTime(dateInput.value, timeInput.value, fromZoneValue, zone);
      const text = formatDateTime(conv, zone);
      navigator.clipboard.writeText(text).then(() => {
        const original = row.querySelector('.city-clock').textContent;
        row.querySelector('.city-clock').textContent = '✓';
        setTimeout(() => { row.querySelector('.city-clock').textContent = original; }, 800);
      });
    });
  });
}

// Search
zoneSearch.addEventListener('input', () => {
  currentSearchTerm = zoneSearch.value.trim();
  if (currentSearchTerm.length > 0) searchClearBtn.classList.add('show');
  else searchClearBtn.classList.remove('show');

  if (dateInput.value && timeInput.value) {
    renderAllZones(dateInput.value, timeInput.value, fromZoneValue);
  }
});

searchClearBtn.addEventListener('click', () => {
  zoneSearch.value = '';
  currentSearchTerm = '';
  searchClearBtn.classList.remove('show');
  zoneSearch.focus();
  if (dateInput.value && timeInput.value) {
    renderAllZones(dateInput.value, timeInput.value, fromZoneValue);
  }
});

// Date/time change
dateInput.addEventListener('change', updateConversion);
timeInput.addEventListener('change', updateConversion);

// Now
nowBtn.addEventListener('click', () => {
  initDateTime();
  updateConversion();
});

// Format toggle
formatBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    formatBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFormat = btn.dataset.format;
    updateClocks();
    updateConversion();
  });
});

// Swap
swapBtn.addEventListener('click', () => {
  const temp = fromZoneValue;
  fromZoneValue = toZoneValue;
  toZoneValue = temp;
  updateDisplay(fromDisplay, fromZoneValue);
  updateDisplay(toDisplay, toZoneValue);
  updateConversion();
});

// Quick zones
quickZones.forEach(btn => {
  btn.addEventListener('click', () => {
    const zone = btn.dataset.zone;
    toZoneValue = zone;
    updateDisplay(toDisplay, toZoneValue);
    quickZones.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateConversion();
  });
});

// MEETING PLANNER (Dynamic + localStorage)

const MEETING_DEFAULTS = ['America/New_York', 'Europe/London', 'Asia/Dubai', 'Asia/Tokyo'];

// Load from localStorage or use defaults
let meetingZones = JSON.parse(localStorage.getItem('devtools_meeting_zones')) || MEETING_DEFAULTS;

const meetingGrid = document.getElementById('meetingGrid');
const meetingSlider = document.getElementById('meetingSlider');
const meetingSliderTime = document.getElementById('meetingSliderTime');

function renderMeetingPlanner() {
  if (!meetingGrid) return;

  const minutes = parseInt(meetingSlider.value);
  const now = new Date();
  const baseLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, minutes, 0);

  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  meetingSliderTime.textContent = `${hh}:${mm}`;

  let html = '';
  meetingZones.forEach((tz, i) => {
    // Get short label (e.g. "New York")
    const zoneObj = ALL_ZONES.find(z => z.value === tz) || { label: tz };
    const shortName = zoneObj.label.split(' (')[0];

    const localOff = getOffset(Intl.DateTimeFormat().resolvedOptions().timeZone, baseLocal);
    const targetOff = getOffset(tz, baseLocal);
    const diffMin = targetOff - localOff;
    const targetDate = new Date(baseLocal.getTime() + diffMin * 60000);

    const time = formatTime(targetDate, tz);
    const date = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, weekday: 'short', day: '2-digit', month: 'short'
    }).format(targetDate);

    const hour = parseInt(new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: '2-digit', hour12: false
    }).format(targetDate));

    const isWork = hour >= 9 && hour < 18;
    const statusClass = isWork ? 'work' : 'off';
    const statusText = isWork ? 'Work' : 'Off';

    html += `
      <div class="meeting-card">
        <!-- Custom Dropdown UI -->
        <div class="custom-dropdown" data-index="${i}">
          <div class="cd-trigger">${shortName} <span class="cd-arrow">▼</span></div>
          <div class="cd-menu">
            <input type="text" class="cd-search" placeholder="Search..." autocomplete="off" />
            <div class="cd-list">
              ${ALL_ZONES.map(z => `
                <div class="cd-option ${z.value === tz ? 'active' : ''}" data-value="${z.value}">${z.label}</div>
              `).join('')}
            </div>
          </div>
        </div>
        <span class="meeting-card-time">${time}</span>
        <span class="meeting-card-date">${date}</span>
        <span class="meeting-card-status ${statusClass}">${statusText}</span>
      </div>
    `;
  });

  meetingGrid.innerHTML = html;

  // Add interaction logic for the custom dropdowns
  document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.cd-trigger');
    const menu = dropdown.querySelector('.cd-menu');
    const search = dropdown.querySelector('.cd-search');
    const list = dropdown.querySelector('.cd-list');
    const options = dropdown.querySelectorAll('.cd-option');
    const index = parseInt(dropdown.dataset.index);

    // Open/Close menu
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close all other menus
      document.querySelectorAll('.cd-menu').forEach(m => {
        if (m !== menu) m.classList.remove('open');
      });
      menu.classList.toggle('open');
      if (menu.classList.contains('open')) {
        search.value = ''; // Reset search
        options.forEach(opt => opt.style.display = 'flex');
        setTimeout(() => search.focus(), 50);
      }
    });

    // Search inside dropdown (Live update)
    search.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      
      // Loop through all options
      Array.from(options).forEach(opt => {
        const text = opt.textContent.toLowerCase();
        
        // If search is empty OR text matches
        if (term === '' || text.includes(term)) {
          opt.style.setProperty('display', 'flex', 'important');
        } else {
          opt.style.setProperty('display', 'none', 'important');
        }
      });
    });

    // Select option
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing immediately
        const newTz = opt.dataset.value;
        meetingZones[index] = newTz;
        localStorage.setItem('devtools_meeting_zones', JSON.stringify(meetingZones));
        menu.classList.remove('open');
        renderMeetingPlanner(); // Re-render to show new time
      });
    });

    // Important: Stop clicks inside the menu from closing it
    menu.addEventListener('click', (e) => {
      e.stopPropagation(); 
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
       document.querySelectorAll('.cd-menu').forEach(m => m.classList.remove('open'));
    }
  });
}



if (meetingSlider) {
  const now = new Date();
  meetingSlider.value = now.getHours() * 60 + now.getMinutes();
  meetingSlider.addEventListener('input', renderMeetingPlanner);
  
  // Initial render
  renderMeetingPlanner();
  
  // Live update every 30 seconds
  setInterval(renderMeetingPlanner, 30000);
}

// TIMESTAMP MINI CONVERTER

const tsCurrent = document.getElementById('tsCurrent');
const tsInput = document.getElementById('tsInput');
const tsDate = document.getElementById('tsDate');

// Update current timestamp every second
function updateTsCurrent() {
  if (!tsCurrent) return;
  tsCurrent.textContent = Math.floor(Date.now() / 1000);
}
updateTsCurrent();
setInterval(updateTsCurrent, 1000);

// Copy current timestamp on click
if (tsCurrent) {
  tsCurrent.addEventListener('click', () => {
    navigator.clipboard.writeText(tsCurrent.textContent).then(() => {
      const orig = tsCurrent.textContent;
      tsCurrent.textContent = '✓ Copied';
      setTimeout(() => { tsCurrent.textContent = orig; }, 800);
    });
  });
}

// Timestamp → Date
if (tsInput) {
  tsInput.addEventListener('input', () => {
    const val = tsInput.value.trim();
    if (val === '') { tsDate.value = ''; return; }
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    const d = new Date(num * 1000);
    if (isNaN(d.getTime())) return;
    // Convert to local datetime-local string
    const pad = (n) => String(n).padStart(2, '0');
    const localStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    tsDate.value = localStr;
  });
}

// Date → Timestamp
if (tsDate) {
  tsDate.addEventListener('input', () => {
    const val = tsDate.value;
    if (val === '') { tsInput.value = ''; return; }
    const d = new Date(val);
    if (isNaN(d.getTime())) return;
    tsInput.value = Math.floor(d.getTime() / 1000);
  });
}

// Copy main
mainCopyBtn.addEventListener('click', () => {
  const text = mainValue.textContent;
  if (!text || text === '—') return;
  navigator.clipboard.writeText(text).then(() => {
    const original = mainCopyBtn.textContent;
    mainCopyBtn.textContent = '✓';
    mainCopyBtn.classList.add('copied');
    setTimeout(() => {
      mainCopyBtn.textContent = original;
      mainCopyBtn.classList.remove('copied');
    }, 1000);
  });
});

// Copy UTC
utcCopyBtn.addEventListener('click', () => {
  const text = utcTime.textContent + ' — ' + utcDate.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = utcCopyBtn.textContent;
    utcCopyBtn.textContent = '✓ Copied';
    utcCopyBtn.classList.add('copied');
    setTimeout(() => {
      utcCopyBtn.textContent = original;
      utcCopyBtn.classList.remove('copied');
    }, 1200);
  });
});

// Copy All
copyAllBtn.addEventListener('click', () => {
  if (!dateInput.value || !timeInput.value) return;
  const lines = [];
  COUNTRIES.forEach(country => {
    lines.push(`\n=== ${country.name} ===`);
    country.cities.forEach(city => {
      const converted = convertTime(dateInput.value, timeInput.value, fromZoneValue, city.tz);
      lines.push(`  ${city.name}${city.capital ? ' ★' : ''}: ${formatDateTime(converted, city.tz)}`);
    });
  });
  const text = `From ${fromZoneValue} — ${dateInput.value} ${timeInput.value}\n` + lines.join('\n');
  navigator.clipboard.writeText(text).then(() => {
    const original = copyAllBtn.textContent;
    copyAllBtn.textContent = '✓ Copied All';
    copyAllBtn.classList.add('copied');
    setTimeout(() => {
      copyAllBtn.textContent = original;
      copyAllBtn.classList.remove('copied');
    }, 1400);
  });
});

// Details
function buildDetails(date, time, fromZone, toZone, converted) {
  if (!detailsContent) return;
  const fromData = ALL_ZONES.find(z => z.value === fromZone);
  const toData = ALL_ZONES.find(z => z.value === toZone);

  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const localDate = new Date(y, m - 1, d, hh, mm);

  const fromOff = getOffset(fromZone, localDate);
  const toOff = getOffset(toZone, converted);
  const diffMin = toOff - fromOff;
  const diffH = Math.floor(Math.abs(diffMin) / 60);
  const diffM = Math.abs(diffMin) % 60;
  const sign = diffMin >= 0 ? '+' : '-';

  const fromAbbr = getAbbr(fromZone, localDate);
  const toAbbr = getAbbr(toZone, converted);
  const fromDST = isDST(fromZone, localDate);
  const toDST = isDST(toZone, converted);

  const fromOffStr = formatOffset(fromOff);
  const toOffStr = formatOffset(toOff);

  let html = '';
  html += `<div class="detail-row"><span class="detail-char">From Zone</span><span class="detail-arrow">→</span><span class="detail-value">${fromData ? fromData.label : fromZone}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">To Zone</span><span class="detail-arrow">→</span><span class="detail-value">${toData ? toData.label : toZone}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Input Date</span><span class="detail-arrow">→</span><span class="detail-value">${date}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Input Time</span><span class="detail-arrow">→</span><span class="detail-value">${time}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">From Offset</span><span class="detail-arrow">→</span><span class="detail-value">${fromOffStr}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">To Offset</span><span class="detail-arrow">→</span><span class="detail-value">${toOffStr}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Difference</span><span class="detail-arrow">→</span><span class="detail-value">${sign}${diffH}h ${diffM}m</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">From Abbr</span><span class="detail-arrow">→</span><span class="detail-value">${fromAbbr}${fromDST ? ' (DST)' : ''}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">To Abbr</span><span class="detail-arrow">→</span><span class="detail-value">${toAbbr}${toDST ? ' (DST)' : ''}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Result</span><span class="detail-arrow">→</span><span class="detail-value">${formatDateTime(converted, toZone)}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Countries</span><span class="detail-arrow">→</span><span class="detail-value">${COUNTRIES.length}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Total Cities</span><span class="detail-arrow">→</span><span class="detail-value">${ALL_ZONES.length - 1}</span></div>`;

  detailsContent.innerHTML = html;
}

// Details toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Auto-detect user zone
const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (ALL_ZONES.find(z => z.value === userZone)) {
  fromZoneValue = userZone;
  updateDisplay(fromDisplay, fromZoneValue);
}

updateConversion();

// ===== Theme Toggle =====
const themeBtn = document.getElementById('themeBtn');

document.body.classList.add('light-mode');

if (themeBtn) {
  const savedTheme = localStorage.getItem('devtools_theme') || 'light';

  if (savedTheme === 'dark') {
    document.body.classList.remove('light-mode');
    themeBtn.querySelector('.theme-icon').textContent = '☀️';
    themeBtn.querySelector('.theme-label').textContent = 'Light Mode';
  } else {
    document.body.classList.add('light-mode');
    themeBtn.querySelector('.theme-icon').textContent = '🌙';
    themeBtn.querySelector('.theme-label').textContent = 'Dark Mode';
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeBtn.querySelector('.theme-icon').textContent = isLight ? '🌙' : '☀️';
    themeBtn.querySelector('.theme-label').textContent = isLight ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('devtools_theme', isLight ? 'light' : 'dark');
  });
}