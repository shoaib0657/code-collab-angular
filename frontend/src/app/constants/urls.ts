import { environment } from '../../environments/environment';

export const BASE_URL = environment.production ? '' : 'http://localhost:5000';