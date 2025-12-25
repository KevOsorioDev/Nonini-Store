import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Configurar el cliente de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-ACCESS-TOKEN',
});

// Exportar instancias de las APIs que usaremos
export const payment = new Payment(client);
export const preference = new Preference(client);
export default client;
