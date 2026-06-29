const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { sendRecoveryCodeEmail } = require('../config/mailer');

const SALT_ROUNDS = 10;
const CODE_EXPIRATION_MINUTES = 10;
const MAX_RESEND_ATTEMPTS = 5;
const CORPORATE_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@agrovision\.com$/;
const RESEND_COOLDOWN_SECONDS = 60;

// Dominios de correo personal permitidos para recuperación de contraseña
const ALLOWED_PERSONAL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'outlook.es',
  'yahoo.com',
  'yahoo.es',
  'icloud.com',
  'live.com',
  'msn.com',
  'aol.com',
  'protonmail.com',
  'zoho.com',
  'mail.com',
  'gmx.com',
  'yandex.com'
];

function generarCodigo6Digitos() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Valida que un email sea de un dominio personal permitido
function isAllowedPersonalEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailLower = email.toLowerCase();
  const domain = emailLower.split('@')[1];
  
  return ALLOWED_PERSONAL_DOMAINS.includes(domain);
}

async function isPasswordPreviouslyUsed(userId, password) {
  const queryCurrent = `
    SELECT password_hash
    FROM public.usuarios
    WHERE id = $1
    LIMIT 1
  `;

  const currentResult = await pool.query(queryCurrent, [userId]);
  const currentHash = currentResult.rows[0]?.password_hash;

  if (currentHash) {
    const matchesCurrent = await bcrypt.compare(password, currentHash);
    if (matchesCurrent) {
      console.log('Password reuse check: password matches current password for user', userId);
      return true;
    }
  }

  // Limitamos a las últimas 5 contraseñas del historial.
  // Sin este límite, el historial crece para siempre y cada chequeo
  // se vuelve más lento (un bcrypt.compare por cada fila, uno por uno).
  const queryHistory = `
    SELECT password_hash
    FROM public.password_histories
    WHERE usuario_id = $1
    ORDER BY creado_en DESC
    LIMIT 5
  `;

  const historyResult = await pool.query(queryHistory, [userId]);

  for (const row of historyResult.rows) {
    const matchesHistory = await bcrypt.compare(password, row.password_hash);
    if (matchesHistory) {
      console.log('Password reuse check: password matches history for user', userId);
      return true;
    }
  }

  return false;
}

