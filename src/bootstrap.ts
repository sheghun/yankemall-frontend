import Axios from 'axios';
/**
 * Bootstrap file
 * Contains the actions to fun first before application is run
 */

Axios.defaults.baseURL = 'http://localhost:8080';
Axios.defaults.withCredentials = true;
