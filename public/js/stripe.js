import axios from "axios";

const stripe = Stripe(
  'pk_test_51HTHBeHQW8t21RlGPtXSPGXio8JV5Dw36ymSuVeD0MUnsL4FCluPi7FBqWHPfxSzqyDiwUimipicEDzstm1DRMLc00AFZgoJGI'
);

export const bookTour = (tourID) => {
    // 1) Get the Checkout Session from the API
    try {
        const session = await axios({
            method: 'GET',
            url: `${window.location.protocol}://${window.location.hostname}/api/v1/bookings/checkout-session/${tourID}`
        })
        console.log(session)
    } catch (err) {

    }

    // 2) Create checkout form + charge the debit/card
}
