import dotenv from 'dotenv';

import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  saltRound: process.env.SALT_ROUND,
  dataBase: process.env.DATABASE_URL,

  jwtAccessToken: process.env.JWT_ACCESS_TOKEN,
};
