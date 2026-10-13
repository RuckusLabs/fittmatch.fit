export function isWebProfileVisible(record) {
  if (!record?.data || record.data.profiles?.is_banned === true || record.data.is_complete === false) return false;
  if (record.type === 'coach') return record.data.profiles?.open_to_offers === true;
  if (record.type === 'client') return true;
  if (record.type === 'job') return record.data.status === 'live' && (!record.data.expires_at || Date.parse(record.data.expires_at) > Date.now());
  return false;
}
