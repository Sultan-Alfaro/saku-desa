const fs = require('fs');

async function main() {
  const url = "https://wljyvurpzaqyynttjijq.supabase.co/rest/v1/?apikey=sb_publishable_95KhQnhLEqAOnqbrnko-4A_UsVIfbBU";
  const res = await fetch(url);
  const data = await res.json();
  const paths = Object.keys(data.paths || {});
  console.log("Tables/Paths:", paths);
  
  if (data.definitions) {
    fs.writeFileSync('schema_definitions.json', JSON.stringify(data.definitions, null, 2), 'utf-8');
    console.log("Definitions written to schema_definitions.json (UTF-8)");
  }
}
main();
