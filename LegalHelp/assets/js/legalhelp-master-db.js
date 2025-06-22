/**
 * LegalHelp - Master Resource Database
 * Version 4.0: The single source of truth for all locator data.
 * This file imports and consolidates all provincial court data, higher courts,
 * government service points, and NGOs into one comprehensive array.
 */

// Import all provincial lower court data
import { lower_courts_ec } from './lower_courts_ec.js';
import { lower_courts_fs } from './lower_courts_fs.js';
import { lower_courts_gp } from './lower_courts_gp.js';
import { lower_courts_kzn } from './lower_courts_kzn.js';
import { lower_courts_lp } from './lower_courts_lp.js';
import { lower_courts_mp } from './lower_courts_mp.js';
import { lower_courts_nc } from './lower_courts_nc.js';
import { lower_courts_nw } from './lower_courts_nw.js';
import { lower_courts_wc } from './lower_courts_wc.js';

// Import higher courts, NGOs, and government services
import { higher_special_courts_sa } from './higher_special_courts_sa.js';
import { law_gender_ngos_db } from './law_gender_ngos_db.js';
import { social_development_db, home_affairs_db, post_office_db, sars_db } from './south_african_government_service_points.js';


// Combine all the imported arrays into one master database
export const masterDB = [
  ...higher_special_courts_sa,
  ...lower_courts_ec,
  ...lower_courts_fs,
  ...lower_courts_gp,
  ...lower_courts_kzn,
  ...lower_courts_lp,
  ...lower_courts_mp,
  ...lower_courts_nc,
  ...lower_courts_nw,
  ...lower_courts_wc,
  ...law_gender_ngos_db,
  ...social_development_db,
  ...home_affairs_db,
  ...post_office_db,
  ...sars_db
];
