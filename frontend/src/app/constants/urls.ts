import { environment } from '../../environments/environment';

export const BASE_URL = environment.production ? 'https://codecollab-api.vercel.app/' : 'http://localhost:5000';