export interface NavLink {
  name: string;
  href: string;
  active: boolean;
}

export interface HeaderData {
  logo: string;
  logoAlt: string;
  links: NavLink[];
  button: string;
  buttonHref: string;
  mobileMenuAriaLabel?: string;
}

export interface HeroBadge {
  text: string;
  icon: string;
}

export interface CardBadge {
  text: string;
  icon: string;
  style: "dark" | "purple" | "white";
}

export interface FloatingAction {
  text: string;
  icon: string;
  href: string;
}

export interface HeroCard {
  id: string;
  image: string;
  alt: string;
  cutoutSide?: "left" | "right" | "none";
  badges?: CardBadge[];
  floatingAction?: FloatingAction;
}

export interface BackgroundPaw {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  size: number;
  opacity: number;
}

export interface HeroData {
  id?: string;
  badge: HeroBadge;
  headingPart1: string;
  headingPart2: string;
  descriptionLines: string[];
  cards: HeroCard[];
  pagination: {
    totalDots: number;
    activeDotIndex: number;
  };
  backgroundPaws: BackgroundPaw[];
  tagline?: string;
  heading?: string;
  headingLines?: string[];
  description?: string;
  backgroundImage?: string;
  ctaButton?: {
    text: string;
    href: string;
  };
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutImage {
  src: string;
  alt: string;
}

export interface AboutData {
  id?: string;
  tagline: string;
  taglineIcon: string;
  headingPart1: string;
  headingPart2Prefix: string;
  headingHighlight: string;
  description: string;
  leftImage: AboutImage;
  rightImage: AboutImage;
  heading?: string;
  headingPart2?: string;
  image?: string;
  stats?: AboutStat[];
}

export interface ServiceCardTheme {
  cardBg: string;
  cardBorder: string;
  watermarkColor: string;
  badgeBg: string;
}

export interface ServiceBadgeIcon {
  name: string;
  bgColor: string;
}

export interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  badgeIcon: ServiceBadgeIcon;
  theme: ServiceCardTheme;
}

export interface ServiceItem {
  id: string;
  title: string;
  image: string;
  href: string;
  isFeatured: boolean;
}

