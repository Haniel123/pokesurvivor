/* ============ firebase-config.js — conexión con tu proyecto de Firebase ============
 * Pega aquí la configuración de tu app web de Firebase (Consola de Firebase >
 * Configuración del proyecto > Tus apps > SDK setup and configuration > Config).
 * Los pasos completos están en docs/FIREBASE.md.
 *
 * Estos datos NO son secretos: Firebase los diseña para ir en la web. Lo que
 * protege las partidas son las reglas de Firestore (firestore.rules).
 *
 * Si se pone a null, el juego funciona en modo local (sólo en el navegador).
 */
// Proyecto pokesurvival-99a53 (nuevo, 20-10-2026; sustituye a pokesurvivor-free):
// autenticación normal de Firebase, SIN Identity Platform, así las cuentas son gratis
// sin límite. ¡No pulsar nunca "Actualizar a Identity Platform" en su consola!
G.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCrdyn8mX9Oqm5mRpXXRohBeH37ijaY1aY',
  authDomain: 'pokesurvival-99a53.firebaseapp.com',
  projectId: 'pokesurvival-99a53',
  storageBucket: 'pokesurvival-99a53.firebasestorage.app',
  messagingSenderId: '1041561320937',
  appId: '1:1041561320937:web:fff26e3b6129d8aa1b9f78',
  databaseURL: 'https://pokesurvival-99a53-default-rtdb.europe-west1.firebasedatabase.app'
};

/* Ejemplo de cómo debe quedar:
G.FIREBASE_CONFIG = {
  apiKey: 'AIza...',
  authDomain: 'tu-proyecto.firebaseapp.com',
  projectId: 'tu-proyecto',
  storageBucket: 'tu-proyecto.firebasestorage.app',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abc123'
};
*/