function logControllerError(context, error, req = {}) {
  console.error(`Error en ${context}:`, {
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log('[DEBUG login] Petición recibida. Email:', email, '| Password length:', password?.length);

    if (!email || !password) {
      console.log('[DEBUG login] Rechazado: falta email o password.');
      return res.status(400).json({ success: false, mensaje: 'Email y contraseña son obligatorios.' });
    }

    if (!CORPORATE_EMAIL_PATTERN.test(email.toLowerCase())) {
      console.log('[DEBUG login] Rechazado: el correo no pasa el patrón @agrovision.com. Email recibido:', email.toLowerCase());
      return res.status(400).json({ success: false, mensaje: 'Solo se permite iniciar sesión con correo empresarial @agrovision.com.' });
    }

    const query = `
      SELECT u.id, u.nombres, u.apellidos, u.correo_empresarial, u.correo_personal, u.password_hash, u.activo, r.nombre AS rol
      FROM public.usuarios u
      JOIN public.roles r ON u.rol_id = r.id
      WHERE u.correo_empresarial = $1
      LIMIT 1
    `;
    const emailNormalizado = email.toLowerCase();
    console.log('[DEBUG login] Email tal cual llegó (JSON):', JSON.stringify(email));
    console.log('[DEBUG login] Email normalizado a buscar (JSON):', JSON.stringify(emailNormalizado), '| longitud:', emailNormalizado.length);

    const result = await pool.query(query, [emailNormalizado]);
    console.log('[DEBUG login] Usuarios encontrados con ese correo_empresarial:', result.rows.length);

    // Si no encontró nada, mostramos TODOS los correos empresariales que sí existen
    // en la tabla, en formato JSON, para comparar carácter por carácter.
    if (result.rows.length === 0) {
      const todos = await pool.query('SELECT correo_empresarial FROM public.usuarios');
      console.log('[DEBUG login] Correos empresariales que SÍ existen en la tabla:',
        todos.rows.map(r => JSON.stringify(r.correo_empresarial))
      );
    }

    if (result.rows.length === 0) {
      console.log('[DEBUG login] Rechazado: no existe ningún usuario con correo_empresarial =', email.toLowerCase());
      return res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas.' });
    }

    const usuario = result.rows[0];
    console.log('[DEBUG login] Usuario encontrado:', usuario.id, '| Hash guardado (primeros 15 chars):', usuario.password_hash?.substring(0, 15));

    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    console.log('[DEBUG login] ¿La contraseña coincide con el hash guardado?', passwordMatch);

    if (!passwordMatch) {
      console.log('[DEBUG login] Rechazado: bcrypt.compare devolvió false. La contraseña enviada NO coincide con el hash en la base.');
      return res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas.' });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      console.log('[DEBUG login] Rechazado: el usuario existe y la contraseña es correcta, pero la cuenta está INACTIVA.');
      return res.status(403).json({ 
        success: false, 
        mensaje: 'Esta cuenta ha sido desactivada. Contacte al administrador.' 
      });
    }

    console.log('[DEBUG login] Login exitoso para usuario:', usuario.id);

    const token = jwt.sign(
      { id: usuario.id, email: email.toLowerCase(), rol: usuario.rol },
      process.env.JWT_SECRET || 'jwt_secret',
      { expiresIn: '4h' }
    );

    const rolNormalizado = usuario.rol.toLowerCase() === 'admin' ? 'Admin' : usuario.rol.toLowerCase() === 'agricultor' ? 'Agricultor' : usuario.rol;

    return res.status(200).json({
      success: true,
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre: `${usuario.nombres} ${usuario.apellidos}`.trim(),
        correo: usuario.correo_empresarial || usuario.correo_personal,
        rol: rolNormalizado,
      },
    });
  } catch (error) {
    logControllerError('login', error, req);
    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor.' });
  }
}

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    console.log('requestPasswordReset: Email recibido:', email);
    
    if (!email) {
      console.warn('requestPasswordReset: Email vacío');
      return res.status(400).json({ success: false, mensaje: 'El correo es obligatorio.' });
    }

    // Validar que sea un correo personal de dominio permitido
    if (!isAllowedPersonalEmail(email)) {
      console.warn('requestPasswordReset: Dominio no permitido:', email);
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Use un correo personal (Gmail, Outlook, Yahoo, etc.)' 
      });
    }

    // Solo buscar por correo_personal, no empresarial
    const queryUser = `
      SELECT id
      FROM public.usuarios
      WHERE correo_personal = $1
      LIMIT 1
    `;
    console.log('requestPasswordReset: Buscando usuario con correo personal:', email.toLowerCase());
    const resultUser = await pool.query(queryUser, [email.toLowerCase()]);
    console.log('requestPasswordReset: Resultado de búsqueda:', resultUser.rows.length, 'usuario(s) encontrado(s)');

    if (resultUser.rows.length === 0) {
      console.warn('requestPasswordReset: Usuario no encontrado con email:', email.toLowerCase());
      // Por seguridad, no revelar si el correo existe o no
      return res.status(200).json({ success: true, mensaje: 'Si el correo existe, recibirás un código de verificación.' });
    }

    const usuario = resultUser.rows[0];

    const queryLastCode = `
      SELECT creado_en
      FROM public.codigos_recuperacion
      WHERE usuario_id = $1
      ORDER BY creado_en DESC
      LIMIT 1
    `;
    const lastCodeResult = await pool.query(queryLastCode, [usuario.id]);
    if (lastCodeResult.rows.length > 0) {
      const ultimoEnvio = new Date(lastCodeResult.rows[0].creado_en);
      const segundosDesdeUltimo = Math.floor((Date.now() - ultimoEnvio.getTime()) / 1000);
      if (segundosDesdeUltimo < RESEND_COOLDOWN_SECONDS) {
        const espera = RESEND_COOLDOWN_SECONDS - segundosDesdeUltimo;
        return res.status(429).json({ success: false, mensaje: `Espera ${espera} segundos antes de solicitar otro código.` });
      }
    }

    const codigo = generarCodigo6Digitos();
    const expiraEn = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);
    console.log('requestPasswordReset: Código generado:', codigo, 'Expira en:', expiraEn);

    const queryInsert = `
      INSERT INTO public.codigos_recuperacion (usuario_id, codigo, expira_en, usado, intentos)
      VALUES ($1, $2, $3, false, 0)
      RETURNING id
    `;
    const insertResult = await pool.query(queryInsert, [usuario.id, codigo, expiraEn]);
    console.log('requestPasswordReset: Código insertado en BD con ID:', insertResult.rows[0].id);

    await sendRecoveryCodeEmail(email.toLowerCase(), codigo);
    console.log('requestPasswordReset: Email enviado a:', email.toLowerCase());

    return res.status(200).json({ success: true, mensaje: 'Código de verificación enviado a tu correo.' });
  } catch (error) {
    logControllerError('requestPasswordReset', error, req);
    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor.' });
  }
}

