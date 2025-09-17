-- Up Migration
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Down Migration
DROP EXTENSION IF EXISTS "uuid-ossp";
