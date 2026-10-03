export const business = {
  name: 'London Renovation Design',
  legalName: 'London Renovation Design Ltd',
  phone: '0333 988 0198',
  telephone: '+443339880198',
  email: 'info@londonrenovationdesign.co.uk',
  address: '15A Station Road, Harrow, London HA1 2UF',
};

// Featured-service space; replace with an approved promotion when one is available.
export const heroPromotion = {
  label: 'Your next home project',
  title: 'Kitchens & bathrooms, made for you.',
  action: 'Discuss your renovation',
};

export const services = [
  {
    id: 'restoration', number: '01', label: 'Restore your home',
    title: 'Fire & flood', emphasis: 'restoration.',
    description: 'When the unexpected happens, get the right help. From assessment and drying to the final repair.',
    tags: ['Fire & smoke damage', 'Flood restoration', 'Repair & reinstatement'],
    image: 'restoration', alt: 'Concept illustration of a restoration specialist surveying a damaged interior',
    action: 'Get restoration support',
  },
  {
    id: 'renovation', number: '02', label: 'Reimagine your home',
    title: 'Kitchens, bathrooms', emphasis: '& beyond.',
    description: 'Make room for the way you want to live. Thoughtful design, carefully chosen materials and expert installation.',
    tags: ['Kitchens & bathrooms', 'Extensions & lofts', 'Bespoke finishes'],
    image: 'bathroom', alt: 'Renovation concept showing a warm stone bathroom with oak joinery',
    action: 'Discuss your renovation',
  },
];

export const steps = [
  { number: '01', title: 'Tell us about your home.', text: 'An unexpected problem or a plan you’ve been thinking about. Start with a conversation about what you need.' },
  { number: '02', title: 'Know what comes next.', text: 'We assess the space, talk through the options and put together a clear scope and quotation.' },
  { number: '03', title: 'Let us bring it together.', text: 'From the first stage to the finishing details, one team coordinates the work around your home.' },
];