async function verifyCode(req, res) {
  try {
    const { email, codigo } = req.body;
    if (!email || !codigo) {
      return res.status(400).json({ success: false, mensaje: 'Correo y código son obligatorios.' });
    }

    // Solo buscar por correo_personal (flujo de recuperación de contraseña)
    const queryUser = `
      SELECT id
      FROM public.usuarios
      WHERE correo_personal = $1
      LIMIT 1
    `;
    const resultUser = await pool.query(queryUser, [email.toLowerCase()]);

    if (resultUser.rows.length === 0) {
      return res.status(400).json({ success: false, mensaje: 'Código inválido.' });
    }

    const usuario = resultUser.rows[0];
    const queryCode = `
      SELECT id, codigo, expira_en, usado, intentos
      FROM public.codigos_recuperacion
      WHERE usuario_id = $1 AND usado = false
      ORDER BY creado_en DESC
      LIMIT 1
    `;
    const resultCode = await pool.query(queryCode, [usuario.id]);

    if (resultCode.rows.length === 0) {
      return res.status(400).json({ success: false, mensaje: 'Código inválido.' });
    }

    const registro = resultCode.rows[0];
    if (registro.expira_en < new Date()) {
      return res.status(400).json({ success: false, mensaje: 'El código ha expirado.' });
    }

    if (registro.codigo !== codigo) {
      const updateAttempts = `
        UPDATE public.codigos_recuperacion
        SET intentos = intentos + 1
        WHERE id = $1
      `;
      await pool.query(updateAttempts, [registro.id]);
      return res.status(400).json({ success: false, mensaje: 'Código incorrecto.' });
    }

    await pool.query('UPDATE public.codigos_recuperacion SET usado = true WHERE id = $1', [registro.id]);

    return res.status(200).json({ success: true, mensaje: 'Código verificado correctamente.' });
  } catch (error) {
    logControllerError('verifyCode', error, req);
    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor.' });
  }
}

