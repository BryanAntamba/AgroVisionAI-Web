// Genera un código numérico de 6 dígitos como string, ej: "048213"
function generateSixDigitCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

module.exports = { generateSixDigitCode };
