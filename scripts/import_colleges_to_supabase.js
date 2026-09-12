const { createClient } = require('@supabase/supabase-js');
const colleges = require('./generate_colleges_csv');

const fs = require('fs');
const path = require('path');

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const k = parts[0].trim();
          const v = parts.slice(1).join('=').trim();
          if (k === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = v;
          if (k === 'SUPABASE_SERVICE_ROLE_KEY') supabaseKey = v;
        }
      });
    }
  } catch (err) {
    // ignore
  }
}

if (!supabaseKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required in environment or .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl || "https://ryuyrgegqunbtbwbikua.supabase.co", supabaseKey);

async function importColleges() {
  console.log(`Starting import of ${colleges.length} colleges into Supabase table 'colleges'...`);

  // Insert in batches of 40 to ensure fast and reliable insertion
  const batchSize = 40;
  let totalInserted = 0;

  for (let i = 0; i < colleges.length; i += batchSize) {
    const batch = colleges.slice(i, i + batchSize).map(c => ({
      name: c.name,
      city: c.city,
      state: c.state,
      type: c.type,
      latitude: c.latitude,
      longitude: c.longitude
    }));

    const { data, error } = await supabase.from('colleges').insert(batch).select();

    if (error) {
      console.error(`Error in batch ${i / batchSize + 1}:`, error);
    } else {
      totalInserted += (data ? data.length : batch.length);
      console.log(`Inserted batch ${i / batchSize + 1} (${totalInserted}/${colleges.length})`);
    }
  }

  const { count } = await supabase.from('colleges').select('*', { count: 'exact', head: true });
  console.log(`Finished! Total colleges in database: ${count}`);
}

importColleges().catch(console.error);
