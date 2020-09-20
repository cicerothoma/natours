import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51HTHBeHQW8t21RlGPtXSPGXio8JV5Dw36ymSuVeD0MUnsL4FCluPi7FBqWHPfxSzqyDiwUimipicEDzstm1DRMLc00AFZgoJGI'
);
export const bookTour = async (tourID) => {
  try {
    // 1) Get the Checkout Session from the API
    const session = await axios({
      method: 'GET',
      url: `${window.location.origin}/api/v1/bookings/checkout-session/${tourID}`,
    });
    console.log(session);
    // 2) Create checkout form + charge the debit/card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
