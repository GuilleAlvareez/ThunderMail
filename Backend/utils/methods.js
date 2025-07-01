export function separateInfo(text) {
  const lineas = text.split(/\r?\n/);

  let to = '';
  let subject = '';
  let content = '';

  for (const linea of lineas) {
    if (linea.startsWith('To:')) {
      to = linea.replace('To:', '').trim();
    } else if (linea.startsWith('Subject:')) {
      subject = linea.replace('Subject:', '').trim();
    }
  }

  const contentIndex = lineas.findIndex(line => line.startsWith('Content:'));

  // Si existe "Content:", unir todas las líneas después como el contenido
  if (contentIndex !== -1) {
    content = lineas.slice(contentIndex + 1).join('\n').trim();
  }

  console.log(to, subject, content);
  return { 
    to: to,
    subject: subject,
    content: content 
  };
}