export async function getCounterpointIndex() {
  const r = await fetch('./libs/counterpoint/counterpoint_index.json', { cache: 'no-store' });
  return await r.json();
}
export async function loadStyle(id) {
  const r = await fetch(`./libs/counterpoint/styles/${id}.json`, { cache: 'no-store' });
  return await r.json();
}
