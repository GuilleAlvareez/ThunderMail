export function separateInfo(text) {
  const lineas = text.split(/\r?\n/);

  let to = '';
  let subject = '';
  let content = '';

  for (const linea of lineas) {
    if (linea.startsWith('To:') || linea.startsWith('Para:')) {
      to = linea.replace(/^(To:|Para:)/, '').trim();
    } else if (linea.startsWith('Subject:') || linea.startsWith('Asunto:')) {
      subject = linea.replace(/^(Subject:|Asunto:)/, '').trim();
    }
  }

  // Solo procesar como email si tiene To y Subject
  if (!to || !subject) {
    return null;
  }
  
  const contentIndex = lineas.findIndex(line => 
    line.startsWith('Content:') || line.startsWith('Contenido:')
  );

  // Si existe "Content:" o "Contenido:", unir todas las líneas después como el contenido
  if (contentIndex !== -1) {
    content = lineas.slice(contentIndex + 1).join('\n').trim();
  }

  return { 
    to: to,
    subject: subject,
    content: content 
  };
}
