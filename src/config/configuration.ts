/* eslint-disable prettier/prettier */
export default () => ({
  port: process.env.PORT || 3100,
  token_secret_login: process.env.TOKEN_SECRET_LOGIN,
  token_secret_use_main: process.env.TOKEN_SECRET_USE_MAIN,
  token_expiration: process.env.TOKEN_EXPIRATION,
  
  mongodb: process.env.MONGO_URI,
  api_personal:process.env.API_PERSONAL,
  db_name:process.env.DB_NAME,

  link_ip_central: process.env.LINK_IP_CENTRAL,
  link_ip_personal: process.env.LINK_IP_PERSONAL,
  link_ip_activo:process.env.LINK_IP_ACTIVO,
  link_ip_gestion_documental:process.env.LINK_IP_GESTION_DOCUMENTAL,
  link_ip_biblioteca:process.env.LINK_IP_BIBLIOTECA,


  api_activo:process.env.API_ACTIVOS,
  api_gestion_documental:process.env.API_DOCUMENTAL,
});