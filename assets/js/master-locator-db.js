/**
 * Flamea.org - Master Resource Database
 * * Version: 2.0
 * * This file is the SINGLE SOURCE OF TRUTH for all location-based service data on the website.
 * * It now contains a merged and deduplicated list of all provided resources.
 * To add a new service, simply add a new object to the `masterDB` array.
 */

export const masterDB = [
  // --- JUSTICE & LEGAL ---
  {
    "name": "Constitutional Court of South Africa",
    "category": "Justice & Legal",
    "sub_category": "Constitutional Court",
    "address": "1 Hospital St, Constitution Hill, Johannesburg, 2001",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "011 359 7400",
    "website": "https://www.concourt.org.za/",
    "lat": -26.1912,
    "lng": 28.0423
  },
  {
    "name": "Supreme Court of Appeal",
    "category": "Justice & Legal",
    "sub_category": "Supreme Court of Appeal",
    "address": "Cnr President Brand & Union Ave, Bloemfontein, 9301",
    "province": "Free State",
    "city_town": "Bloemfontein",
    "phone": "051 412 7400",
    "website": "https://www.supremecourtofappeal.org.za/",
    "lat": -29.1169,
    "lng": 26.2185
  },
  {
    "name": "Gauteng High Court, Johannesburg",
    "category": "Justice & Legal",
    "sub_category": "High Court",
    "address": "c/o Pritchard and Kruis Streets, Johannesburg, 2001",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "010 494 8000",
    "website": "https://www.judiciary.org.za/",
    "lat": -26.2038,
    "lng": 28.0468
  },
  {
    "name": "Western Cape High Court, Cape Town",
    "category": "Justice & Legal",
    "sub_category": "High Court",
    "address": "35 Keerom St, Cape Town City Centre, Cape Town, 8001",
    "province": "Western Cape",
    "city_town": "Cape Town",
    "phone": "021 480 2411",
    "website": "https://www.judiciary.org.za/",
    "lat": -33.9252,
    "lng": 18.4196
  },
  {
    "name": "KwaZulu-Natal High Court, Durban",
    "category": "Justice & Legal",
    "sub_category": "High Court",
    "address": "12 Walnut Rd, Durban Central, Durban, 4001",
    "province": "KwaZulu-Natal",
    "city_town": "Durban",
    "phone": "031 362 5800",
    "website": "https://www.judiciary.org.za/",
    "lat": -29.8600,
    "lng": 31.0292
  },
  {
    "name": "Gauteng High Court, Pretoria",
    "category": "Justice & Legal",
    "sub_category": "High Court",
    "address": "c/o Paul Kruger and Madiba Streets, Pretoria, 0002",
    "province": "Gauteng",
    "city_town": "Pretoria",
    "phone": "012 492 6857",
    "website": "https://www.judiciary.org.za/",
    "lat": -25.7461,
    "lng": 28.1883
  },
  {
    "name": "Eastern Cape High Court, Makhanda",
    "category": "Justice & Legal",
    "sub_category": "High Court",
    "address": "100 High St, Makhanda (Grahamstown), 6139",
    "province": "Eastern Cape",
    "city_town": "Makhanda",
    "phone": "046 603 5000",
    "website": "https://www.judiciary.org.za/",
    "lat": -33.3078,
    "lng": 26.5306
  },
  {
    "name": "Johannesburg Magistrates Court (Criminal)",
    "category": "Justice & Legal",
    "sub_category": "Magistrates Court",
    "address": "60 Miriam Makeba St, Newtown, Johannesburg, 2001",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "010 494 8400",
    "website": "https://www.justice.gov.za/",
    "lat": -26.2016,
    "lng": 28.0323
  },
  {
    "name": "Family Advocate, Johannesburg",
    "category": "Justice & Legal",
    "sub_category": "Family Advocate",
    "address": "94 Pritchard St, Schreiner Chambers, Johannesburg",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "011 332 9000",
    "website": "https://www.justice.gov.za/offices/family-advocate.html",
    "lat": -26.2040,
    "lng": 28.0410
  },
  {
    "name": "Legal Aid SA, Johannesburg",
    "category": "Justice & Legal",
    "sub_category": "Legal Aid SA",
    "address": "29 Kerk St, Johannesburg Central, Johannesburg, 2001",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "011 870 1480",
    "website": "https://legal-aid.co.za/",
    "lat": -26.2063,
    "lng": 28.0435
  },
  {
    "name": "CCMA, Johannesburg",
    "category": "Justice & Legal",
    "sub_category": "CCMA",
    "address": "CCMA House, 20 Anderson St, Marshalltown, Johannesburg, 2001",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "011 377 6650",
    "website": "https://www.ccma.org.za/",
    "lat": -26.2084,
    "lng": 28.0433
  },

  // --- GOVERNMENT & ADMIN ---
  {
    "name": "SAPS Johannesburg Central",
    "category": "Government & Admin",
    "sub_category": "SAPS Station",
    "address": "1 Commissioner St, Johannesburg, 2001",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "011 497 7000",
    "website": "https://www.saps.gov.za/",
    "lat": -26.2078,
    "lng": 28.0413
  },
  {
    "name": "Home Affairs Johannesburg (Harrison St)",
    "category": "Government & Admin",
    "sub_category": "Home Affairs",
    "address": "77 Harrison St, Johannesburg, 2001",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "0800 601 190",
    "website": "http://www.dha.gov.za/",
    "lat": -26.2059,
    "lng": 28.0384
  },

  // --- HEALTH ---
  {
    "name": "Charlotte Maxeke Johannesburg Academic Hospital",
    "category": "Health",
    "sub_category": "Public Hospital",
    "address": "17 Jubilee Rd, Parktown, Johannesburg, 2193",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "011 488 4911",
    "website": "https://www.wits.ac.za/cmjah/",
    "lat": -26.1855,
    "lng": 28.0364
  },
  {
    "name": "Groote Schuur Hospital",
    "category": "Health",
    "sub_category": "Public Hospital",
    "address": "Main Rd, Observatory, Cape Town, 7925",
    "province": "Western Cape",
    "city_town": "Cape Town",
    "phone": "021 404 9111",
    "website": "https://www.westerncape.gov.za/your_gov/150",
    "lat": -33.9397,
    "lng": 18.4635
  },

  // --- TRANSPORT ---
  {
    "name": "O.R. Tambo International Airport",
    "category": "Transport",
    "sub_category": "Airport",
    "address": "1 Jones Rd, Kempton Park, 1632",
    "province": "Gauteng",
    "city_town": "Kempton Park",
    "phone": "011 921 6262",
    "website": "https://www.airports.co.za/",
    "lat": -26.1392,
    "lng": 28.2460
  },
  {
    "name": "Park Station (Gautrain, Metrorail, Inter-city Bus)",
    "category": "Transport",
    "sub_category": "Transport Hub",
    "address": "Rissik St, Johannesburg, 2000",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "N/A",
    "website": "https://www.gautrain.co.za/",
    "lat": -26.1971,
    "lng": 28.0437
  },
  {
    "name": "MTN Noord Taxi Rank",
    "category": "Transport",
    "sub_category": "Major Taxi Rank",
    "address": "Noord St, Johannesburg, 2001",
    "province": "Gauteng",
    "city_town": "Johannesburg",
    "phone": "N/A",
    "website": "N/A",
    "lat": -26.1991,
    "lng": 28.0487
  },
  // --- Additional Courts from user data ---
  {
    "name": "Pietermaritzburg High Court",
    "category": "Justice & Legal",
    "sub_category": "High Court",
    "address": "237 Langalibalele St, Pietermaritzburg, 3201",
    "province": "KwaZulu-Natal",
    "city_town": "Pietermaritzburg",
    "phone": "033 392 2500",
    "website": "https://www.justice.gov.za/",
    "lat": -29.6110,
    "lng": 30.3944
  },
  {
    "name": "Fort Beaufort Magistrates Court",
    "category": "Justice & Legal",
    "sub_category": "Magistrates Court",
    "address": "Market Street 4, Fort Beaufort, Eastern Cape, 5720",
    "province": "Eastern Cape",
    "city_town": "Fort Beaufort",
    "phone": "046 645 1104",
    "website": "https://www.justice.gov.za/",
    "lat": -32.77756,
    "lng": 26.63037
  },
   {
    "name": "Small Claims Court Fort Beaufort",
    "category": "Justice & Legal",
    "sub_category": "Small Claims Court",
    "address": "Market Street 4, Fort Beaufort, Eastern Cape, 5720",
    "province": "Eastern Cape",
    "city_town": "Fort Beaufort",
    "phone": "046 645 1104",
    "website": "https://www.justice.gov.za/scc/",
    "lat": -32.77756,
    "lng": 26.63037
   },
   {
    "name": "Customary Court (Kgotla) village near Sekhukhune",
    "category": "Justice & Legal",
    "sub_category": "Customary Court",
    "address": "Rural community council site, Sekhukhune District, Limpopo",
    "province": "Limpopo",
    "city_town": "Sekhukhune area",
    "phone": "",
    "website": "",
    "lat": -24.2250,
    "lng": 29.1850
   }
];
