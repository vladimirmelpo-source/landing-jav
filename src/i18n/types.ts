export const LOCALE_CODES = ['en', 'ru', 'ja', 'es', 'pt'] as const
export type LocaleCode = (typeof LOCALE_CODES)[number]

export type Translations = {
  header: {
    langSelector: string
    openMenu: string
    closeMenu: string
    payment: string
    email: string
    emailPlaceholder: string
    createAccount: string
    emailRequired: string
    close: string
    submitSuccess: string
    submitError: string
  }
  menu: {
    title: string
    home: string
    tariffs: string
    support: string
    back: string
    contentRemoval: string
    dmca: string
    forCreators: string
    termsOfUse: string
    privacyPolicy: string
    refundPolicy: string
    affiliateProgram: string
    parentalControl: string
    contactUs: string
    dvd: string
    categoriesAndTags: string
    categoriesNote: string
    createNewAccount: string
    signIn: string
    becomeMember: string
  }
  video: {
    sectionLabel: string
    loading: string
    noVideos: string
    otherVideos: string
    relatedVideos: string
    watchFullVideo: string
    muteOn: string
    muteOff: string
    close: string
    selectVideo: string
  }
  ageGate: {
    warning: string
    confirmButton: string
    confirmAria: string
    disclaimer1: string
    disclaimer2: string
    termsOfUse: string
    privacyPolicy: string
    and: string
    contentTypeChoice: string
    contentGay: string
    contentStraight: string
    contentTrans: string
  }
  membership: {
    sectionLabel: string
    titleLine1: string
    titleLine2: string
    cta: string
    ctaAria: string
    copyright: string
    benefits: {
      encrypted: string
      noAdultPayments: string
      cancelAnytime: string
      trialAvailable: string
      localPayments: string
      affordable: string
      dailyUpdates: string
      highQuality: string
      downloads: string
    }
  }
  tariffs: {
    title: string
    joinTitle: string
    loading: string
    noTariffs: string
    select: string
    scrollLeft: string
    scrollRight: string
    createOrSignIn: string
    createOrSignInPrefix: string
    signIn: string
    footerAgree: string
    footerAgreePrefix: string
    footerAgreeAnd: string
    footerAgreeSuffix: string
    createAccountButton: string
    paymentCard: string
    paymentCrypto: string
    paymentAlipay: string
    paymentPay: string
    paymentOxxo: string
    paymentPix: string
    paymentUpi: string
    submitSuccess: string
    submitError: string
  }
}
