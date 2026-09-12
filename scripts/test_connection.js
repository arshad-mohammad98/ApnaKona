const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually for test script
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key prefix:', supabaseAnonKey ? supabaseAnonKey.slice(0, 18) + '...' : 'NONE');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  const { data, error, count } = await supabase
    .from('colleges')
    .select('name, city, state, type', { count: 'exact' })
    .limit(5);

  if (error) {
    console.error('Test query failed:', error);
    process.exit(1);
  }

  console.log('\n SUCCESS! Connected to Supabase.');
  console.log(`Total colleges in table: ${count}`);
  console.log('\nSample rows fetched from "colleges" table:');
  console.table(data);
}

runTest();
