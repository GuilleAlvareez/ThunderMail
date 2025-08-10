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

async function generateWithModel(modelName, messages) {
  // Verificamos que el nombre del modelo no esté vacío
  if (!modelName) {
    throw new Error("Model name is not defined.");
  }
  
  console.log(`Attempting to generate text with model: ${modelName}`);

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
      }),
    }
  );

  // Si la respuesta no es exitosa (ej. error 4xx, 5xx), lanzamos un error
  if (!response.ok) {
    const errorText = await response.text(); // Leemos el cuerpo del error para más detalles
    throw new Error(`API call failed for model ${modelName} with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Verificación adicional: nos aseguramos de que la respuesta tenga el formato esperado
  if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
    throw new Error(`Invalid or empty response structure from model ${modelName}`);
  }
  
  console.log(`Successfully generated text with model: ${modelName}`);
  return data.choices[0].message.content;
}