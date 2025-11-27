// Load environment variables - only if not already loaded
if (!process.env.ACCOUNT_ID) {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv not available, continue without it
  }
}

export interface Account {
  id: string, privateKey: string
}

// Load single account from environment variables
function loadAccount(): Account | null {
  const id = process.env.ACCOUNT_ID;
  const privateKey = process.env.ACCOUNT_PRIVATE_KEY;
  
  if (id && privateKey) {
    return { id, privateKey };
  }
  return null;
}

// Initialize account from environment variables
const loadedAccount = loadAccount();

if (!loadedAccount) {
  throw new Error('❌ ACCOUNT_ID and ACCOUNT_PRIVATE_KEY must be set in .env file or environment variables');
}

// Export as array for backward compatibility with existing code
export const accounts: Account[] = [loadedAccount];
