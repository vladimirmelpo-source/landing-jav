import type { Tariff, TariffsResponse, ServerTariffsResponse, ServerTariffItem } from '@/types/tariff'

/** Хардкод ответа сервера с тарифами */
const SERVER_TARIFFS_RESPONSE: ServerTariffsResponse = {
  success: true,
  data: {
    items: [
      {
        name: 'LIFETIME MEMBERSHIP for $149.00',
        initial: '149',
        initial_nice: '149',
        initial_days: '9999999999',
        rebill: '0',
        rebill_nice: '0',
        rebill_days: '0',
        packageid: '100',
        package_upgrade_allowed: '0',
        enable_global_package_upgrade: '0',
        package_billing: '1',
        no_old_members: '0',
        hidden: '0',
        optionid: '1859',
        is_trial: false,
        month_price: 0,
        after_trial_price: 0,
        initial_integer: 149,
        day_price: '0.00',
        initial_fractional: '',
        rebill_integer: 0,
        rebill_fractional: '',
        month_count: 333333333,
        price: 0,
        price_integer: 0,
        price_fractional: '',
        month_price_pcnt: 100,
        month_price_discount: 19996666498,
        day_price_pcnt: 100,
        day_price_discount: 19899999998,
        base_price: '59.99',
        day_base_price: '1.99',
      },
      {
        package_billing: '1',
        no_old_members: '0',
        package_upgrade_allowed: '0',
        enable_global_package_upgrade: '0',
        hidden: '0',
        initial_free: '0',
        token_rebuy_allowed: '0',
        ncr_email: '0',
        initial: '239.88',
        initial_nice: '239.88',
        initial_days: '365',
        rebill: '239.88',
        rebill_nice: '239.88',
        rebill_days: '365',
        name: 'SPECIAL MEMBERSHIP - 365 DAYS FOR 239.88$',
        packageid: '100',
        optionid: '367',
        is_trial: false,
        month_price: 19.99,
        after_trial_price: 0,
        initial_integer: 239,
        day_price: '0.66',
        initial_fractional: '88',
        rebill_integer: 239,
        rebill_fractional: '88',
        month_count: 12,
        price: 19.99,
        price_integer: 19,
        price_fractional: '99',
        month_price_pcnt: 67,
        month_price_discount: 480,
        day_price_pcnt: 67,
        day_price_discount: 726,
        base_price: '59.99',
        day_base_price: '1.99',
      },
      {
        package_billing: '1',
        no_old_members: '0',
        package_upgrade_allowed: '0',
        enable_global_package_upgrade: '0',
        hidden: '0',
        initial_free: '0',
        token_rebuy_allowed: '0',
        ncr_email: '0',
        initial: '49.99',
        initial_nice: '49.99',
        initial_days: '30',
        rebill: '49.99',
        rebill_nice: '49.99',
        rebill_days: '30',
        name: 'SPECIAL MEMBERSHIP - 30 DAYS FOR 49.99$',
        packageid: '100',
        optionid: '364',
        is_trial: false,
        month_price: 49.99,
        after_trial_price: 0,
        initial_integer: 49,
        day_price: '1.67',
        initial_fractional: '99',
        rebill_integer: 49,
        rebill_fractional: '99',
        month_count: 1,
        price: 49.99,
        price_integer: 49,
        price_fractional: '99',
        month_price_pcnt: 17,
        month_price_discount: 10,
        day_price_pcnt: 16,
        day_price_discount: 58,
        base_price: '59.99',
        day_base_price: '1.99',
      },
      {
        no_old_members: '0',
        package_upgrade_allowed: '1',
        enable_global_package_upgrade: '0',
        package_billing: '1',
        hidden: '0',
        initial_free: '0',
        token_rebuy_allowed: '0',
        ncr_email: '0',
        trial: '1',
        initial: '1',
        initial_nice: '1',
        initial_days: '1',
        rebill: '59.99',
        rebill_nice: '59.99',
        rebill_days: '30',
        name: '$1.00 for 1 days',
        packageid: '100',
        optionid: '1631',
        is_trial: true,
        month_price: 0,
        after_trial_price: 0,
        initial_integer: 1,
        day_price: '1.00',
        initial_fractional: '',
        rebill_integer: 59,
        rebill_fractional: '99',
        month_count: 0,
        price_integer: 1,
        price_fractional: '',
        price: '1.00',
        month_price_pcnt: 0,
        month_price_discount: 0,
        day_price_pcnt: 0,
        day_price_discount: 0,
        base_price: '59.99',
        day_base_price: '1.99',
      },
    ],
    cascade: 85,
  },
}

function mapServerItemToTariff(item: ServerTariffItem): Tariff {
  const initialNum = parseFloat(item.initial) || 0
  const days = parseInt(item.initial_days, 10) || 0
  const dayPriceStr = item.day_price != null && item.day_price !== '0.00' ? String(item.day_price) : undefined
  const period =
    days >= 9999999999
      ? 'Lifetime'
      : days === 1
        ? '1 day'
        : days === 30
          ? '30 days'
          : days === 365
            ? '365 days'
            : `${days} days`

  let displayName: string
  const badges: { text: string; type: 'offer' | 'discount' }[] = []
  if (item.is_trial) {
    displayName = 'Trial'
    badges.push({ text: 'Limited offer', type: 'offer' })
  } else if (days >= 9999999999) {
    displayName = 'Lifetime'
  } else if (days === 30) {
    displayName = '1 month'
    if (item.month_price_pcnt != null && item.month_price_pcnt >= 1) {
      badges.push({ text: `-${item.month_price_pcnt}% off`, type: 'discount' })
    }
  } else if (days === 365) {
    displayName = '12 months'
    if (item.month_price_pcnt != null && item.month_price_pcnt >= 1) {
      badges.push({ text: `-${item.month_price_pcnt}% off`, type: 'discount' })
    }
  } else {
    displayName = `${days} days`
    if (item.month_price_pcnt != null && item.month_price_pcnt >= 1) {
      badges.push({ text: `-${item.month_price_pcnt}% off`, type: 'discount' })
    }
  }

  const dayPrice = dayPriceStr != null ? `$${dayPriceStr}/day` : undefined

  return {
    id: String(item.optionid),
    name: item.name,
    price: initialNum,
    currency: '$',
    period,
    displayName,
    dayPrice,
    badges: badges.length ? badges : undefined,
    highlighted: item.is_trial === true,
    features:
      dayPriceStr && dayPriceStr !== '0.00'
        ? [{ text: `$${dayPriceStr} per day`, included: true }]
        : undefined,
  }
}

/** Тарифы из хардкода ответа сервера */
export function getTariffsFromServerResponse(): TariffsResponse {
  const raw = SERVER_TARIFFS_RESPONSE
  if (!raw.success || !raw.data?.items?.length) {
    return { items: [] }
  }
  return {
    items: raw.data.items.map(mapServerItemToTariff),
  }
}

/** Тарифы: пока отдаём хардкод (без запроса) */
export function fetchTariffs(): Promise<TariffsResponse> {
  return Promise.resolve(getTariffsFromServerResponse())
}