async function changePassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    console.log('authController.changePassword received:', {
      email,
      newPasswordLength: newPassword?.length,
      confirmPasswordLength: confirmPassword?.length,
    });

    if (!email || !newPassword || !confirmPassword) {
      console.log('[DEBUG changePassword] Rechazado: falta algún campo (email/newPassword/confirmPassword vacíos).');
      return res.status(400).json({ success: false, mensaje: 'Todos los campos son obligatorios.' });
    }

    if (newPassword !== confirmPassword) {
      console.log('[DEBUG changePassword] Rechazado: newPassword y confirmPassword NO coinciden.', {
        newPassword,
        confirmPassword,
      });
      return res.status(400).json({ success: false, mensaje: 'Las contraseñas no coinciden.' });
    }

    // Solo buscar por correo_personal (flujo de recuperación de contraseña)
    const queryUser = `
      SELECT id, password_hash
      FROM public.usuarios
      WHERE correo_personal = $1
      LIMIT 1
    `;
    const resultUser = await pool.query(queryUser, [email.toLowerCase()]);

    if (resultUser.rows.length === 0) {
      console.log('[DEBUG changePassword] Rechazado: no se encontró usuario con ese correo:', email.toLowerCase());
      return res.status(400).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    const usuario = resultUser.rows[0];
    const previouslyUsed = await isPasswordPreviouslyUsed(usuario.id, newPassword);
    if (previouslyUsed) {
      console.log('[DEBUG changePassword] Rechazado: la contraseña ya fue usada antes (actual o historial).');
      return res.status(400).json({ success: false, mensaje: 'Contraseña ya usada. Por favor ponga otra contraseña.' });
    }

    console.log('[DEBUG changePassword] Todas las validaciones pasaron, procediendo a actualizar...');

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await pool.query(
      `INSERT INTO public.password_histories (usuario_id, password_hash) VALUES ($1, $2)`,
      [usuario.id, usuario.password_hash]
    );
    await pool.query('UPDATE public.usuarios SET password_hash = $1 WHERE id = $2', [hashedPassword, usuario.id]);

    return res.status(200).json({ success: true, mensaje: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    logControllerError('changePassword', error, req);
    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor.' });
  }
}

async function resendCode(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, mensaje: 'El correo es obligatorio.' });
    }

    // Solo buscar por correo_personal (flujo de recuperación de contraseña)
    const queryUser = `
      SELECT id
      FROM public.usuarios
      WHERE correo_personal = $1
      LIMIT 1
    `;
    const resultUser = await pool.query(queryUser, [email.toLowerCase()]);

    if (resultUser.rows.length === 0) {
      return res.status(200).json({ success: true, mensaje: 'Código reenviado si el correo existe.' });
    }

    const usuario = resultUser.rows[0];
    const queryCode = `
      SELECT id, intentos, creado_en
      FROM public.codigos_recuperacion
      WHERE usuario_id = $1 AND usado = false
      ORDER BY creado_en DESC
      LIMIT 1
    `;
    const resultCode = await pool.query(queryCode, [usuario.id]);

    if (resultCode.rows.length > 0) {
      const registro = resultCode.rows[0];
      const ultimoEnvio = new Date(registro.creado_en);
      const segundosDesdeUltimo = Math.floor((Date.now() - ultimoEnvio.getTime()) / 1000);

      if (segundosDesdeUltimo < RESEND_COOLDOWN_SECONDS) {
        const espera = RESEND_COOLDOWN_SECONDS - segundosDesdeUltimo;
        return res.status(429).json({ success: false, mensaje: `Espera ${espera} segundos antes de reenviar el código.` });
      }

      if (registro.intentos >= MAX_RESEND_ATTEMPTS) {
        return res.status(429).json({ success: false, mensaje: 'Límite de reenvíos alcanzado. Intenta más tarde.' });
      }
    }

    const codigo = generarCodigo6Digitos();
    const expiraEn = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);
    await pool.query(
      'INSERT INTO public.codigos_recuperacion (usuario_id, codigo, expira_en, usado, intentos) VALUES ($1, $2, $3, false, $4)',
      [usuario.id, codigo, expiraEn, (resultCode.rows[0]?.intentos || 0) + 1]
    );

    await sendRecoveryCodeEmail(email.toLowerCase(), codigo);

    return res.status(200).json({ success: true, mensaje: 'Código reenviado correctamente.' });
  } catch (error) {
    logControllerError('resendCode', error, req);
    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor.' });
  }
}

module.exports = {
  login,
  requestPasswordReset,
  verifyCode,
  changePassword,
  resendCode,
};