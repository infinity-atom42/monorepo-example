import { onPaymentCreated } from './payment-created'
import { onPaymentSucceeded } from './payment-succeeded'

export const events = [onPaymentCreated, onPaymentSucceeded]
