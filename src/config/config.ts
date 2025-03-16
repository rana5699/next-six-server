import dotenv from 'dotenv';

import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  saltRound: process.env.SALT_ROUND,
  dataBase: process.env.DATABASE_URL,

  jwtAccessToken: process.env.JWT_ACCESS_TOKEN,
  stripeSecretKey : process.env.STRIPE_SECRET_KEY ,
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY ,
  stripeSuccessUrl: process.env.STRIPE_SUCCESS_URL ,
  stripeCancelUrl: process.env.STRIPE_CANCEL_URL ,
  senderEmail: process.env.SENDER_EMAIL,
  emailPass: process.env.EMAIL_PASSWORD ,
};