export interface ServicesData {
  id?: string;
  tagline: string;
  taglineIcon: string;
  headingPart1: string;
  headingHighlight: string;
  descriptionLines: string[];
  cards: ServiceCardItem[];
  backgroundPaws: BackgroundPaw[];
  taglinePrefix?: string;
  headingPart2?: string;
  description?: string;
  items?: ServiceItem[];
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface AchievementsData {
  tagline: string;
  description: string;
  stats: StatItem[];
}

export interface FeatureItem {
  id: string;
  text: string;
}

export interface WhyChooseUsCardData {
  tagline: string;
  taglineIcon: string;
  headingPart1: string;
  headingPart2Prefix: string;
  headingHighlight: string;
  description: string;
  features: FeatureItem[];
}

export interface WhyChooseUsFeature {
  title: string;
  description: string;
  icon: string;
}

export interface WhyChooseUsData {
  id?: string;
  image: {
    src: string;
    alt: string;
  };
  achievements: AchievementsData;
  card: WhyChooseUsCardData;
  tagline?: string;
  headingPart1?: string;
  headingPart2?: string;
  headingHighlight?: string;
  description?: string;
  features?: WhyChooseUsFeature[];
  overlayCard?: {
    title: string;
    description: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  alt: string;
}

export interface GalleryData {
  id?: string;
  tagline: string;
  taglineIcon: string;
  headingPart1: string;
  headingHighlight: string;
  description: string;
  items: GalleryItem[];
  pagination: {
    totalDots: number;
    activeDotIndex: number;
  };
  backgroundPaws: BackgroundPaw[];
  heading?: string;
  prevSlideAriaLabel?: string;
  nextSlideAriaLabel?: string;
  closeLightboxAriaLabel?: string;
  prevImageAriaLabel?: string;
  nextImageAriaLabel?: string;
}

export interface TestimonialReviewItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

export interface TestimonialData {
  id?: string;
  tagline: string;
  taglineIcon: string;
  headingPart1: string;
  headingHighlight: string;
  description: string;
  carouselAriaLabel?: string;
  prevButtonAriaLabel?: string;
  nextButtonAriaLabel?: string;
  dotAriaLabelPrefix?: string;
  sideImage: {
    src: string;
    alt: string;
  };
  reviews: TestimonialReviewItem[];
  pagination: {
    totalDots: number;
    activeDotIndex: number;
  };
  backgroundPaws: BackgroundPaw[];
  backgroundImage?: string;
  items?: TestimonialItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQData {
  id?: string;
  tagline: string;
  taglineIcon: string;
  headingPart1: string;
  headingHighlight: string;
  description: string;
  image: {
    src: string;
    alt: string;
    badgeText: string;
    badgeIcon?: string;
  };
  items: FAQItem[];
  backgroundPaws: BackgroundPaw[];
}

export interface ScheduleHourItem {
  id: string;
  icon: string;
  title: string;
  hours: string;
}

export interface FormFieldsData {
  nameLabel: string;
  namePlaceholder: string;
  petNameLabel: string;
  petNamePlaceholder: string;
  dateLabel: string;
  datePlaceholder: string;
  timeLabel: string;
  timePlaceholder: string;
  timeOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  submitButtonText: string;
  successMessage?: string;
}

export interface ContactInfoItem {
  icon: string;
  title: string;
  detail: string;
  href: string;
}

export interface ContactData {
  id?: string;
  tagline: string;
  taglineIcon: string;
  headingPart1: string;
  headingHighlight: string;
  descriptionLines: string[];
  scheduleHours: ScheduleHourItem[];
  petsImage: {
    src: string;
    alt: string;
  };
  formTitle: string;
  formIcon: string;
  form: FormFieldsData;
  backgroundPaws: BackgroundPaw[];
  heading?: string;
  description?: string;
  infoItems?: ContactInfoItem[];
  formButtonText?: string;
  inquiryOptions?: string[];
}

export interface FooterQuickLink {
  name: string;
  href: string;
}

export interface FooterSocialLink {
  name: string;
  icon: string;
  href: string;
}

export interface FooterContactItem {
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface FooterData {
  logo: string;
  logoAlt: string;
  logoHref?: string;
  scrollToTopAriaLabel?: string;
  tagline: string;
  location: string;
  socialLinks: FooterSocialLink[];
  quickLinks: FooterQuickLink[];
  ctaHeading: string;
  contactItems: FooterContactItem[];
  petsImage: {
    src: string;
    alt: string;
  };
  copyright: string;
  backgroundImage?: string;
  description?: string;
  contact?: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface PageComponentItem {
  key: string;
  component: string;
}

export interface PageConfig {
  components: PageComponentItem[];
}

export interface TemplateDefinition {
  shared: {
    Header: string;
    Footer: string;
  };
  pages: {
    home: PageConfig;
    [key: string]: PageConfig;
  };
}

export interface Sections {
  Header: {
    variants: {
      PawJoyHeader1: HeaderData;
      [key: string]: HeaderData;
    };
  };
  Hero: {
    variants: {
      PawJoyHero1: HeroData;
      [key: string]: HeroData;
    };
  };
  About: {
    variants: {
      PawJoyAbout1: AboutData;
      [key: string]: AboutData;
    };
  };
  Services: {
    variants: {
      PawJoyServices1: ServicesData;
      [key: string]: ServicesData;
    };
  };
  WhyChooseUs: {
    variants: {
      PawJoyWhyChooseUs1: WhyChooseUsData;
      [key: string]: WhyChooseUsData;
    };
  };
  Gallery: {
    variants: {
      PawJoyGallery1: GalleryData;
      [key: string]: GalleryData;
    };
  };
  Testimonial: {
    variants: {
      PawJoyTestimonial1: TestimonialData;
      [key: string]: TestimonialData;
    };
  };
  FAQ?: {
    variants: {
      PawJoyFAQ1: FAQData;
      [key: string]: FAQData;
    };
  };
  Contact: {
    variants: {
      PawJoyContact1: ContactData;
      [key: string]: ContactData;
    };
  };
  Footer: {
    variants: {
      PawJoyFooter1: FooterData;
      [key: string]: FooterData;
    };
  };
}

export interface PawJoyData {
  templateComponents: {
    [templateKey: string]: TemplateDefinition;
  };
  sections: Sections;
}

export interface ContentData {
  PawJoy: PawJoyData;
}
