/**
 * Storage service for persisting application data
 */

export type Company = {
  id: string;
  name: string;
  url: string;
  email: string;
  managerName: string;
  status: 'pending' | 'sent' | 'failed';
};

/**
 * Save companies to localStorage
 */
export function saveCompanies(companies: Company[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('application_companies', JSON.stringify(companies));
    } catch (error) {
      console.error('Error saving companies to localStorage:', error);
    }
  }
}

/**
 * Load companies from localStorage
 */
export function loadCompanies(): Company[] {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem('application_companies');
      if (data) {
        return JSON.parse(data) as Company[];
      }
    } catch (error) {
      console.error('Error loading companies from localStorage:', error);
    }
  }
  return [];
}

/**
 * Clear all companies from localStorage
 */
export function clearCompanies(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('application_companies');
    } catch (error) {
      console.error('Error clearing companies from localStorage:', error);
    }
  }
} 