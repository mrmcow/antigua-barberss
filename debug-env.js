// Debug script to check environment variables
console.log('🔍 DEBUGGING ENVIRONMENT VARIABLES:');
console.log('');

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ SET' : '❌ MISSING');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ MISSING');
console.log('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅ SET' : '❌ MISSING');

console.log('');
console.log('VALUES:');
console.log('URL starts with:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...' || 'UNDEFINED');
console.log('KEY starts with:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...' || 'UNDEFINED');
console.log('API KEY starts with:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 20) + '...' || 'UNDEFINED');

console.log('');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL:', process.env.VERCEL ? '✅ RUNNING ON VERCEL' : '❌ NOT ON VERCEL');
